import { useState, useRef, useEffect } from "react";
import { FiVideo, FiMic, FiMicOff, FiVideoOff, FiLogOut, FiMessageSquare } from "react-icons/fi";
import Draggable from "react-draggable";
import { Editor } from "@monaco-editor/react";

export default function Interview_Simulator() {
  const videoRef = useRef(null);
  const [micStatus, setMicStatus] = useState(false);
  const [videoStatus, setVideoStatus] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [showCodeEditor, setShowCodeEditor] = useState(false);

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
      // Stop all video tracks when the video is turned off
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
    }
  }, [videoStatus]);

  return (
    <div className="flex flex-col justify-between items-center text-white min-h-screen relative">
      <div
        className={`w-full flex-grow flex justify-center items-center transition-all duration-300 ${
          showMessages ? "ml-1/4" : ""
        } ${showCodeEditor ? "mr-1/4" : ""}`}
      >
        <div className="w-56 h-56 rounded-full bg-darkblue bg-opacity-30"></div>
      </div>

      <Draggable>
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

      {showMessages && (
        <div className="absolute left-0 top-0 bottom-24 w-1/4 bg-black2 p-4 overflow-auto">
          <h2 className="text-white text-xl">Messages</h2>
          <div className="flex flex-col gap-2 mt-4">
            {/* Add your message bubbles here */}
            <div className="bg-white text-black p-2 rounded-lg">
              Hello, how can I help you today?
            </div>
            <div className="bg-blue-500 text-white p-2 rounded-lg self-end">
              I need assistance with my code.
            </div>
            {/* Add more message bubbles as needed */}
          </div>
          <div className="mt-4 flex">
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-grow p-2 rounded-lg text-black"
            />
            <button className="bg-blue-500 text-white p-2 rounded-lg ml-2">
              Send
            </button>
          </div>
        </div>
      )}

      {showCodeEditor && (
        <div className="absolute flex flex-col gap-6 z-20 right-0 top-0 bottom-24 w-1/4 bg-black2 ">
          <Editor
            height="700px"
            defaultLanguage="javascript"
            defaultValue="// Type your code here"
            theme="night-owl"
          />
          <button className="bg-blue1  w-2/3 text-white p-2 rounded-lg">
            Submit
          </button>
        </div>
      )}

      {/* Bottom bar */}
      <div className="w-full bg-darkblue bg-opacity-30 h-24 flex justify-between items-center">
        {/* Messages  */}
        <button
          onClick={() => {
            setShowMessages(!showMessages);
            setShowCodeEditor(false);
          }}
          className="bg-yellow-600 hover:bg-blue2 text-white text-xl p-3 ml-20 rounded-2xl font-bold"
        >
          <FiMessageSquare className="w-8 h-8 " />
        </button>

        {/* User inputs  */}
        <div className="flex gap-6">
          <button
            onClick={() => {
              setMicStatus(!micStatus);
            }}
            className={`text-white p-3 rounded-2xl hover:bg-darkblue ${
              micStatus ? "bg-blue1" : "bg-gray-600"
            }`}
          >
            {micStatus ? (
              <FiMic className="w-8 h-8 " />
            ) : (
              <FiMicOff className="w-8 h-8" />
            )}
          </button>
          <button
            onClick={() => {
              setVideoStatus(!videoStatus);
            }}
            className={`text-white p-3 rounded-2xl hover:bg-darkblue ${
              videoStatus ? "bg-blue1" : "bg-gray-600"
            }`}
          >
            {videoStatus ? (
              <FiVideo className="w-8 h-8 " />
            ) : (
              <FiVideoOff className="w-8 h-8" />
            )}
          </button>
          <button
            className={`text-white p-3 bg-red-600 hover:bg-gray-600 rounded-2xl`}
          >
            <FiLogOut className="w-8 h-8 " />
          </button>
        </div>

        {/* Code Editor  */}
        <button
          onClick={() => {
            setShowCodeEditor(!showCodeEditor);
            setShowMessages(false);
          }}
          className="bg-orange-700 hover:bg-darkblue text-white text-xl p-3 mr-20 rounded-2xl font-bold"
        >
          Code Editor
        </button>
      </div>
    </div>
  );
}
