import React, { useState } from 'react';

const Interviewer = () => {
  const [domain, setDomain] = useState('');
  const [level, setLevel] = useState('');
  const [minutes, setMinutes] = useState('');
  const [response, setResponse] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      input_value: "message",
      output_type: "chat",
      input_type: "chat",
      tweaks: {
        "ChatInput-9Hm1k": {
          "input_value": "Hello",
          "sender": "User",
          "sender_name": "User",
          "should_store_message": true,
        },
        "Prompt-XcjlH": {
          "template": `${level}\n\n${minutes}\n\n${domain}\n\n\nYou are a virtual interviewer...`,
          "level": level,
          "minute": minutes,
          "domain": domain,
        },
        "ChatOutput-WRppC": {
          "input_value": "",
          "sender": "Machine",
          "sender_name": "AI",
          "should_store_message": true,
        },
        "TextInput-vfswF": {
          "input_value": domain,
        },
        "TextInput-9Pas3": {
          "input_value": level,
        },
        "TextInput-syDEe": {
          "input_value": minutes,
        }
      }
    };

    try {
      const response = await fetch("https://api.langflow.astra.datastax.com/lf/b1444534-75cd-484e-b621-881da671f9f4/api/v1/run/96657cc8-9513-47e6-ad14-e51259c3b699?stream=false", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer <YOUR_APPLICATION_TOKEN>',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      setResponse(result); // handle the API response accordingly
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div>
      <h2>Virtual Interviewer</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Domain:</label>
          <input 
            type="text" 
            value={domain} 
            onChange={(e) => setDomain(e.target.value)} 
            placeholder="AI/ML, Web Development, etc." 
          />
        </div>
        <div>
          <label>Level:</label>
          <input 
            type="text" 
            value={level} 
            onChange={(e) => setLevel(e.target.value)} 
            placeholder="Internship, Entry level, etc." 
          />
        </div>
        <div>
          <label>Duration (minutes):</label>
          <input 
            type="number" 
            value={minutes} 
            onChange={(e) => setMinutes(e.target.value)} 
            placeholder="20" 
          />
        </div>
        <button type="submit">Start Interview</button>
      </form>

      {response && (
        <div>
          <h3>Interview Response:</h3>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default Interviewer;
