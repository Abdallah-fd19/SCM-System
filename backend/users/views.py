from django.shortcuts import render
from django.contrib.auth.models import User
from .models import Profile
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from  scm import settings

# Create your views here.

class RegisterView(APIView):
 permission_classes = [AllowAny]

 def post(self, request):
  username = request.data['username']
  password = request.data['password']
  confirm_password = request.data['confirm_password']
  email = request.data['email']
  role = request.data['role']

  if password!=confirm_password:
   return Response({"error":"Passwords do not match"}, status=status.HTTP_400_BAD_REQUEST)

  if not username or not password:
   return Response({"error": "Username and password are required"}, status=status.HTTP_400_BAD_REQUEST)  

  if User.objects.filter(username=username).exists():
   return Response({"error":"Username already taken"}, status=status.HTTP_400_BAD_REQUEST)
  
  user = User.objects.create_user(username=username, password=password, email=email)
  profile = Profile.objects.create(user=user, role=role)

  refresh = RefreshToken.for_user(user)
  response = Response({
    "message": "User Created Successfully",
    "user": {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "role": user.profile.role
    },
    "access": str(refresh.access_token),
    "refresh": str(refresh),
}, status=status.HTTP_201_CREATED)

  return response

class LoginView(APIView):
 permission_classes = [AllowAny]

 def post(self, request):
  username = request.data['username']
  password = request.data['password']

  user = authenticate(username=username, password=password)

  if user is None:
    return Response({"error":"Invalid Credentials"}, status=status.HTTP_401_UNAUTHORIZED)
  
  refresh = RefreshToken.for_user(user)
  response = Response({
    "message": "User Created Successfully",
    "user": {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "role": user.profile.role
    },
    "access": str(refresh.access_token),
    "refresh": str(refresh),
}, status=status.HTTP_201_CREATED)

  return response
  

class LogoutView(APIView):
  def post(self, request):
    response = Response({"message": "Logged out"})
    response.delete_cookie("access_token")
    response.delete_cookie("refresh_token")
    return response

class MeView(APIView):
  permission_classes = [IsAuthenticated]

  def get(self, request):
    user = request.user
    return Response({
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "role": user.profile.role
    })
