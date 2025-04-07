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
import google.generativeai as genai

class GeminiInterviewView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        # Configure Gemini with your API key
        genai.configure(api_key="AIzaSyBpGfLXNlbO8V0kDkUb5WrRcC4PaEF-C-M")  # Replace with your actual key

        # Extract data from the request
        data = request.data
        user_input = data.get("input_value", "")
        level = data.get("tweaks", {}).get("TextInput-QXLsN", {}).get("input_value", "Internship")
        time = data.get("tweaks", {}).get("TextInput-XXLvP", {}).get("input_value", "20")
        resume = data.get("tweaks", {}).get("File-icCjQ", {}).get("input_value", None)

        # Choose a Gemini model (e.g., 1.5 Flash for speed)
        model = genai.GenerativeModel("gemini-1.5-flash")

        # Craft a prompt that includes the resume and interview context
        prompt = (
            f"You are an AI interview simulator for a {level} level position. "
            f"The interview duration is {time} minutes. "
            f"Here is the candidate's resume: {resume if resume else 'No resume provided.'}\n\n"
            f"Based on the resume and the level, ask a relevant interview question or respond to this input: '{user_input}'."
        )

        try:
            response = model.generate_content(prompt)
            ai_response = response.text.strip() or "Sorry, I couldn’t generate a response."
            return Response({
                "outputs": [{
                    "outputs": [{"results": {"message": {"text": ai_response}}}]}]},
                status=200
            )
        except Exception as e:
            return Response({"error": f"Gemini API error: {str(e)}"}, status=500)

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
