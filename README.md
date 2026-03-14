<div align="center">

# 👁 REPOSPECTRE

### AI Repository Intelligence Agent

*Analyze any GitHub repository with surgical precision — powered by Hermes-3-70B*

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/repospectre&env=OPENROUTER_API_KEY&envDescription=OpenRouter%20API%20key%20for%20Hermes-3-70B%20access&envLink=https://openrouter.ai/keys)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org)
[![Hermes](https://img.shields.io/badge/AI-Hermes--3--70B-brightgreen)](https://openrouter.ai)

</div>

---

## 🔍 What is RepoSpectre?

**RepoSpectre** is an AI-powered repository intelligence agent that performs deep analysis on any public GitHub repository. It combines GitHub's REST API with NousResearch's **Hermes-3-70B** language model (via OpenRouter) to deliver comprehensive security audits, binary/DLL detection, dependency analysis, and AI-generated strategic intelligence — all wrapped in a cinematic black & white terminal interface.

> *"Not just a linter. Not just a scanner. A full-spectrum repository intelligence agent."*

---

## ✨ Features

| Module | Description |
|--------|-------------|
| 🛡 **Security Audit** | Detects hardcoded secrets, misconfigurations, and vulnerabilities |
| ⬡ **DLL/Binary Scanner** | Identifies `.dll`, `.exe`, `.bin`, `.so` files and flags suspicious ones |
| 📦 **Dependency Analysis** | Audits `package.json`, `requirements.txt`, `go.mod`, `Cargo.toml` and more |
| 🔬 **Code Quality** | Assesses documentation, testing, CI/CD, project structure |
| 🤖 **Hermes Intelligence** | AI-generated verdict and strategic recommendations |
| 📊 **Health Scores** | Visual score rings for Health, Security, and Code Quality |
| 🎯 **Risk Assessment** | Overall risk level: LOW / MEDIUM / HIGH / CRITICAL |

---

## 🚀 Quick Deploy (Vercel)

### Option 1 — One-Click Deploy

Click the **Deploy with Vercel** button above, then:
1. Set `OPENROUTER_API_KEY` to your OpenRouter key
2. Deploy!

### Option 2 — Manual Deploy

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/repospectre.git
cd repospectre

# Install dependencies
npm install

# Copy env file
cp .env.example .env.local

# Add your OpenRouter API key to .env.local
# OPENROUTER_API_KEY=sk-or-v1-...

# Run locally
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000)

---

## 🔑 API Keys

### OpenRouter (Required)
RepoSpectre uses **Hermes-3-70B** via OpenRouter for AI analysis.

1. Visit [openrouter.ai](https://openrouter.ai)
2. Create a free account (new accounts receive free credits)
3. Go to [openrouter.ai/keys](https://openrouter.ai/keys)
4. Create a new API key
5. Add it to your Vercel environment variables as `OPENROUTER_API_KEY`

> **Free tier:** New OpenRouter accounts come with free credits sufficient for dozens of repository analyses using Hermes-3-70B.

### GitHub Token (Optional)
Without a GitHub token, the GitHub API allows 60 requests/hour. With a token, it's 5,000/hour.

1. Visit [github.com/settings/tokens](https://github.com/settings/tokens)
2. Generate a token with `public_repo` scope (read-only)
3. Add as `GITHUB_TOKEN` in your environment variables

---

## 🏗 Tech Stack

- **Frontend:** Next.js 14, React 18, pure CSS animations
- **Backend:** Next.js API Routes (Vercel Serverless Functions)
- **AI Model:** NousResearch Hermes-3-Llama-3.1-70B via OpenRouter
- **Data Source:** GitHub REST API v3
- **Deployment:** Vercel (zero-config)
- **Fonts:** Orbitron (display), JetBrains Mono (code)

---

## 📁 Project Structure

```
repospectre/
├── pages/
│   ├── _app.js           # App wrapper
│   ├── index.js          # Main UI — full animated interface
│   └── api/
│       └── analyze.js    # Core analysis engine
├── styles/
│   └── globals.css       # Global styles & animations
├── .env.example          # Environment variables template
├── next.config.js        # Next.js configuration
├── vercel.json           # Vercel deployment config
└── package.json
```

---

## 🎨 Interface

RepoSpectre features a **cinematic black & white terminal interface** inspired by GitHub's dark theme but elevated with AI agent aesthetics:

- **Matrix rain background** — subtle animated character waterfall
- **Glitch title effect** — periodic RGB-split on the header
- **CRT scanlines** — subtle horizontal scan overlay
- **Animated progress stages** — real-time scan pipeline visualization
- **Score rings** — animated SVG rings for Health/Security/Quality
- **Fade-in result cards** — staggered reveal animations

---

## 🔒 Privacy & Security

- Your API key is **never stored** — sent directly to OpenRouter from your browser to the serverless function
- Only **public** GitHub repositories can be analyzed
- No repository data is logged or persisted
- The GitHub token is optional and only used server-side

---

## 📝 Example Analysis Output

```json
{
  "overview": {
    "health_score": 87,
    "risk_level": "low",
    "summary": "A well-maintained, actively developed repository..."
  },
  "security": {
    "score": 92,
    "issues": [
      {"severity": "medium", "description": "No security policy (SECURITY.md) found"}
    ]
  },
  "dll_scan": {
    "verdict": "clean",
    "found": [],
    "suspicious": []
  },
  "dependencies": {
    "total": 47,
    "outdated": 3,
    "vulnerable": 0
  }
}
```

---

## 📜 License

MIT © 2025 RepoSpectre

---

<div align="center">
  <sub>Built with 👁 by RepoSpectre · Powered by Hermes-3-70B · Deployed on Vercel</sub>
</div>
