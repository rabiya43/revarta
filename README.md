# Revarta

Mock interview practice on the web and on iOS/Android. Voice or text, follow-up questions, scored feedback, optional resume + job-description tailoring.

## Repo layout

| Path | What |
|------|------|
| `/` | Next.js website + API |
| `packages/shared` | Types and question logic shared with mobile |
| `apps/mobile` | Expo app (App Store / Play Store) |
| `docs/app-store.md` | How to build and submit native apps |

## Web

```bash
npm install
cp .env.example .env.local
# OPENAI_API_KEY=...
npm run dev
```

Site: http://localhost:3000  
Practice flow: `/onboarding` → `/prepare` → `/research` → `/interview`  
Also: `/progress` (history), `/drills` (no timer)

## Mobile

```bash
cp apps/mobile/.env.example apps/mobile/.env
# EXPO_PUBLIC_API_URL=http://YOUR_LAN_IP:3000
npm run mobile
```

Store builds: see `docs/app-store.md`.

Deploy web + API: see `docs/deploy.md`. After deploy, set `EXPO_PUBLIC_API_URL` in `apps/mobile/.env`.

Generate Expo icon PNGs once: `npm run mobile:icons`

## Env (web)

| Name | Required |
|------|----------|
| OPENAI_API_KEY | yes |
| OPENAI_INTERVIEW_MODEL | no |
| OPENAI_FEEDBACK_MODEL | no |

## Branches

Use plain names, one topic each. Examples:

- `mobile-and-website`
- `resume-upload`
- `company-brief`

Avoid `chore/humanize-copy` style names.

## Stack

Next.js 15, Expo 52, Tailwind 4, OpenAI API, shared TypeScript package.
