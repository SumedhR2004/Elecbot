# 🗳️ ElectBot — AI Election Guide

> **ElectBot** is a friendly, non-partisan AI assistant that walks anyone through the election process — from voter registration to results certification — in a clear, interactive, step-by-step way.

Built for **PromptWars by Google** — Challenge 2.

---

## ✨ Features

- 🤖 **Powered by Gemini 2.0 Flash** — fast, accurate, conversational
- 🗺️ **Guided tour format** — breaks down complex topics into digestible steps
- ⚡ **Quick-tap suggestions** — clickable buttons for natural next steps
- 🌍 **Country-aware** — adapts to any country's election process
- 🔒 **Completely non-partisan** — never takes sides, always neutral
- 📱 **Fully responsive** — works beautifully on mobile & desktop
- 🌙 **Premium dark UI** — glassmorphism, animations, modern aesthetics

## 🚀 Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/your-username/voteai.git
cd voteai
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up your API key
```bash
# Copy the example env file
cp .env.example .env
```
Then open `.env` and paste your **free** Gemini API key:
```
VITE_GEMINI_API_KEY=your_actual_key_here
```
> Get a free key at [Google AI Studio](https://aistudio.google.com/app/apikey) — no credit card needed.

### 4. Run locally
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) 🎉

---

## 💡 No `.env`? No problem!

If you don't set an env key, ElectBot shows a one-time setup screen where you can paste your key directly in the browser. The key is saved in `localStorage` — never sent anywhere.

---

## 🏗️ Tech Stack

| Layer | Tech |
|-------|------|
| Framework | React 18 + Vite |
| AI | Google Gemini 2.0 Flash (`@google/genai`) |
| Styling | Vanilla CSS (glassmorphism, CSS variables) |
| Icons | Inline SVG |
| Markdown | `react-markdown` |

---

## 📁 Project Structure

```
src/
├── components/
│   ├── ApiKeySetup.jsx    # One-time key entry screen
│   ├── ChatInterface.jsx  # Main chat UI with welcome screen
│   └── Message.jsx        # Individual message + suggestion buttons
├── services/
│   └── gemini.js          # Gemini API integration + system prompt
├── App.jsx                # Root — key detection logic
├── App.css                # All component styles
└── index.css              # Global tokens & animations
```

---

## 🔐 Security

- `.env` is in `.gitignore` — your API key is **never** committed
- Keys are stored in browser `localStorage` only
- No backend, no data collection

---

Made with ❤️ for PromptWars by Google
