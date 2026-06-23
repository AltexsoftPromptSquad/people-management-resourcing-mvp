# Mock Data and MSW

The app is frontend-only. Use MSW and Faker for realistic mock API behavior.

Recommended structure:

```text
src/mocks/
  browser.ts
  handlers.ts
  factories/
    people.ts
    projects.ts
    allocations.ts
```

Rules:

- Keep generated mock data outside UI components.
- Use stable IDs and realistic relationships between entities.
- Model loading, empty, and error behavior where useful.
- Keep handlers shaped like future API endpoints.
- Use TanStack Query against mocked endpoints for server-like data.
- Use local state only for client-only UI behavior.

Avoid making mocks too perfect. Include realistic statuses, partial allocation, missing optional fields, and varied skill levels.
