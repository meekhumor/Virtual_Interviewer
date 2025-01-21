// "Welcome to your virtual interview for the {domain} domain. This interview is designed for a {level} level candidate and will last approximately {minutes} minutes.
// I will ask you a series of questions to assess your knowledge, problem-solving skills, and practical expertise. Please respond to each question to the best of your ability.

// At the end of the interview, I will provide you with an analysis of your performance and a rating. Let's get started!"

import { useState, useRef, useEffect } from "react";
import {
  FiVideo,
  FiMic,
  FiMicOff,
  FiVideoOff,
  FiLogOut,
  FiMessageSquare,
} from "react-icons/fi";
import { AiOutlineInfoCircle } from "react-icons/ai";
import Draggable from "react-draggable";
import { Link } from "react-router-dom";
import { Editor } from "@monaco-editor/react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useInterview } from "../Interview_Context";


export default function Interview_Simulator() {
  const videoRef = useRef(null);
  const [micStatus, setMicStatus] = useState(false);
  const [videoStatus, setVideoStatus] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [showCodeEditor, setShowCodeEditor] = useState(false);
  const [transcriptHistory, setTranscriptHistory] = useState([]);
  const [isTopBarOpen, setIsTopBarOpen] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  const { transcript, listening, resetTranscript } = useSpeechRecognition();
  const { interviewSettings } = useInterview()
  const { level, time, domain } = interviewSettings
  const [text, setText] = useState("");

  const startListening = () => {
    SpeechRecognition.startListening({ continuous: true });
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
  };

  const getVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing webcam: ", err);
    }
  };

  useEffect(() => {
    if (videoStatus) {
      getVideo();
    } else {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
    }
  }, [videoStatus]);


  const handleSpeak = (text) => {
    if (text) {
      const utterance = new SpeechSynthesisUtterance(text);
      // const voices = window.speechSynthesis.getVoices();
      // const prabhatVoice = voices.find(
      //   (voice) =>
      //     voice.name === "Microsoft Prabhat Online (Natural) - English (India)"
      // );

      // if (prabhatVoice) {
      //   utterance.voice = prabhatVoice;
      // }

      utterance.lang = "en-IN";
      utterance.pitch = 1;
      utterance.rate = 1;

      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSendMessage = async (inputMessage) => {
    if (!inputMessage.trim()) {
      console.warn("Input message is empty.");
      return;
    }
  
    setTranscriptHistory((prevHistory) => [
      ...prevHistory,
      { sender: "user", text: inputMessage },
    ]);
  
    const data = {
      input_value: inputMessage,
      tweaks: {
        "TextInput-dQRtu": { input_value: domain },
        "TextInput-ptq20": { input_value: level },
        "TextInput-UZt05": { input_value: time },
      },
    };
  
    try {
      const response = await fetch("http://localhost:8000/api/proxy/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Unauthorized. Please check your access token.");
        } else if (response.status === 500) {
          throw new Error("Server error. Please try again later.");
        }
        throw new Error(`Error: ${response.statusText}`);
      }
  
      const result = await response.json();
      const message = result.outputs?.[0]?.outputs?.[0]?.results?.message?.text || "No response received";
      handleSpeak(message)
  
      setTranscriptHistory((prevHistory) => [
        ...prevHistory,
        { sender: "ai", text: message },
      ]);
    } catch (error) {
      console.error("Error fetching AI response:", error.message);
  
      setTranscriptHistory((prevHistory) => [
        ...prevHistory,
        { sender: "ai", text: error.message },
      ]);
    }
  };

  return (
    
    <div className="flex flex-col justify-between items-center text-white min-h-screen relative">
      {/* Top Bar */}
      <div className={`fixed top-0 max-w-7xl w-full mx-auto ${isTopBarOpen ? "h-28" : "h-8"} bg-zinc-900 flex items-center justify-between px-6 transition-all duration-500 ease-in-out rounded-b-xl z-10`}>
        <div className={`w-full flex ${isTopBarOpen ? "opacity-100" : "opacity-0"} justify-between items-center mb-4 px-6 transition-opacity duration-300`}>
          {/* Time */}
          <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
            <img src="/time.png" alt="Clock" className="w-7 h-7" />
            <p className="text-xl font-semibold">15:45</p>
          </div>

          {/* Question */}
          <div className="w-96 bg-gray-800 h-12 rounded-full overflow-hidden relative flex items-center my-4">
            <div className="bg-blue-600 h-full absolute left-0 top-0" style={{ width: "40%" }}></div>
            <div className="flex justify-between w-full px-4 relative z-10 items-center">
              <img src="/rocket.png" alt="Rocket" className="w-7 h-7" />
              <img src="/goal.png" alt="Goal" className="w-7 h-7" />
            </div>
          </div>

          {/* Analysis and Help */}
          <div className="flex items-center gap-6 h-12">
            <Link to="/analysis" className="bg-yellow-600 text-white font-semibold rounded-lg p-3 flex items-center transition hover:bg-darkblue">
              <img src="/analysis.png" alt="Analysis" className="w-7" />
            </Link>
            <button  onClick={() => { setShowInfo((prev) => !prev); }} className="bg-blue-600 text-white font-semibold rounded-lg p-3 flex items-center transition hover:bg-darkblue">
              <img src="/help.png" alt="Help" className="w-7" />
            </button>
          </div>
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setIsTopBarOpen((prev) => !prev)}
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 bg-zinc-800 px-4 py-2 rounded-full shadow-lg transition-all duration-300 ease-in-out z-30"
        >
          <img
            src="down-arrow.png"
            className={`w-6 transform transition-transform duration-500 ease-in-out ${isTopBarOpen ? "rotate-0" : "rotate-180"}`}
            alt="Toggle"
          />
        </button>
      </div>


      {/* Center Bot */}
      <div
        className={`w-full flex-grow flex justify-center items-center transition-all duration-300 ${
          showMessages ? "ml-1/4" : ""
        } ${showCodeEditor ? "mr-1/4" : ""}`}
      >
        <div className="bg-darkblue bg-opacity-30 w-56 h-56 rounded-full  hover:scale-105 flex items-center justify-center">
          <div
              className={`w-3 h-3 rounded-full shadow-lg ${
                micStatus ? "bg-green-600 animate-pulse" : "bg-red-600"
              }`}
            ></div>
        </div>
      </div>

      {/* User Webcam  */}
      <Draggable bounds="parent">
        <div className="z-10 bg-zinc-950 w-80 h-60 rounded-2xl absolute bottom-36 right-10">
          {videoStatus ? (
            <video
              ref={videoRef}
              autoPlay
              className="w-full h-full rounded-2xl transform scale-x-[-1]"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center shadow-xl">
              <div className="bg-zinc-900 w-28 h-28 rounded-full"></div>
            </div>
          )}
        </div>
      </Draggable>

      {/* Messages  */}
      <div
        className={`absolute left-0 top-0 bottom-24 w-1/4 bg-black z-20 ${
          showMessages ? "" : "hidden"
        }`}
      >
        <div className="bg-darkblue bg-opacity-30 h-full p-4 flex flex-col justify-between">
          <h1 className="text-2xl text-white mb-4">Messages</h1>

          <div className="flex-1 overflow-auto mb-4">
            {transcriptHistory.length > 0 ? (
              transcriptHistory.map((item, index) => (
                <div
                  key={index}
                  className={`flex ${
                    item.sender === "ai" ? "justify-start" : "justify-end"
                  } mb-3`}
                >
                  <div
                    className={`max-w-[75%] p-3 rounded-lg text-white ${
                      item.sender === "ai" ? "bg-gray-600" : "bg-blue1"
                    } rounded-tl-none`}
                  >
                    {item.text}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-white p-3 rounded-lg bg-gray-600">
                Chat with virtual interviewer...
              </div>
            )}
          </div>



          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-grow p-2 px-4 rounded-lg text-black"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage(text);
                  setText("");
                }
              }}
            />
            <button
              className="bg-blue1 hover:bg-darkblue text-lg text-white p-2 px-4 rounded-lg"
              onClick={() => {
                handleSendMessage(text);
                setText("");
              }}
            >
              Send
            </button>
          </div>
        </div>
      </div>

      {/* Code Editor */}
      <div
        className={`absolute right-0 top-0 bottom-24 w-1/4 bg-black z-20 flex flex-col gap-4 ${
          showCodeEditor ? "" : "hidden"
        }`}
      >
          <button className="absolute z-30 text-xl bottom-8 left-1/2 transform -translate-x-1/2 bg-blue1 text-white px-6 py-3 rounded-lg font-semibold hover:bg-darkblue transition duration-300">
            Submit
          </button>

          {/* Code Editor */}
          <Editor
            height="900px"
            defaultLanguage="python"
            defaultValue="# Write your code here"
            theme="vs-dark"
            options={{
              fontSize: 20,
              lineNumbers: "on",
              automaticLayout: true,
              minimap: { enabled: false },
              fontFamily: "'Fira Code', monospace",
            }}
          />
      </div>


      {/* Info  */}
      <div
        className={`fixed inset-0 flex items-center justify-center z-20 ${
          showInfo ? "block" : "hidden"
        }`}
      >
        <div className="relative w-96 h-96 bg-gray-300 rounded-lg shadow-lg">
          <button onClick={() => setShowInfo(false)} className="absolute top-3 right-3 text-gray-700 hover:text-gray-900">
            <img src="/closeLogin.svg" alt="" />
          </button>

          <div className="p-6">
            <h2 className="text-2xl font-semibold text-gray-800">Instructions:</h2>
            <p className="mt-4 text-gray-600">
              This are instructions.
            </p>
          </div>
        </div>
      </div>


      {/* Bottom bar */}
      <div className="w-full bg-darkblue bg-opacity-30 h-24 flex justify-between items-center">
        <button
          onClick={() => setShowMessages((prev) => !prev)}
          className="bg-yellow-600 hover:bg-blue2 p-3 ml-20 rounded-2xl font-bold"
        >
          <FiMessageSquare className="w-8 h-8" />
        </button>

        <div className="flex gap-6">
        <button
          onClick={() => {
            setMicStatus((prev) => {
              if (!prev) {
                // When turning mic ON
                startListening();
              } else {
                // When turning mic OFF
                stopListening();
                handleSendMessage(transcript);
                resetTranscript();
              }
              return !prev;
            });
          }}
          className={`text-white p-3 rounded-2xl hover:bg-darkblue ${
            micStatus ? "bg-blue1" : "bg-gray-600"
          }`}
        >
          {micStatus ? (
            <FiMic className="w-8 h-8" />
          ) : (
            <FiMicOff className="w-8 h-8" />
          )}
        </button>
          <button
            onClick={() => setVideoStatus((prev) => !prev)}
            className={`text-white p-3 rounded-2xl hover:bg-darkblue ${
              videoStatus ? "bg-blue1" : "bg-gray-600"
            }`}
          >
            {videoStatus ? (
              <FiVideo className="w-8 h-8" />
            ) : (
              <FiVideoOff className="w-8 h-8" />
            )}
          </button>
          <button className="text-white p-3 bg-red-600 hover:bg-gray-600 rounded-2xl">
            <FiLogOut className="w-8 h-8" />
          </button>
        </div>

        <button
          onClick={() => setShowCodeEditor((prev) => !prev)}
          className="bg-orange-700 hover:bg-darkblue text-white text-xl p-3 mr-20 rounded-2xl font-bold"
        >
          Code Editor
        </button>
      </div>
    </div>
  );
}
