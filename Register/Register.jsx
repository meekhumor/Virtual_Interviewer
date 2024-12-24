import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CardSign from "./CardSign";
import axios from "axios";
import LoginModal from "../frontend/src/components/Login/LoginModal"; // Import the LoginModal component

const signup = [
  {
    title: "Put on the pressure",
    description: "We simulate the interview and the pressure, for the most realistic experience possible",
  },
  {
    title: "AI powered interviews",
    description: "Upload your resume and job description for custom-tailored practice sessions.",
  },
  {
    title: "Practice smarter, not harder.",
    description: "We use your built-in camera to help you improve in less time than any other option.",
  },
];

export default function Register() {
  const [email, setEmail] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal
  const [errorMessage, setErrorMessage] = useState(""); // State to manage error message
  const navigate = useNavigate();

  const getCSRFToken = () => {
    let csrfToken = null;
    const cookies = document.cookie.split(';');
    cookies.forEach(cookie => {
      if (cookie.trim().startsWith('csrftoken=')) {
        csrfToken = cookie.trim().substring('csrftoken='.length);
      }
    });
    return csrfToken;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const csrfToken = getCSRFToken();
    try {
      const response = await axios.post('/accounts/register/', { email }, {
        headers: { 'X-CSRFToken': csrfToken },
      });
      if (response.data.message) {
        navigate('/dashboard'); // Redirect to dashboard if registration is successful
      }
    } catch (error) { setErrorMessage(error.response.data.error); }
  };

  return (
    <div className="mx-auto w-full max-w-10xl">
      <div className="flex mx-3xl">
        {/* Left */}
        <div className="hidden lg:flex lg:flex-col lg:w-1/3 bg-darkblue bg-opacity-40 px-14 py-14">
          <h1 className="text-white text-3xl mb-12 mt-12 w-56">Land a job worth loving.</h1>
          <div className="flex flex-col justify-center gap-2">
            {signup.map((step, index) => (
              <div key={index}>
                <div>
                  <CardSign title={step.title} description={step.description} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right */}
        <div className="flex flex-col w-2/3 mt-16 h-screen mr-14">
          <div className="flex gap-4 items-center justify-end">
            <p className="text-gray-400 text-sm">Already have an account?</p>
            <button 
              className="rounded-full text-sm text-gray-700 bg-white px-4 py-2"
              onClick={() => setIsModalOpen(true)} // Open login modal on click
            >
              Sign In
            </button>
          </div>

          <div className="flex flex-col my-24 m-auto scale-110">
            <h1 className="text-white text-3xl mb-14">Sign Up</h1>

            <form onSubmit={handleRegister} className="flex flex-col">
              <label htmlFor="email" className="text-gray-200 ml-2 mb-2">
                Email
              </label>
              <input 
                type="email" 
                className="rounded-full border-2 w-80 py-2 pl-4 mb-4"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button 
                type="submit" 
                className="mt-2 bg-blue1 hover:bg-blue-700 text-white py-2 px-4 rounded-full w-28"
              >
                Continue
              </button>
            </form>

            {errorMessage && <p className="mt-4 text-red-500">{errorMessage}</p>}
          </div>
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
