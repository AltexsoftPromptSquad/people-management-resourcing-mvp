# Forms and Validation

Use React Hook Form with Zod for forms that create or edit domain data.

Recommended feature structure:

```text
src/features/<feature>/
  components/<feature>-form.tsx
  schemas/<feature>.schema.ts
  types.ts
```

Rules:

- Keep Zod schemas close to the feature.
- Infer form value types from schemas when practical.
- Show field-level validation messages.
- Disable submit while saving.
- Provide success and failure paths, even if backed by mock state.
- Avoid duplicating validation rules in UI code and schemas.

Common pattern:

```ts
const schema = z.object({
  name: z.string().min(1, 'Name is required'),
})

type FormValues = z.infer<typeof schema>
```
