# Contributing

Branch off `main`:

- `feature/name` for new stuff
- `fix/name` for bugs
- `chore/name` for tooling

One feature per PR when you can. Run `npm run typecheck` before opening.

Do not commit `.env` or keys.

User input that hits the model should go through `sanitizeUserInput()` first.
