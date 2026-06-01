# Contributing

Branch off `main`. Name branches like a person would:

- `mobile-and-website`
- `resume-upload`
- `fix-timer-bug`

Not `chore/humanize-copy` or `feature/implement-x`.

One topic per branch. Run `npm install` from the repo root. Web: `npm run dev`. Mobile: `npm run mobile`.

Do not commit `.env` files or API keys.

User text that hits the model should use `sanitizeUserInput()` from shared.
