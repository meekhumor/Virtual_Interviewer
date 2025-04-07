from django.urls import path
from .views import CreateUserView, MyTokenObtainPairView,UserDetailsView
from rest_framework_simplejwt.views import TokenRefreshView
from .views import GeminiInterviewView

urlpatterns = [
    path('user/details/', UserDetailsView.as_view(), name='user_details'),
    path("user/register/", CreateUserView.as_view(), name="register"),
    path("token/", MyTokenObtainPairView.as_view(), name="get_token"),  
    path("token/refresh/", TokenRefreshView.as_view(), name="refresh"),
    path("gemini/", GeminiInterviewView.as_view(), name="gemini-interview"),
]


