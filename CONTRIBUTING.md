# Contributing to Revarta

## Branch naming

| Prefix | Example | Use for |
|--------|---------|---------|
| `feature/` | `feature/resume-upload` | New user-facing capability |
| `fix/` | `fix/streaming-retry` | Bug fixes |
| `chore/` | `chore/deps-bump` | Tooling, deps |
| `docs/` | `docs/api-readme` | Documentation only |

## Workflow

1. Branch from `main` (or `develop` once it exists).
2. Keep PRs small and reviewable — one feature per PR.
3. Run `npm run typecheck` before opening a PR.
4. Never commit `.env` or API keys.

## Planned feature branches

```
feature/resume-jd-upload
feature/company-research-brief
feature/session-history-dashboard
feature/improvement-plan-drills
feature/salary-negotiation-simulator   # v2
feature/peer-practice-matching         # v2
feature/i18n-multilingual              # v2
```

## Code conventions

- Match existing Tailwind utility patterns (`glass-card`, `btn-primary`).
- All user text → `sanitizeUserInput()` before LLM calls.
- API errors → friendly messages, never stack traces to clients.
- Mobile-first layouts; test at 390px width.
