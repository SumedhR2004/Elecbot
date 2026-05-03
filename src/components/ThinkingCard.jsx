import { useState, useEffect } from 'react';

const CIVIC_FACTS = [
  "🗳️ The first US presidential election took place in 1788–89.",
  "🌍 Over 50 countries hold national elections every year.",
  "📬 Oregon was the first US state to vote entirely by mail.",
  "⏱️ In Australia, voting is compulsory — you get fined if you skip!",
  "🏛️ India has the world's largest democratic election.",
  "📊 The Electoral College has 538 total votes — 270 needed to win.",
  "✅ 26th Amendment lowered US voting age from 21 to 18 in 1971.",
  "📝 Voter registration deadlines vary by state — some allow same-day!",
  "🔢 Most elections are decided by very thin margins — every vote counts.",
  "🌐 New Zealand gave women the vote in 1893 — first in the world!",
];

export default function ThinkingCard() {
  const [factIndex, setFactIndex] = useState(0);
  const [factVisible, setFactVisible] = useState(true);
  const [dots, setDots] = useState('');

  // Rotate civic facts every 2.5s with fade
  useEffect(() => {
    const interval = setInterval(() => {
      setFactVisible(false);
      setTimeout(() => {
        setFactIndex(i => (i + 1) % CIVIC_FACTS.length);
        setFactVisible(true);
      }, 400);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Animated ellipsis
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(d => d.length >= 3 ? '' : d + '.');
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="thinking-card-row">
      <div className="thinking-card">
        {/* Left: avatar with orbit ring */}
        <div className="thinking-avatar-wrap">
          <div className="thinking-orbit-ring" />
          <div className="thinking-orbit-ring ring-2" />
          <div className="thinking-avatar">🗳️</div>
        </div>

        {/* Right: content */}
        <div className="thinking-content">
          <div className="thinking-label">
            <span className="thinking-shimmer-text">ElectBot is researching</span>
            <span className="thinking-dots">{dots}</span>
          </div>

          {/* Progress bar */}
          <div className="thinking-progress-track">
            <div className="thinking-progress-bar" />
          </div>

          {/* Rotating civic fact */}
          <div
            className="thinking-fact"
            style={{ opacity: factVisible ? 1 : 0 }}
          >
            {CIVIC_FACTS[factIndex]}
          </div>
        </div>
      </div>
    </div>
  );
}
