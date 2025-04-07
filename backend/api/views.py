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
        model = genai.GenerativeModel("gemini-1.5-flash")

        # Extract data from the request
        data = request.data
        user_input = data.get("input_value", "")
        
        # Extract interview parameters from tweaks
        tweaks = data.get("tweaks", {})
        level = tweaks.get("TextInput-QXLsN", {}).get("input_value", "Internship")
        time = tweaks.get("TextInput-XXLvP", {}).get("input_value", "20")
        
        # Log for debugging
        print(f"User input: {user_input}")
        print(f"Level: {level}")
        print(f"Time: {time}")
        
        # Craft a prompt without resume
        prompt = (
            f"You are an AI interview simulator for a {level} level position. "
            f"The interview duration is {time} minutes. "
        )
        
        # Handle initial greeting or follow-up
        if not user_input or user_input.lower() in ["hello", "hi", "start", "begin"]:
            prompt += (
                f"Greet the candidate warmly in a conversational tone. "
                f"Inform them that this is a {level} level interview lasting {time} minutes. "
                f"Then ask: 'What’s your name, and what topics would you like to discuss during this interview?'"
            )
        else:
            prompt += f"Respond naturally to the candidate’s input: '{user_input}'. Then ask one relevant follow-up question based on their response and the {level} level."

        # Add format instruction
        prompt += "\nKeep your response conversational, like a human interviewer. Ask only one question at a time."

        try:
            # Set generation parameters
            response = model.generate_content(
                prompt,
                generation_config=genai.types.GenerationConfig(
                    temperature=0.7,
                    max_output_tokens=200,
                )
            )
            
            ai_response = response.text.strip() if response.text else "Hello! I’m here to help you with your interview practice. What’s your name, and what topics would you like to discuss?"
            
            return Response({
                "outputs": [{
                    "outputs": [{"results": {"message": {"text": ai_response}}}]}]},
                status=200
            )
        except Exception as e:
            print(f"Gemini API error: {str(e)}")
            return Response({"error": f"Error generating interview question: {str(e)}"}, status=500)

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