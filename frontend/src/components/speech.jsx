import React from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

const SpeechToText = () => {
  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  const startListening = () => {
    SpeechRecognition.startListening({ continuous: true });
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
  };

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <p>Your browser doesn&apos;t support speech recognition.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white px-4">
      <h1 className="text-3xl font-bold mb-6">Speech to Text</h1>
      <div className="flex gap-4 mb-4">
        <button
          onClick={startListening}
          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded shadow"
        >
          Start
        </button>
        <button
          onClick={stopListening}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded shadow"
        >
          Stop
        </button>
        <button
          onClick={resetTranscript}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded shadow"
        >
          Reset
        </button>
      </div>
      <div className="w-full max-w-2xl p-4 bg-gray-800 rounded shadow">
        <p className="text-lg font-semibold">
          Listening:{" "}
          <span className={listening ? "text-green-400" : "text-red-400"}>
            {listening ? "Yes" : "No"}
          </span>
        </p>
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">Transcript:</h2>
          <div className="p-4 bg-gray-700 rounded text-white overflow-y-auto max-h-40">
            {transcript || "Start speaking to see the transcript here..."}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpeechToText;
