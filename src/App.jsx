import { useState, useEffect } from 'react';
import ChatInterface from './components/ChatInterface';
import ApiKeySetup from './components/ApiKeySetup';
import './App.css';

function App() {
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    // Try env variable first (for the project owner)
    const envKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (envKey && envKey !== 'your_api_key_here') {
      setApiKey(envKey);
      return;
    }
    // Then try localStorage (for hackathon judges / visitors)
    const savedKey = localStorage.getItem('electbot_api_key');
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, []);

  const handleKeySubmit = (key) => {
    localStorage.setItem('electbot_api_key', key);
    setApiKey(key);
  };

  const handleClearKey = () => {
    localStorage.removeItem('electbot_api_key');
    setApiKey('');
  };

  if (!apiKey) {
    return <ApiKeySetup onSubmit={handleKeySubmit} />;
  }

  return <ChatInterface apiKey={apiKey} onClearKey={handleClearKey} />;
}

export default App;
