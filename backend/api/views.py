from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import MyTokenObtainPairSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
import requests



class ProxyRequestView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        api_url = "https://api.langflow.astra.datastax.com/lf/b1444534-75cd-484e-b621-881da671f9f4/api/v1/run/13515189-21af-4792-9cf1-59ca061da351?stream=false"
        
        headers = {
            "Authorization": "Bearer AstraCS:HrjJmTTwgfyRebnQsKmAQSdD:5a91655534e3149afc18f0b18c3afde57cd242d677fdb565512f7c122795e6c7",
            "Content-Type": "application/json",
        }
    
        request_data = request.data

        try:
            response = requests.post(api_url, json=request_data, headers=headers)
            response.raise_for_status()
            return Response(response.json(), status=response.status_code)

        except requests.exceptions.RequestException as e:
            return Response({"error": str(e)}, status=500)


class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class UserDetailsView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        user = request.user
        return Response({
            'username': user.username,
            'email': user.email,
        })
