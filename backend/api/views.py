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
        
        # Carefully extract resume content
        resume_content = ""
        resume_data = tweaks.get("File-icCjQ", {})
        if isinstance(resume_data, dict):
            resume_content = resume_data.get("input_value", "")
        elif resume_data:
            resume_content = str(resume_data)
            
        # Log for debugging
        print(f"User input: {user_input}")
        print(f"Level: {level}")
        print(f"Time: {time}")
        print(f"Resume content length: {len(str(resume_content))}")
        
        # Check if we have enough content to work with
        if not resume_content or len(resume_content) < 10:
            resume_summary = "No detailed resume provided."
        else:
            # If resume is too long, we should summarize it for the API
            if len(resume_content) > 10000:
                resume_summary = resume_content[:10000] + "... (content truncated)"
            else:
                resume_summary = resume_content

        # Craft a prompt that includes the resume and interview context
        prompt = (
            f"You are an AI interview simulator for a {level} level position. "
            f"The interview duration is {time} minutes. "
            f"The following is the candidate's resume or relevant information: \n\n{resume_summary}\n\n"
            f"Based on this information and the {level} level, "
        )
        
        # Add specific instruction based on whether this is the first question or a response
        if not user_input or user_input.lower() in ["start", "begin", "hello", "hi"]:
            prompt += "ask one appropriate initial interview question to start the interview. Make it relevant to their background."
        else:
            prompt += f"respond to the candidate's answer and ask a follow-up question: '{user_input}'"
        
        # Add explicit instruction about format
        prompt += "\nKeep your response conversational and natural like a human interviewer. Ask only one question at a time."

        try:
            # Set appropriate generation parameters
            response = model.generate_content(
                prompt,
                generation_config=genai.types.GenerationConfig(
                    temperature=0.7,
                    max_output_tokens=200,
                )
            )
            
            ai_response = response.text.strip() if response.text else "I couldn't generate a response. Let's try a general question instead. Tell me about your experience."
            
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
