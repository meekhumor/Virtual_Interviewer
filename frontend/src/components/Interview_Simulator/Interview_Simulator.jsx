import { useState } from "react";
import { Link } from "react-router-dom";
import { FiVideo, FiMic, FiMicOff, FiVideoOff, FiLogOut } from "react-icons/fi";
import Draggable from "react-draggable"; // Import Draggable

export default function Interview_Simulator() {
  const [micStatus, setMicStatus] = useState(true);
  const [videoStatus, setVideoStatus] = useState(true);

  const handleMicToggle = () => {
    setMicStatus(!micStatus);
  };

  const handleVideoToggle = () => {
    setVideoStatus(!videoStatus);
  };

  return (
    <div className="flex flex-col justify-between items-center text-white min-h-screen">
      <div className="w-full  flex-grow flex justify-center items-center">
        <div className="w-56 h-56 rounded-full bg-darkblue bg-opacity-30"></div>
      </div>

      <Draggable>
        <div className="z-20 bg-darkblue bg-opacity-30 w-96 h-80 rounded-2xl absolute bottom-36 right-10"></div>
      </Draggable>

      {/* Bottom bar */}
      <div className="w-full bg-darkblue bg-opacity-30 h-24 flex justify-center items-center">
        <div className="flex gap-6">
          <button
            onClick={handleMicToggle}
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
            onClick={handleVideoToggle}
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
      </div>
    </div>
  );
}
