# people-management-resourcing-mvp

Build an MVP of an internal People Management &amp; Resourcing web application for an engineering organization (500+ employees, distributed across units and projects).

## Demo Mock API

The app is frontend-only and can run against MSW-backed mock endpoints.

- Local development enables MSW automatically through `import.meta.env.DEV`.
- Hosted demo deployments, including Vercel, must set `VITE_ENABLE_MOCKS=true`.
- Keep `public/mockServiceWorker.js` deployed at the site root so the browser can register the worker.

For Vercel demo environments, add this environment variable before building:

```text
VITE_ENABLE_MOCKS=true
```

## End-to-end tests

Playwright tests live under `tests/e2e/`.

First-time setup:

```bash
npm ci
npx playwright install chromium
```

Run the suite:

```bash
npm run test:e2e
```

Optional helpers:

```bash
npm run test:e2e:ui
npm run test:e2e:report
```

`npm run build` compiles the app only. E2E tests run separately through `npm run test:e2e` or the GitHub Actions `e2e` job.
