import ReactMarkdown from 'react-markdown';

// Parse SUGGESTIONS: [A] | [B] from bot text
function parseSuggestions(text) {
  const match = text.match(/SUGGESTIONS:\s*\[(.+?)\]\s*\|\s*\[(.+?)\]/);
  if (!match) return { cleanText: text, suggestions: [] };
  const cleanText = text.replace(/SUGGESTIONS:.*$/m, '').trimEnd();
  return { cleanText, suggestions: [match[1].trim(), match[2].trim()] };
}

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function TypingIndicator() {
  return (
    <div className="typing-row">
      <div className="message-avatar" style={{
        width: 34, height: 34, borderRadius: 10,
        background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, fontSize: 16,
        boxShadow: '0 0 12px rgba(99,102,241,0.3)'
      }}>
        🗳️
      </div>
      <div className="typing-bubble">
        <span className="typing-dot" />
        <span className="typing-dot" />
        <span className="typing-dot" />
      </div>
    </div>
  );
}

export default function Message({ message, onSuggestionClick }) {
  const isBot = message.role === 'bot';
  const { cleanText, suggestions } = isBot
    ? parseSuggestions(message.text)
    : { cleanText: message.text, suggestions: [] };

  return (
    <div className={`message-row ${isBot ? 'bot' : 'user'}`}>
      <div className="message-avatar">
        {isBot ? '🗳️' : '👤'}
      </div>
      <div className="message-content">
        <div className="message-bubble">
          {isBot ? (
            <ReactMarkdown>{cleanText}</ReactMarkdown>
          ) : (
            <span>{cleanText}</span>
          )}
        </div>

        {suggestions.length > 0 && (
          <div className="suggestion-buttons">
            {suggestions.map((s, i) => (
              <button
                key={i}
                className="suggestion-btn"
                onClick={() => onSuggestionClick(s)}
                id={`suggestion-btn-${i}`}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <div className="message-time">
          {formatTime(new Date(message.timestamp))}
        </div>
      </div>
    </div>
  );
}
