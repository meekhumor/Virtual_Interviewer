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
        # Langflow API URL
        api_url = "https://api.langflow.astra.datastax.com/lf/b1444534-75cd-484e-b621-881da671f9f4/api/v1/run/96657cc8-9513-47e6-ad14-e51259c3b699?stream=false"
        
        # Add your hardcoded Authorization token here
        headers = {
            "Authorization": "Bearer AstraCS:sldQgbDhPFPNQZgqTmlHZguP:d94cae892b0872def338d726f95faeb0a96c1cc402bd4096d59dd4211670566d",  # Your token here
            "Content-Type": "application/json",
        }
        
        # Capture the incoming data from the request body
        request_data = request.data

        try:
            # Forward the request to Langflow API
            response = requests.post(api_url, json=request_data, headers=headers)

            # If the response status is not OK, raise an exception
            response.raise_for_status()

            # Return the response from Langflow API
            return Response(response.json(), status=response.status_code)

        except requests.exceptions.RequestException as e:
            # Handle errors and return the error message to the frontend
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
