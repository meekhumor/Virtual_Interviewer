import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EyeStatusChecker = () => {
  const [lightingStatus, setLightingStatus] = useState(null);
  const [eyeContactStatus, setEyeContactStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEyeStatus = async () => {
    setLoading(true);

    try {
      const response = await axios.get('http://localhost:8000/cv/eye-status/');
      const { lighting_status, eye_contact_status } = response.data;

      setLightingStatus(lighting_status);
      setEyeContactStatus(eye_contact_status);
      setError(null); // Clear any previous errors
    } catch (err) {
      console.error('Error fetching eye status:', err);
      setError('Failed to fetch eye status');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch data immediately and set up an interval to poll every second
    fetchEyeStatus();
    const intervalId = setInterval(fetchEyeStatus, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array ensures this runs once on mount

  return (
    <div className="bg-white p-4">
      <h1>Eye and Lighting Checker</h1>
      <div className="mb-4">
        <img
          src="http://localhost:8000/cv/stream/"
          alt="Video Stream"
          style={{ width: '100%', maxHeight: '500px', objectFit: 'cover' }}
        />
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div>
          <p>Lighting Status: {lightingStatus}</p>
          <p>Eye Contact Status: {eyeContactStatus}</p>
        </div>
      )}
    </div>
  );
};

export default EyeStatusChecker;
