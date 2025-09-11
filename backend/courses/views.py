from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Course, Enrollment, Assignment
from users.models import Profile
from .serializers import CourseSerializer, EnrollmentSerializer, AssignmentSerializer, EnrollmentCreateSerializer

# Create your views here. 

# --- Course Views ---

class CourseListCreateAPIView(APIView):
 permission_classes = [IsAuthenticated]

 def get(self, request):
  if request.user.profile.role == 'teacher':
    # Teachers see only their own courses
    courses = Course.objects.filter(teacher=request.user.profile)
  else:
    # Students see all available courses
    courses = Course.objects.all()
  serializer = CourseSerializer(courses, many=True)
  return Response(serializer.data)
 
 def post(self, request):

  if request.user.profile.role!='teacher':
    return Response({"error":"Only teachers can create courses"}, status=status.HTTP_403_FORBIDDEN)
  
  serializer = CourseSerializer(data=request.data)
  if serializer.is_valid():
    serializer.save(teacher=request.user.profile)
    return Response(serializer.data, status=status.HTTP_201_CREATED)
  return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CourseDetailView(APIView):
 permission_classes = [IsAuthenticated]

 def get(self, request, pk):
  try:
    course = Course.objects.get(id=pk)
  except Course.DoesNotExist:
    return Response({"error":"course not found"}, status=status.HTTP_404_NOT_FOUND)
  
  serializer = CourseSerializer(course)
  return Response(serializer.data)
 
 def put(self, request, pk):
  if request.user.profile.role!='teacher':
    return Response({"error":"Only teachers can update courses"}, status=status.HTTP_403_FORBIDDEN)
  
  try:
    course = Course.objects.get(id=pk, teacher=request.user.profile)
  except Course.DoesNotExist:
    return Response({"error":"course not found"}, status=status.HTTP_404_NOT_FOUND) 


  serializer = CourseSerializer(course, data=request.data)
  if serializer.is_valid():
    serializer.save()
    return Response(serializer.data)
  return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
 
 def delete(self, request, pk):
  if request.user.profile.role!='teacher':
    return Response({"error":"Only teachers can delete courses"}, status=status.HTTP_403_FORBIDDEN)
  
  try:
    course = Course.objects.get(id=pk, teacher=request.user.profile)
  except Course.DoesNotExist:
    return Response({"error":"course not found"}, status=status.HTTP_404_NOT_FOUND)

  course.delete()
  return Response(status=status.HTTP_204_NO_CONTENT)
  
# --- Enrollment Views ---

class EnrollmentListCreateAPIView(APIView):
  permission_classes = [IsAuthenticated]

  def get(self, request):
    try:
      # Students only see their enrollments
      if request.user.profile.role=='student':
        enrollments = Enrollment.objects.filter(student=request.user.profile)
      else:
      # Teachers see their enrollments
        enrollments = Enrollment.objects.filter(course__teacher=request.user.profile)
      
      serializer = EnrollmentSerializer(enrollments, many=True)
      return Response(serializer.data)
    except Exception as e:
      return Response({"error": f"Error fetching enrollments: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

  def post(self, request):
    if request.user.profile.role!='student':
      return Response({"error":"Only students can enroll in courses"}, status=status.HTTP_403_FORBIDDEN)

    serializer = EnrollmentCreateSerializer(data=request.data)
    if serializer.is_valid():
      enrollment = serializer.save(student=request.user.profile)
      read_serializer = EnrollmentSerializer(enrollment)
      return Response(read_serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DeleteEnrollment(APIView):
  permission_classes=[IsAuthenticated]

  def delete(self, request, pk):
    if request.user.profile.role!='student':
      return Response({"error":"Only students can unenroll from courses"}, status=status.HTTP_403_FORBIDDEN)
    
    try:
      enrollment = Enrollment.objects.get(id=pk, student=request.user.profile)
    except Enrollment.DoesNotExist:
      return Response({"error":"enrollment not found"}, status=status.HTTP_404_NOT_FOUND)
    
    enrollment.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)
    

class AssignmentListCreate(APIView):
  permission_classes = [IsAuthenticated]

  def get(self, request):
    if request.user.profile.role == 'student':
      enrollments = Enrollment.objects.filter(student=request.user.profile)
      courses = [enrollment.course for enrollment in enrollments]
      assignments = Assignment.objects.filter(course__in=courses) 
    elif request.user.profile.role == 'teacher':
      teacher = request.user.profile
      courses = teacher.course_set.all()
      assignments = Assignment.objects.filter(course__in=courses)

    serializer = AssignmentSerializer(assignments, many=True)
    return Response(serializer.data)
  
  def post(self, request):
    if request.user.profile.role != 'teacher':
      return Response({"error":"Only teachers can create assignments"}, status=status.HTTP_403_FORBIDDEN)
    
    serializer = AssignmentSerializer(data=request.data)
    if serializer.is_valid():
        # Check if teacher has this course
        course_id = serializer.validated_data.get('course').id
        try:
          course = Course.objects.get(id=course_id, teacher=request.user.profile)
        except Course.DoesNotExist:
          return Response({"error":"You can only add assignments to your courses"}, status=status.HTTP_403_FORBIDDEN)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
  
class AssignmentDetailView(APIView):
  permission_classes = [IsAuthenticated]

  def get(self, request, pk):
    try:
      assignment = Assignment.objects.get(id=pk)
    except Assignment.DoesNotExist:
      return Response({"error":"Assignment not found"}, status=status.HTTP_404_NOT_FOUND)
    
    if request.user.profile.role == 'student':
      if not Enrollment.objects.filter(student=request.user.profile, course=assignment.course).exists():
        return Response({"error": "You are not enrolled in this course"}, status=status.HTTP_403_FORBIDDEN)
                                
    elif request.user.profile.role == 'teacher':
      if assignment.course.teacher != request.user.profile:
        return Response({"error": "You can only access your own assignments"}, status=status.HTTP_403_FORBIDDEN)

    serializer = AssignmentSerializer(assignment)
    return Response(serializer.data)

  def put(self, request, pk):
    if request.user.profile.role != 'teacher':
      return Response({"error":"Only teachers can update assignments"}, status=status.HTTP_403_FORBIDDEN)

    try:
      assignment = Assignment.objects.get(id=pk, course__teacher=request.user.profile)
    except Assignment.DoesNotExist:
      return Response({"error":"Assignment not found"}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = AssignmentSerializer(assignment, data=request.data)
    if serializer.is_valid():
      serializer.save()
      return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
  def delete(self, request, pk):
      if request.user.profile.role != 'teacher':
          return Response({"error": "Only teachers can delete assignments"},
                            status=status.HTTP_403_FORBIDDEN)

      try:
          assignment = Assignment.objects.get(id=pk, course__teacher=request.user.profile)
      except Assignment.DoesNotExist:
          return Response({"error": "Assignment not found"},
                            status=status.HTTP_404_NOT_FOUND)

      assignment.delete()
      return Response(status=status.HTTP_204_NO_CONTENT)  





