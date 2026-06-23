# Tables and Filtering

Use TanStack Table for resource grids such as people, projects, allocations, teams, and skills.

Recommended feature structure:

```text
src/features/<feature>/
  components/<feature>-table.tsx
  components/<feature>-filters.tsx
  columns.tsx
  types.ts
```

Rules:

- Keep column definitions outside the route component.
- Support realistic table states: loading, empty, and filtered-empty.
- Prefer explicit filters over hidden magic.
- Keep row actions predictable and accessible.
- Avoid putting large transformation logic directly in JSX.
- Use stable row IDs from domain data.

For dashboard-style tables, prioritize scanning: clear columns, compact spacing, and visible status indicators.
