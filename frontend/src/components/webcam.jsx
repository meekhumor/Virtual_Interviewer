import React, { useRef, useState, useEffect } from "react";
import Draggable from "react-draggable";

const WebcamComponent = () => {
  const videoRef = useRef(null);
  const [videoStatus, setVideoStatus] = useState(false);

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

  return (
    <div className="relative">
      <button
        onClick={() => setVideoStatus((prev) => !prev)}
        className="bg-blue-500 text-white py-2 px-4 rounded absolute top-4 left-4 z-20"
      >
        {videoStatus ? "Turn Off Webcam" : "Turn On Webcam"}
      </button>
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
    </div>
  );
};

export default WebcamComponent;
