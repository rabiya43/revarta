# Deploy web API (Vercel)

1. Push `main` (or merge your PRs) on GitHub.
2. Import repo at https://vercel.com/new
3. Root directory: `.` (repo root)
4. Environment variables:
   - `OPENAI_API_KEY`
   - optional: `OPENAI_INTERVIEW_MODEL`, `OPENAI_FEEDBACK_MODEL`
   - optional: `ALLOWED_ORIGINS` for production mobile (your Vercel URL + Expo dev URLs)
   - optional: `WAITLIST_WEBHOOK_URL` to forward signup emails (Slack, Zapier, Formspree, etc.)
5. Deploy. Note the URL, e.g. `https://revarta.vercel.app`

## Mobile after deploy

In `apps/mobile/.env`:

```
EXPO_PUBLIC_API_URL=https://your-app.vercel.app
```

Restart Expo. Test with device browser: `https://your-app.vercel.app/api/health` should return `{"ok":true}`.

## Local phone testing

Use your PC LAN IP, not `localhost`:

```
EXPO_PUBLIC_API_URL=http://192.168.x.x:3000
```

Run `npm run dev` on the PC. Phone and PC must be on the same Wi-Fi.
