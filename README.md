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
