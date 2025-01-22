import React from 'react';

const Analysis = () => {
  const metrics = [
    {
      title: "Pace",
      value: 246,
      unit: "words/min",
      status: "error",
      successMessage: "Your pace is just right! Keep up the steady rhythm.",
      errorMessage: "You're speaking too fast. Try to slow down for better clarity.",
      icon: "🔊"
    },
    {
      title: "Filler Words",
      value: 5,
      unit: "/100 words",
      status: "success",
      successMessage: "You're doing great with filler words. Keep it up!",
      errorMessage: "Reduce filler words for a more concise answer.",
      icon: "📝"
    },
    {
      title: "Power Words",
      value: 0,
      unit: "total",
      status: "error",
      successMessage: "Your answer is strong but could be enhanced with more impactful vocabulary.",
      errorMessage: "This answer needs some charging up. Integrate powerful vocabulary if you can.",
      icon: "🧠"
    },
    {
      title: "Negative Tone",
      value: 0,
      unit: "total",
      status: "success",
      successMessage: "No negative tone detected! Excellent work.",
      errorMessage: "Watch out for negative language in your tone.",
      icon: "😊"
    },
    {
      title: "Pauses",
      value: 0,
      unit: "total",
      status: "success",
      successMessage: "No pauses detected. You’re maintaining a steady pace!",
      errorMessage: "Make sure to pause occasionally to collect your thoughts.",
      icon: "⏸️"
    },
    {
      title: "Eye Contact",
      value: 85,
      unit: "%",
      status: "success",
      successMessage: "Great audience engagement! Keep maintaining strong eye contact.",
      errorMessage: "Make more eye contact with your audience for better connection.",
      icon: "👁️"
    },
    {
      title: "Lighting",
      value: "Good",
      status: "success",
      successMessage: "Perfect lighting conditions for clear visibility.",
      errorMessage: "The lighting could be improved for clearer visibility.",
      icon: "💡",
    }
  ];

  const getValueDisplay = (metric) => {
    if (metric.isQualitative) {
      return (
        <span className={`px-3 py-1 rounded-full text-sm ${
          metric.status === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
        }`}>
          {metric.value}
        </span>
      );
    }
    return (
      <div className="flex items-center gap-2">
        <span className={`text-2xl font-bold ${
          metric.status === 'success' ? 'text-green-500' : 'text-red-500'
        }`}>
          {metric.value}
        </span>
        <span className="text-gray-400 text-sm">{metric.unit}</span>
      </div>
    );
  };

  return (
    <div className="p-6 bg-darkblue bg-opacity-30 rounded-xl max-w-5xl mx-auto my-24">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl text-white font-bold">AI Feedback</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-zinc-900 p-4 rounded-xl hover:bg-gray-750 transition-colors shadow-lg">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <span className={`text-3xl ${
                  metric.status === 'success' ? 'text-green-500' : 'text-red-500'
                }`}>
                  {metric.icon}
                </span>
                <h3 className="text-white text-lg font-semibold">{metric.title}</h3>
              </div>
              
              <div className="flex items-center gap-3">
                {getValueDisplay(metric)}
              </div>
              
              <div className="mt-2">
                <p className="text-gray-300 text-sm">
                  {metric.status === 'success' ? metric.successMessage : metric.errorMessage}
                </p>
                {metric.status === 'error' && (
                  <button className="text-blue1 text-sm mt-2 hover:text-blue-600">
                    IMPROVE
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Analysis;
