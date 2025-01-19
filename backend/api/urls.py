from django.urls import path
from .views import CreateUserView, MyTokenObtainPairView,UserDetailsView, ProxyRequestView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('user/details/', UserDetailsView.as_view(), name='user_details'),
    path("user/register/", CreateUserView.as_view(), name="register"),
    path("token/", MyTokenObtainPairView.as_view(), name="get_token"),  
    path("token/refresh/", TokenRefreshView.as_view(), name="refresh"),
    path("proxy/", ProxyRequestView.as_view(), name="proxy_request"), 
]


