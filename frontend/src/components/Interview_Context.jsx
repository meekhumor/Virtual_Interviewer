import React, { createContext, useContext, useState } from 'react';
const InterviewContext = createContext();

export const useInterview = () => useContext(InterviewContext);

export const InterviewProvider = ({ children }) => {
  const [interviewSettings, setInterviewSettings] = useState({
    level: 'Internship',
    time: '20',
    domain: 'AI/ML'
  });

  return (
    <InterviewContext.Provider value={{ interviewSettings, setInterviewSettings }}>
      {children}
    </InterviewContext.Provider>
  );
};
