import { useState } from 'react';

export default function ApiKeySetup({ onSubmit }) {
  const [key, setKey] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = key.trim();
    if (!trimmed) { setError('Please enter your Gemini API key.'); return; }
    setLoading(true);
    setError('');
    // Accept the key and let the chat surface any errors naturally
    setTimeout(() => {
      onSubmit(trimmed);
      setLoading(false);
    }, 300);
  };

  return (
    <div className="setup-screen">
      <div className="setup-card">
        <div className="setup-logo">
          <div className="setup-icon">🗳️</div>
          <h1>ElectBot</h1>
          <p>Your friendly, non-partisan AI election guide.<br/>Enter your Gemini API key to get started.</p>
        </div>

        <form className="setup-form" onSubmit={handleSubmit}>
          <div>
            <label className="setup-label" htmlFor="api-key-input">Gemini API Key</label>
            <input
              id="api-key-input"
              className="setup-input"
              type="password"
              placeholder="AIza..."
              value={key}
              onChange={e => { setKey(e.target.value); setError(''); }}
              autoComplete="off"
              spellCheck={false}
            />
          </div>

          {error && <div className="setup-error">{error}</div>}

          <button
            id="setup-submit-btn"
            className="setup-submit"
            type="submit"
            disabled={loading || !key.trim()}
          >
            {loading ? 'Validating...' : 'Start Exploring Elections →'}
          </button>

          <p className="setup-note">
            Your key is stored only in your browser's local storage.<br/>
            Don't have a key?{' '}
            <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer">
              Get one free at Google AI Studio
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
