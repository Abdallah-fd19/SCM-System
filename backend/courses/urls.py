from django.urls import path
from . import views

urlpatterns = [
 path('', views.CourseListCreateAPIView.as_view(), name='course-list-create'),
 path('enrollments/statistics/', views.EnrollmentStatistics.as_view(), name='assignment-statistics'),
 path('enrollments/', views.EnrollmentListCreateAPIView.as_view(), name='enrollment-list-create'),
 path('enrollments/<str:pk>/', views.DeleteEnrollment.as_view(), name='enrollment-delete'),
 path('assignments/statistics/', views.AssignmentStatistics.as_view(), name='assignment-statistics'),
 path('assignments/', views.AssignmentListCreate.as_view(), name='assignment-list-create'),
 path('assignments/<str:pk>/', views.AssignmentDetailView.as_view(), name='assignment-detail'),
 path('<str:pk>/', views.CourseDetailView.as_view(), name='course-detail'),
]