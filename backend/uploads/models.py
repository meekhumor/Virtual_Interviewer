from django.db import models

class Upload(models.Model):
    file = models.FileField(upload_to='uploads/resumes')
    uploaded_at = models.DateTimeField(auto_now_add=True)
