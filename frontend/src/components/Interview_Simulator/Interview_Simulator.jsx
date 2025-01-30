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
import Draggable from "react-draggable";
import { Link } from "react-router-dom";
import { Editor } from "@monaco-editor/react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import axios from 'axios';

import { X } from 'lucide-react';


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
  const [text, setText] = useState("");
  const [timeLeft, setTimeLeft] = useState("1200"); 
  const [isRunning, setIsRunning] = useState(false);
  const [Level, setLevel] = useState("Internship");
  const [Time, setTime] = useState("20");
  const [resume, setResume] = useState(null);
  const [micStartTime, setMicStartTime] = useState(null); 


  
  useEffect(() => {
    const storedTime = sessionStorage.getItem("interviewTime");
    const storedLevel = sessionStorage.getItem("interviewLevel");
    const storedResume = localStorage.getItem("resume");

    setResume(storedResume); 
    setTime(storedTime)
    setLevel(storedLevel)

    if (storedTime) {
      setTimeLeft(parseInt(storedTime) * 60); 
    }
  }, []);

  useEffect(() => {
    let timer;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);



  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const startListening = () => {
    setMicStartTime(Date.now()); 
    SpeechRecognition.startListening({ continuous: true });
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();

    if (micStartTime) {
      const elapsedTime = Date.now() - micStartTime;  
      console.log(`Mic was on for ${elapsedTime / 1000} seconds`);
    }
  };

  const getVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      console.log("Stream obtained:", stream);
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
    } else if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
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
        "TextInput-QXLsN": { input_value: Level },
        "TextInput-XXLvP": { input_value: Time },
        "File-icCjQ": {input_value: resume},
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
      console.log(result)
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
            <img src="/clock.png" alt="Clock" className="w-7 h-7" />
            {timeLeft !== null && <p className="text-xl font-semibold">{formatTime(timeLeft)}</p>}
          </div>

          {/* Progress Bar */}
          <div className="w-96 bg-gray-800 h-12 rounded-full overflow-hidden relative flex items-center my-4">
            <div className="bg-blue-600 h-full absolute left-0 top-0" style={{ width: `${((Time * 60 - timeLeft) / (Time * 60)) * 100}%` }}></div>
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
      className={`
        absolute left-0 top-0 bottom-24 md:w-1/4 w-2/5 z-20
        transform transition-transform duration-300 ease-in-out
        ${showMessages ? 'translate-x-0' : '-translate-x-full '}
      `}
      >
        <div className="h-full bg-zinc-950 border-r border-zinc-800/50 flex flex-col">
          {/* Header */}
          <div className="px-4 py-3 border-b border-zinc-800/50 bg-zinc-900/50 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue1 animate-pulse"></div>
                <h1 className="text-lg font-medium text-zinc-100">Interview Chat</h1>
              </div>
              <button
                onClick={() => setShowMessages(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-colors"
                aria-label="Close messages"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
            {transcriptHistory.length > 0 ? (
              transcriptHistory.map((item, index) => (
                <div
                  key={index}
                  className={`flex ${
                    item.sender === "ai" ? "justify-start" : "justify-end"
                  } group`}
                >
                  <div
                    className={`
                      max-w-[85%] p-3 rounded-2xl text-sm
                      ${item.sender === "ai" 
                        ? "bg-zinc-800/75 text-zinc-200 rounded-tl-none" 
                        : "bg-blue1 text-white rounded-tr-none"
                      }
                      backdrop-blur-sm shadow-lg
                    `}
                  >
                    {item.text}
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
                <div className="w-12 h-12 rounded-full bg-zinc-800/50 flex items-center justify-center">
                  <FiMessageSquare className="w-6 h-6 text-zinc-500" />
                </div>
                <div className="text-zinc-500 text-sm">
                  Start your interview conversation...
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-3 border-t border-zinc-800/50 bg-zinc-900/50 backdrop-blur-sm">
            <div className="flex gap-2 items-center">
              <input
                type="text"
                placeholder="Type your response..."
                className="flex-grow p-2.5 px-4 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-200 placeholder-zinc-400 focus:outline-none focus:border-blue1/50 focus:ring-1 focus:ring-blue1/25 transition-colors"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && text.trim()) {
                    handleSendMessage(text);
                    setText("");
                  }
                }}
              />
              <button
                className="p-2.5 rounded-xl bg-blue1 text-white hover:bg-blue1 transition-all"
                onClick={() => {
                  if (text.trim()) {
                    handleSendMessage(text);
                    setText("");
                  }
                }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Code Editor */}
      <div 
      className={`
        absolute right-0 top-0 bottom-24 md:w-1/4 w-2/5 z-20
        transform transition-transform duration-300 ease-in-out 
        ${showCodeEditor ? 'block' : 'hidden'}
      `}
      >
        <div className="h-full bg-zinc-950 border-l border-zinc-800/50 flex flex-col">
          {/* Header */}
          <div className="px-4 py-3 border-b border-zinc-800/50 bg-zinc-900/50 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-medium text-zinc-100">Code Solution</h1>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  className="px-3 py-1.5 text-sm font-medium text-white bg-blue1 rounded-lg hover:bg-blue1/80 focus:outline-none focus:ring-2 focus:ring-blue1/50 focus:ring-offset-1 focus:ring-offset-zinc-900 transition-all"
                  onClick={() => console.log("Submit button clicked")}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>

          {/* Editor Container */}
          <div className="flex-1 overflow-hidden bg-zinc-950">
            <Editor
              height="100%"
              width="100%"
              defaultLanguage="python"
              defaultValue="# Write your solution here"
              theme="vs-dark"
              options={{
                fontSize: 14,
                lineNumbers: "on",
                automaticLayout: true,
                minimap: { enabled: false },
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                padding: { top: 16 },
                scrollBeyondLastLine: false,
                smoothScrolling: true,
                cursorBlinking: "smooth",
                cursorSmoothCaretAnimation: true,
                renderLineHighlight: "all",
                lineHeight: 1.6,
                letterSpacing: 0.5,
                tabSize: 4,
                theme: {
                  base: 'vs-dark',
                  inherit: true,
                  rules: [],
                  colors: {
                    'editor.background': '#09090b',
                    'editor.lineHighlightBackground': '#18181b',
                    'editorLineNumber.foreground': '#3f3f46',
                    'editorLineNumber.activeForeground': '#71717a',
                  }
                }
              }}
              beforeMount={(monaco) => {
                monaco.editor.defineTheme('custom-dark', {
                  base: 'vs-dark',
                  inherit: true,
                  rules: [],
                  colors: {
                    'editor.background': '#09090b',
                    'editor.lineHighlightBackground': '#18181b',
                    'editorLineNumber.foreground': '#3f3f46',
                    'editorLineNumber.activeForeground': '#71717a',
                  }
                });
                monaco.editor.setTheme('custom-dark');
              }}
            />
          </div>
        </div>
      </div>


      {/* Info  */}
      <div
      className={`fixed inset-0 flex items-center justify-center z-20 bg-black/50 ${
        showInfo ? "block" : "hidden"
        }`}
      >
        <div className="relative w-[800px] max-h-[85vh] bg-white rounded-xl shadow-2xl overflow-y-auto text-black2">
          {/* Fun wavy top decoration */}
          <div className="absolute top-0 left-0 w-full">
            <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-8">
              <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
                    className="fill-blue1">
              </path>
            </svg>
          </div>

          <button 
            onClick={() => setShowInfo(false)} 
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 z-10"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="p-10 pt-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800">Ready to Ace Your Interview? </h2>
              <p className="text-gray-600 mt-2">Here's your guide to mastering our interview simulator</p>
            </div>

            {/* Interactive Elements Section */}
            <div className="mb-8">
              <div className="bg-gray-50 p-6 rounded-xl space-y-4">
                <div className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="bg-red-100 p-3 rounded-full">🎤</div>
                  <div>
                    <h4 className="font-semibold">Microphone Magic</h4>
                    <p className="text-gray-600">Watch for the blinking light - that's your cue! Click to speak, release when done. Simple as that!</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="bg-blue-100 p-3 rounded-full">📹</div>
                  <div>
                    <h4 className="font-semibold">Video Vibes</h4>
                    <p className="text-gray-600">Toggle your camera to practice those winning expressions and professional poses.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="bg-green-100 p-3 rounded-full">💻</div>
                  <div>
                    <h4 className="font-semibold">Code Mode</h4>
                    <p className="text-gray-600">Got a coding challenge? Hit the code submission button to show off your skills!</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="bg-yellow-100 p-3 rounded-full">💭</div>
                  <div>
                    <h4 className="font-semibold">Chat Channel</h4>
                    <p className="text-gray-600">Need to type instead? The message button is your friend!</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Tracking */}
            <div className="mb-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl">
                  <h4 className="font-semibold mb-2">⏳ Time & Progress</h4>
                  <p className="text-gray-600">Keep an eye on the top bar - it shows your time left and how far you've come!</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl">
                  <h4 className="font-semibold mb-2">📈 Performance Insights</h4>
                  <p className="text-gray-600">Check your analysis anytime to see how you're doing.</p>
                </div>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-xl">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <span className="bg-yellow-100 text-yellow-600 p-2 rounded-lg mr-2">💡</span>
                Pro Tips
              </h3>
              <ul className="space-y-2">
                <li className="flex items-center space-x-2">
                  <span className="text-orange-400">•</span>
                  <span>Need a breather? Hit the Leave button anytime</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-orange-400">•</span>
                  <span>Your interview ends automatically when the progress bar fills up</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-orange-400">•</span>
                  <span>Help button is always there if you need a refresher!</span>
                </li>
              </ul>
            </div>
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
            setIsRunning((prev) => !prev);
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
          className="bg-orange-600 hover:bg-darkblue text-white text-xl p-3 mr-20 rounded-2xl font-bold"
        >
          <img src="/code.png" alt="" className="w-8"/>
        </button>
      </div>
    </div>
  );
}
