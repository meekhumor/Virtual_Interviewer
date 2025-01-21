from django.urls import path
from . import views

urlpatterns = [
    path('stream/', views.stream_video, name='stream_video'),  # Video stream endpoint
    path('eye-status/', views.eye_and_lightning_checker, name='eye_and_lightning_checker'),  # JSON status endpoint
]
