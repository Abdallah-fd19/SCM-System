from django.db import models

# Create your models here.
class Course(models.Model):
 name = models.CharField(max_length=200)
 description = models.TextField()
 teacher = models.ForeignKey('users.Profile', on_delete=models.CASCADE, null=True, blank=True)
 created_at = models.DateTimeField(auto_now_add=True)
 updated_at = models.DateTimeField(auto_now=True)

class Enrollment(models.Model):
 student = models.ForeignKey('users.Profile', on_delete=models.CASCADE, null=True, blank=True)
 course = models.ForeignKey(Course, on_delete=models.CASCADE)
 enrolled_at = models.DateTimeField(auto_now_add=True)
 updated_at = models.DateTimeField(auto_now=True)

 class Meta:
  unique_together = ('student', 'course') # prevent duplicate enrollment

 def __str__(self):
  return f"{self.student.usename} -> {self.course.name}"
 

class Assignment(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = models.TextField()
    due_date = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.title} ({self.course.name})"
    
