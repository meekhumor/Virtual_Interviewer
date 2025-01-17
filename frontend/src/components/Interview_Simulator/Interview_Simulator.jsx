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

export default function Interview_Simulator() {
  const videoRef = useRef(null);
  const [micStatus, setMicStatus] = useState(false);
  const [videoStatus, setVideoStatus] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [showCodeEditor, setShowCodeEditor] = useState(false);
  const [isStart, setIsStart] = useState(false);
  const [transcriptHistory, setTranscriptHistory] = useState([]);
  const [isTopBarOpen, setIsTopBarOpen] = useState(true);
  const [showInfo, setShowInfo] = useState(false);

  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  const handleStart = () => {
    setIsStart((prev) => !prev);
    setMicStatus(true);
    startListening();
  };
  const handleStop = () => {
    setIsStart(false);
    stopListening();
    setTranscriptHistory((prevHistory) => [...prevHistory, transcript]);
    resetTranscript();
  };

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

  const [text, setText] = useState("");

  const handleSpeak = () => {
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

  return (
    <div className="flex flex-col justify-between items-center text-white min-h-screen relative">
      {/* Top Bar */}
      <div
        className={`absolute top-0 max-w-7xl w-full mx-auto ${
          isTopBarOpen ? "h-8" : "h-24"
        } bg-darkblue bg-opacity-30 flex items-center justify-center transition-all duration-500 ease-in-out rounded-b-xl`}
      >
        <div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            cols={150}
            placeholder="Type text here"
            className="text-black"
          />
          <button onClick={handleSpeak}>Speak</button>
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setIsTopBarOpen((prev) => !prev)}
          className="absolute bottom-0 transform translate-y-1/2 bg-gray-900 px-4 py-2 rounded-full shadow-lg transition-all duration-300 ease-in-out"
        >
          <img
            src="down-arrow.png"
            className={`w-6 transform transition-transform duration-500 ease-in-out ${
              isTopBarOpen ? "rotate-0" : "rotate-180"
            }`}
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
        <div className="rounded-full absolute top-8 hover:scale-110 right-8 cursor-pointer">
          <AiOutlineInfoCircle
            size={40}
            onClick={() => {
              setShowInfo((prev) => !prev);
            }}
            className="text-gray-500"
          />
        </div>
        <div className="bg-darkblue bg-opacity-30 w-56 h-56 rounded-full  hover:scale-105"></div>
      </div>

      {/* User Webcam  */}
      <Draggable bounds="parent">
        <div className="z-10 bg-darkblue bg-opacity-30 w-80 h-60 rounded-2xl absolute bottom-36 right-10">
          {videoStatus ? (
            <video
              ref={videoRef}
              autoPlay
              className="w-full h-full rounded-2xl transform scale-x-[-1]"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center shadow-xl">
              <div className="bg-darkblue bg-opacity-20 w-28 h-28 rounded-full"></div>
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
                <div key={index} className="flex justify-end mb-3">
                  <div className="max-w-[75%] p-3 rounded-lg text-white bg-blue1 rounded-tl-none">
                    {item}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-white p-3 rounded-lg bg-gray-600">
                Start speaking to see the transcript here...
              </div>
            )}
          </div>

          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-grow p-2 px-4 rounded-lg text-black"
            />
            <button className="bg-blue1 hover:bg-darkblue text-lg text-white p-2 px-4 rounded-lg">
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
        <div className="bg-darkblue bg-opacity-30  w-full flex flex-col justify-between overflow-hidden">
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
      </div>

      {/* Info  */}
      <div
        className={`absolute right-10 top-20 w-96 h-96 bg-gray-300 rounded-lg ${
          showInfo ? "" : "hidden"
        }`}
      ></div>

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
            onClick={handleStart}
            className={`${
              isStart ? "bg-yellow-600 p-3" : "bg-green-600 p-4"
            } hover:bg-blue2 rounded-2xl font-bold`}
          >
            <img
              src={isStart ? "pause.svg" : "start.svg"}
              className={`${isStart ? "w-8" : "w-6"}`}
              alt=""
            />
          </button>
          <button
            onClick={handleStop}
            className="bg-red-600 hover:bg-blue2 text-white text-xl p-4 rounded-2xl font-bold"
          >
            <img src="stop.svg" className="w-6" alt="" />
          </button>
        </div>

        <div className="flex gap-6">
          <button
            onClick={() => setMicStatus((prev) => !prev)}
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

        <div className="flex gap-4 items-center">
          <p className="text-2xl font-bold">Listening</p>
          <div
            className={`w-3 h-3 rounded-full shadow-lg ${
              isStart ? "bg-green-600 animate-pulse" : "bg-red-600"
            }`}
          ></div>
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
