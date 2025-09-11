from rest_framework import serializers
from .models import Course, Enrollment, Assignment
from users.serializers import ProfileSerializer

class CourseSerializer(serializers.ModelSerializer):
    teacher_username = serializers.CharField(source='teacher.user.username', read_only=True)
    
    class Meta:
        model = Course
        fields = ['id', 'name', 'description', 'teacher', 'teacher_username', 'created_at', 'updated_at']

class EnrollmentSerializer(serializers.ModelSerializer):
    # Use nested serializers for course and student
    course = CourseSerializer(read_only=True)
    student = ProfileSerializer(read_only=True)
    
    class Meta:
        model = Enrollment
        fields = ['id', 'student', 'course', 'enrolled_at', 'updated_at']

class EnrollmentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enrollment
        fields = ['course']

class AssignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assignment
        fields = "__all__"