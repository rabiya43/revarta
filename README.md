# Revarta

Mock interview practice app. Pick your role, run a short session, get scores and notes on your answers. Voice or typing.

## Setup

Needs Node 20+ and an OpenAI key.

```bash
npm install
cp .env.example .env.local
# put OPENAI_API_KEY in .env.local
npm run dev
```

App runs at http://localhost:3000

## Env

| Name | Required |
|------|----------|
| OPENAI_API_KEY | yes |
| OPENAI_INTERVIEW_MODEL | no (default gpt-4o-mini) |
| OPENAI_FEEDBACK_MODEL | no (default gpt-4o-mini) |

## Branches

Work on `feature/...` or `fix/...` off `main`. See CONTRIBUTING.md.

## Stack

Next.js 15, Tailwind 4, OpenAI API, Web Speech API for mic input.
