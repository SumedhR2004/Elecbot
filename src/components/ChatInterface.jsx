import { useState, useRef, useEffect, useCallback } from 'react';
import Message from './Message';
import ThinkingCard from './ThinkingCard';
import { sendMessage } from '../services/gemini';

const WELCOME_TOPICS = [
  { emoji: '📋', label: 'How do I register to vote?' },
  { emoji: '🗓️', label: 'What happens on Election Day?' },
  { emoji: '📬', label: 'How does mail-in voting work?' },
  { emoji: '🔢', label: 'How are votes counted?' },
  { emoji: '🏛️', label: 'What is the Electoral College?' },
  { emoji: '✅', label: 'What is election certification?' },
];

const CIVIC_FACTS = [
  "Voter registration deadlines vary by state.",
  "You can usually bring a sample ballot to the polls.",
  "Many states offer early voting options.",
  "Your vote is secret and protected by law.",
  "Poll workers are often volunteers from your community.",
];

export default function ChatInterface({ apiKey, onClearKey }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState('');
  const [factIndex, setFactIndex] = useState(0);
  const [readiness, setReadiness] = useState(10); // Start at 10%
  
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Rotate facts
  useEffect(() => {
    const timer = setInterval(() => {
      setFactIndex(prev => (prev + 1) % CIVIC_FACTS.length);
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  // Update readiness based on conversation depth
  useEffect(() => {
    if (messages.length > 0) {
      const newScore = Math.min(10 + (messages.length * 15), 100);
      setReadiness(newScore);
    }
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => { scrollToBottom(); }, [messages, isTyping]);

  const autoResize = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 120) + 'px';
  };

  const handleSend = useCallback(async (text) => {
    const trimmed = (text || input).trim();
    if (!trimmed || isTyping) return;

    const userMsg = { role: 'user', text: trimmed, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setError('');
    setIsTyping(true);
    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    // Build history for API (only user/model roles)
    const history = messages.map(m => ({
      role: m.role === 'bot' ? 'model' : 'user',
      text: m.text,
    }));

    try {
      const reply = await sendMessage(apiKey, history, trimmed);
      setMessages(prev => [...prev, { role: 'bot', text: reply, timestamp: Date.now() }]);
    } catch (err) {
      console.error(err);
      const msg = err?.message || '';
      if (msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED') || msg.includes('quota')) {
        setError('⚠️ API quota exceeded — your free tier limit has been reached for today. Try again tomorrow or enable billing at Google AI Studio.');
      } else if (msg.includes('401') || msg.includes('API_KEY') || msg.includes('invalid')) {
        setError('❌ Invalid API key. Please check your key and try again.');
      } else if (msg.includes('network') || msg.includes('fetch')) {
        setError('🌐 Network error — please check your internet connection and try again.');
      } else {
        setError('Something went wrong: ' + (msg || 'Unknown error. Please try again.'));
      }
    } finally {
      setIsTyping(false);
    }
  }, [input, isTyping, messages, apiKey]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const showWelcome = messages.length === 0;

  return (
    <div className="app-shell">
      {/* Header */}
      <header className="app-header">
        <div className="header-brand">
          <div className="brand-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 12l2 2 4-4"/>
              <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span className="brand-pulse" />
          </div>
          <div className="brand-text">
            <h1>ElectBot</h1>
            <p>Non-Partisan Election Guide</p>
          </div>
        </div>
        
        {/* Fact Ticker */}
        <div className="fact-ticker" key={factIndex}>
          <span className="fact-dot" />
          {CIVIC_FACTS[factIndex]}
        </div>

        <div className="header-actions">
          {/* Readiness Meter */}
          <div className="readiness-meter" title="Your Voter Readiness Score">
            <div className="readiness-ring">
              <svg>
                <circle className="ring-bg" cx="12" cy="12" r="10" />
                <circle 
                  className="ring-progress" 
                  cx="12" cy="12" r="10" 
                  strokeDasharray={`${(readiness * 62.8) / 100} 62.8`}
                />
                <defs>
                  <linearGradient id="meter-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#818cf8" />
                    <stop offset="100%" stopColor="#f59e0b" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="readiness-info">
              <span className="readiness-label">Voter Journey</span>
              <span className="readiness-status">
                {readiness < 40 ? 'Curious Citizen' : readiness < 80 ? 'Informed Voter' : 'Civic Expert'}
              </span>
            </div>
          </div>

          <div className="status-badge">
            <span className="status-dot" />
            Live
          </div>
          <button
            id="clear-chat-btn"
            className="btn-icon"
            onClick={() => setMessages([])}
            title="Clear chat"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>
            </svg>
          </button>
          <button
            id="change-key-btn"
            className="btn-icon"
            onClick={onClearKey}
            title="Change API key"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="8" cy="15" r="3"/>
              <path d="M11 15h7M17 9l3-3-3-3M20 6H9M13 18l-3 3 3 3"/>
            </svg>
          </button>
        </div>
      </header>

      {/* Messages */}
      <main className="messages-area" id="messages-area">
        <div className="messages-inner">

          {/* Welcome card */}
          {showWelcome && (
            <div className="welcome-card">
              <div className="welcome-header">
                <div className="welcome-avatar">🗳️</div>
                <div className="welcome-info">
                  <h2>Hi! I'm ElectBot 👋</h2>
                  <p>Your friendly, non-partisan election guide</p>
                </div>
              </div>
              <p className="welcome-text">
                I'm here to walk you through everything about elections — from registering to vote,
                to understanding how results are certified. Think of me as your personal civic teacher.
                Ask me anything, or pick a topic below to get started!
              </p>
              <div className="welcome-chips">
                {WELCOME_TOPICS.map((t, i) => (
                  <button
                    key={i}
                    id={`welcome-topic-${i}`}
                    className="topic-chip"
                    onClick={() => handleSend(t.label)}
                  >
                    <span>{t.emoji}</span>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Chat messages */}
          {messages.map((msg, i) => (
            <Message
              key={i}
              message={msg}
              onSuggestionClick={(text) => handleSend(text)}
            />
          ))}

          {/* Thinking animation */}
          {isTyping && <ThinkingCard />}

          {/* Error */}
          {error && <div className="error-banner">{error}</div>}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input bar */}
      <div className="input-bar-wrapper">
        <div className="input-bar-inner">
          <div className="input-field-wrap">
            <textarea
              ref={textareaRef}
              id="chat-input"
              className="input-textarea"
              placeholder="Ask me about elections, voting, registration..."
              value={input}
              onChange={e => { setInput(e.target.value); autoResize(); }}
              onKeyDown={handleKeyDown}
              rows={1}
              disabled={isTyping}
            />
          </div>
          <button
            id="send-btn"
            className="send-btn"
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping}
            aria-label="Send message"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 19-7z"/>
            </svg>
          </button>
        </div>
        <p className="input-hint">Press Enter to send · Shift+Enter for new line</p>
      </div>
    </div>
  );
}
