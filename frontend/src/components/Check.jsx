import React, { useState, useEffect } from 'react';

const DisplayResume = () => {
  const [resumeContent, setResumeContent] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Retrieve the resume from localStorage
    const resume = localStorage.getItem('resume');
    
    if (resume) {
      // If resume exists in localStorage, check its type and display it
      const fileType = resume.split(';')[0].split('/')[1];

      // Handle different file types (PDF, DOCX, or Text)
      if (fileType === 'pdf') {
        setResumeContent(<embed src={resume} type="application/pdf" width="100%" height="600px" />);
      } else if (fileType === 'plain') {
        setResumeContent(<p>{atob(resume.split(',')[1])}</p>); // Decode base64 for plain text content
      } else {
        setErrorMessage('File format not supported for viewing');
      }
    } else {
      setErrorMessage('No resume file found in localStorage');
    }
  }, []);

  return (
    <div className="resume-display-container">
      <h2 className="text-2xl text-center mb-4">Your Resume</h2>

      {resumeContent ? (
        <div>{resumeContent}</div>
      ) : (
        <p className="text-red-500">{errorMessage}</p>
      )}
    </div>
  );
};

export default DisplayResume;
