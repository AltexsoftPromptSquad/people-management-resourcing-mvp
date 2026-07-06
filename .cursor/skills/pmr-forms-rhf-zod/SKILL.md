---
name: pmr-forms-rhf-zod
description: Implement and refactor forms in People Management & Resourcing MVP using React Hook Form with zodResolver and feature-owned Zod schemas. Use when the user asks about forms, validation, useForm, zodResolver, schema placement, field errors, submit handling, or replacing manual useState/safeParse form logic.
---

# PMR Forms (RHF + Zod)

Use this skill for any form creation or form refactor in this repository.

## Required Stack

- `react-hook-form` for form state and submission.
- `@hookform/resolvers/zod` with `zodResolver(...)` for validation.
- `zod` schemas as the single source of truth for validation rules.

Do not introduce Formik for new work.

## Schema Placement Rules

- Feature form schemas: `src/features/{feature}/schemas/*.schema.ts`
- Shared cross-feature schemas only: `src/lib/validation/`
- Do not create a root-level `validation/` folder outside `src/`.

## Naming Conventions

- Schema files: `request-form.schema.ts`, `candidate-decision.schema.ts`
- Export schema + inferred type from same file:
  - `export const requestFormSchema = z.object(...)`
  - `export type RequestFormValues = z.infer<typeof requestFormSchema>`

## Default Implementation Pattern

```ts
const form = useForm<FormValues>({
  resolver: zodResolver(formSchema),
  defaultValues,
})
```

Use:

- `register(...)` for native/shared input props
- `formState.errors` for messages
- `handleSubmit(onSubmit)` for submit flow
- `reset(defaultValues)` after successful submit if needed

## Validation Rules

- Keep validation constraints in Zod schemas.
- Keep payload normalization in submit handler/hook (trim strings, map arrays, transform numbers).
- Avoid ad-hoc form validation with `useState + safeParse` inside components.

## Refactor Checklist (manual form -> RHF)

- Replace local field `useState` with `useForm`.
- Replace manual error map with `formState.errors`.
- Replace manual validate function with `zodResolver`.
- Keep existing UX copy for validation messages.
- Keep existing mutation and toast behavior unchanged.
- Run `npm run lint` and `npm run build`.

## Architecture Alignment

When touching forms, follow:

- `docs/architecture/project-structure.md` (Feature `schemas/` rules)
- `docs/architecture/state-and-rendering.md` (form state ownership)
- `docs/architecture/ux-behavior.md` (validation and submit behavior)
