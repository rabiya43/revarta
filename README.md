# Revarta ✨

**AI mock interview coach** — live follow-ups, honest coaching-grade feedback, voice practice, STAR analysis, and filler-word tracking.

Built for candidates prepping across **SWE, Product, Data, Design, Marketing, and Finance**.

## Launch blockers implemented (MVP)

| Feature | Status |
|--------|--------|
| Role-specific question banks + seniority + company type | ✅ |
| Live mock interview (streaming AI interviewer) | ✅ |
| Honest feedback (structure, specificity, impact, conciseness) | ✅ |
| Voice mode (Web Speech API) + text fallback | ✅ |
| Filler words + WPM + pacing timer | ✅ |
| STAR method coach | ✅ |
| Zero-friction onboarding (no account to start) | ✅ |
| Session recovery (localStorage, 24h) | ✅ |
| Skeleton loading states | ✅ |
| Input sanitization / prompt-injection filtering | ✅ |

## Should-have (planned branches)

- `feature/resume-jd-upload` — tailored questions from CV + JD
- `feature/company-research-brief`
- `feature/progress-dashboard`
- `feature/practice-drills`

## Prerequisites

1. **Node.js 20+** — [https://nodejs.org](https://nodejs.org)
2. **OpenAI API key** — [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)

## Quick start

```bash
cd revarta
cp .env.example .env.local
# Edit .env.local and set OPENAI_API_KEY

npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## GitHub setup (`rabiya43`)

GitHub CLI is not installed on this machine yet. After installing [Node](https://nodejs.org) and [GitHub CLI](https://cli.github.com/):

```powershell
# Install GitHub CLI (Windows winget)
winget install GitHub.cli

# Authenticate
gh auth login

# From the revarta folder
git init
git add .
git commit -m "feat: initial Revarta MVP — live mock interviews with coaching feedback"
gh repo create revarta --public --source=. --remote=origin --push
```

Or create **https://github.com/new** named `revarta`, then:

```bash
git remote add origin https://github.com/rabiya43/revarta.git
git branch -M main
git push -u origin main
```

## Branch workflow

| Branch | Purpose |
|--------|---------|
| `main` | Production-ready releases |
| `develop` | Integration branch |
| `feature/*` | One feature per branch (see CONTRIBUTING.md) |

Example:

```bash
git checkout -b feature/voice-improvements
# ... work ...
git push -u origin feature/voice-improvements
gh pr create --title "Improve voice UX" --body "..."
```

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | Yes | OpenAI API key |
| `OPENAI_INTERVIEW_MODEL` | No | Default `gpt-4o-mini` |
| `OPENAI_FEEDBACK_MODEL` | No | Default `gpt-4o-mini` |

## Tech stack

- **Next.js 15** (App Router) — streaming, mobile-first PWA manifest
- **Vercel AI SDK** — sub-2s first token streaming target
- **Tailwind CSS v4** — coral / violet / mint design system
- **Web Speech API** — voice input (Chrome / Edge recommended)

## License

Private — © Rabiya. All rights reserved unless otherwise specified.
