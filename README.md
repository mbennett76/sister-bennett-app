# 🇵🇹 Irmã Bennett — Portugal Porto Mission App

A complete Portuguese language learning app built specifically for Sister Bennett's
preparation for the Portugal Porto Mission. Built with React + Vite.

---

## What's inside — 10 modules

| Tab | What it does |
|---|---|
| ⏱ Countdown | Live mission timer (Oct 28, 2026) + daily streak |
| 🗺 My Path | Mission Readiness Score (0–100%) + 12-week curriculum |
| 🔡 Alphabet | 26 letters + 7 special sounds with European Portuguese audio |
| 🙏 Phrases | 27 missionary phrases — hear, see word-for-word, record & score |
| 🏛 Culture | 6 Porto/Portugal cultural topics with vocabulary |
| 📖 Reader | 5 parallel texts PT/EN side by side |
| 📚 Vocab | 96 words in 8 categories — flashcards + quiz |
| 🎤 Speaking | 28 exercises with live waveform comparison |
| 📜 Scriptures | 13 key missionary scriptures — bookmarks + notes + audio |
| 🤖 Conversation | Claude-powered Portuguese investigator roleplay |

All progress is saved to browser localStorage and persists between sessions.

---

## Deploying to GitHub Pages

### Prerequisites
- Node.js (LTS) — https://nodejs.org
- A GitHub account — https://github.com

### Step 1 — Edit package.json
Open `package.json` and update the homepage URL on line 4:
```
"homepage": "https://YOUR-GITHUB-USERNAME.github.io/sister-bennett-app",
```

### Step 2 — Edit vite.config.js
Make sure the `base` matches your repo name:
```js
base: '/sister-bennett-app/',
```

### Step 3 — Install dependencies
```bash
npm install
```

### Step 4 — Create a GitHub repository
- Go to https://github.com/new
- Name it: `sister-bennett-app`
- Set to Public
- Create repository

### Step 5 — Push your code to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/sister-bennett-app.git
git push -u origin main
```

### Step 6 — Deploy
```bash
npm run deploy
```

### Step 7 — Enable GitHub Pages
- Go to your repo → Settings → Pages
- Source: Deploy from a branch
- Branch: gh-pages → Save

Your app will be live at:
https://YOUR-USERNAME.github.io/sister-bennett-app

---

## Setting up the AI Conversation tab

The 🤖 Conversation tab uses Claude AI. When Sister Bennett first opens that tab,
she'll be prompted to enter an Anthropic API key.

1. Create a free account at https://console.anthropic.com
2. Go to API Keys and create a new key
3. Paste it into the app — it's stored only on her device

The 🔑 button in the conversation header lets her update or remove the key at any time.

---

## Updating the app

After making any changes to src/App.jsx, run:
```bash
npm run deploy
```
The live site updates in about 30 seconds.

---

## Audio notes

The 🔊 audio features use the browser's built-in Web Speech API in European
Portuguese (pt-PT). For the best Porto accent experience, use Chrome or Edge.
Safari may fall back to Brazilian Portuguese voices.

The 🎤 Speaking Lab requires microphone permission — allow it when prompted.

---

## File structure

```
sister-bennett-app/
  index.html          ← HTML entry point
  package.json        ← Dependencies + deploy scripts
  vite.config.js      ← Build config (update base path here)
  README.md           ← This file
  src/
    main.jsx          ← React root (don't edit)
    App.jsx           ← The entire app (all 10 modules)
```

---

Built with love for Sister Bennett's service in Porto, Portugal. 🇵🇹
"Assim, pressionai avante com firmeza em Cristo" — 2 Néfi 31:20
