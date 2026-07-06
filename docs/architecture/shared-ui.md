# Shared UI

This document defines how to build, place, and reuse UI primitives in `src/shared/ui`. Read it before adding or styling any interactive control, form field, tab strip, dialog, or other app-agnostic UI element.

For folder ownership and import direction, see `project-structure.md`. For component file layout, see `component-structure.md`. For colors, variants, and semantic tones, see `visual-theme.md`.

For deciding when repeated filter, table, search, pagination, and state behavior should become shared UI or shared hooks, see `state-and-rendering.md`.

## Purpose

`src/shared/ui` is the design-system layer of the app. Generic controls are styled once here and reused everywhere. Feature and page components compose shared primitives; they do not reimplement them inline.

Examples:

| Feature widget             | Underlying primitive | Owner                                                              |
| -------------------------- | -------------------- | ------------------------------------------------------------------ |
| Role switcher buttons      | `Button`             | `Button` in `shared/ui`; switcher in `features/roles`              |
| Profile section navigation | `Tabs`               | `Tabs` in `shared/ui`; profile tabs in `features/employee-profile` |
| Approve request action     | `Button`             | `Button` in `shared/ui`; panel in `features/resourcing`            |
| Request status label       | `Badge`              | `Badge` in `shared/ui`; table cell in feature table                |

## Mandatory Pre-Implementation Check

Before writing JSX for any interactive control, complete this check:

1. **Name the primitive, not the feature widget.**
   - "role switcher segmented buttons" -> primitive: **Button**
   - "unit filter dropdown" -> primitive: **Select**
   - "profile sections" -> primitive: **Tabs**
   - "mark as available" -> primitive: **Checkbox** or **Switch**
   - "approve request" -> primitive: **Button**

2. **Search `src/shared/ui/`** for an existing component (see inventory below).
   - If it exists, import and use it. Do not restyle the same control inline.

3. **If missing and the primitive is app-agnostic**, add it to `src/shared/ui/{component-name}/`:
   - Prefer shadcn/ui (Radix) as the base, themed for PMR.
   - Style once in shared: variants, sizes, focus, disabled, error states.
   - Export typed props from `{ComponentName}.types.ts`.
   - Reuse across features; features only wire data, labels, and handlers.

4. **Feature components compose shared primitives.**
   - Domain-aware UI belongs in `src/features/{domain}/components/`.
   - Generic controls belong in `src/shared/ui/`.

5. **Do not merge styled control markup inside features or pages** when the same primitive is needed or likely to be needed elsewhere. Examples of control styling that belong only in shared UI:
   - `border`, `rounded-md`, `h-9`, `ring`, focus rings on inputs/selects
   - Chevron icons and open/closed states on dropdowns
   - Tab list/trigger/active styles
   - Checkbox/radio/switch visuals

## Decision Flow

```text
Need a UI control
  |
  +-- Already in src/shared/ui? -- yes --> Import and use it
  |
  +-- no
       |
       +-- App-agnostic primitive (select, tabs, checkbox, dialog, ...)?
       |     +-- Add to src/shared/ui once; theme per visual-theme.md
       |
       +-- Knows PMR domain (Person, Request, Role, Risk, ...)?
             +-- Feature/page component built from shared primitives
```

## What Belongs In `src/shared/ui`

Put app-agnostic primitives and composed UI building blocks here:

**Form and input**

- `button`, `input`, `textarea`, `select`, `checkbox`, `radio-group`, `switch`, `label`, `form` helpers

**Navigation and layout**

- `tabs`, `dropdown-menu`, `popover`, `dialog`, `sheet`, `separator`

**Feedback and state**

- `badge`, `alert`, `toast`, `skeleton`, `empty-state`, `error-state`, `loading-state`

**Data display**

- `table` primitives, `data-table` wrapper, `page-header`, `section-header`

**Filter and table composition**

- `search-input`, `filter-bar`, `active-filters`, `pagination`, `table-toolbar`, `column-visibility-menu`

Shared UI must:

- Accept generic props (`value`, `onValueChange`, `options`, `variant`, `size`, `disabled`, `className`).
- Not import from `src/features/`, `src/pages/`, or domain-specific `src/types/` except truly generic utilities.
- Apply PMR theme tokens from `visual-theme.md` through variants/constants in the shared folder.
- Own the generic interaction affordances for each primitive: hover, active, focus-visible, disabled, loading, cursor, and keyboard states.

## What Does Not Belong In `src/shared/ui`

Keep these out of shared UI:

- Components that encode business rules (`CandidateProposalPanel`, `RoleSwitcher`, `SubordinatesTable`).
- Components tied to one page and not reusable as a primitive (`ExamplePageHeader`).
- One-off layout that only makes sense in a single feature screen.
- Domain-specific badge/table cell renderers that know request/candidate/risk semantics. Use shared `Badge`/`StatusPill` with props from the feature instead.

If a component no longer references PMR domain concepts, move it from a feature to `src/shared/ui`.

## shadcn/ui Policy

1. **Generic control needed** -> add via shadcn CLI, then place under `src/shared/ui/{name}/` using project folder conventions (`ComponentName.tsx`, types, index).
2. **Do not import shadcn/Radix primitives directly from feature or page code** when a shared wrapper exists or should exist.
3. **Theme customization** happens in the shared component (CVA variants, constants) and global CSS variables in `src/styles/`, not in feature files.
4. **Features pass data and behavior only**: `value`, `onValueChange`, `placeholder`, `disabled`, `options`, `aria-label`, etc.

Example layout after adding Select:

```text
src/shared/ui/select/
  Select.tsx           # or re-export shadcn parts with PMR defaults
  Select.types.ts      # when custom props are needed
  index.ts
```

## Styling Rules

- Shared UI is the only place that defines control variants (`default`, `outline`, `ghost`) and sizes (`sm`, `md`, `lg`).
- Use semantic props (`tone="success"`, `variant="destructive"`) instead of ad-hoc Tailwind color classes in features.
- Follow `visual-theme.md` for primary, semantic, and focus colors.
- Use `cn()` for class composition; keep variant maps in `{ComponentName}.constants.ts` when non-trivial.
- Enabled clickable controls must communicate interactivity with `cursor-pointer`; disabled controls must use `disabled:cursor-not-allowed` or the equivalent primitive state class.
- Primary and selected control states must use the muted slate treatment from `visual-theme.md`, not bright blue or indigo one-offs.
- If a visual-theme update changes the palette or tone mapping, update shared variants in the same change before styling feature components.

## Anti-Patterns

Do not implement these in `features/`, `pages/`, or `app/`:

```tsx
// Styled native select in a feature - use shared Select instead
<select className="h-9 w-full rounded-md border border-slate-200 ...">
  {options.map(...)}
</select>

// Control chrome duplicated in a feature
<div className="flex h-9 items-center rounded-md border px-3 ...">
  <ChevronDown />
</div>

// Inline tabs styling in a profile feature - use shared Tabs
<div className="flex gap-2 border-b">
  <button className={isActive ? 'border-b-2 border-blue-700 ...' : '...'}>
```

Preferred Select pattern:

```tsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select'

export const UnitFilter: FC<UnitFilterProps> = ({ value, options, onChange }) => (
  <Select value={value} onValueChange={onChange}>
    <SelectTrigger aria-label="Unit filter">
      <SelectValue placeholder="Select unit" />
    </SelectTrigger>
    <SelectContent>
      {options.map((option) => (
        <SelectItem key={option.value} value={option.value}>
          {option.label}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
)
```

Do not patch generic primitive behavior only at the feature level:

```tsx
// Fix shared Button cursor behavior instead of adding this to one role switcher button.
<Button className="cursor-pointer">Unit Manager</Button>
```

## Component Inventory

Update this table when adding or removing shared primitives.

| Component      | Path                           | Status    | Notes                                              |
| -------------- | ------------------------------ | --------- | -------------------------------------------------- |
| Button         | `src/shared/ui/button`         | Available | CVA variants; primary actions                      |
| Badge          | `src/shared/ui/badge`          | Available | Semantic `tone` prop                               |
| ShadcnBadge    | `src/shared/ui/shadcn-badge`   | Available | shadcn-style badge wrapper                         |
| Select         | `src/shared/ui/select`         | Available | Shared native select wrapper                       |
| Input          | `src/shared/ui/input`          | Available | Forms, filters, search                             |
| Textarea       | `src/shared/ui/textarea`       | Available | Long text fields                                   |
| Checkbox       | `src/shared/ui/checkbox`       | Available | Boolean fields; optional label; keyboard focus     |
| Radio group    | `src/shared/ui/radio-group`    | Planned   | Single choice lists                                |
| Switch         | `src/shared/ui/switch`         | Planned   | Toggle settings                                    |
| Tabs           | `src/shared/ui/tabs`           | Available | Section navigation                                 |
| Sheet          | `src/shared/ui/sheet`          | Available | Side panel forms and details                       |
| Dialog         | `src/shared/ui/dialog`         | Available | Modal shell + `ConfirmDialog` for destructive flow |
| Warning badge  | `src/shared/ui/warning-badge`  | Available | Inline warning/danger labels (e.g. candidate rows) |
| Dropdown menu  | `src/shared/ui/dropdown-menu`  | Planned   | Action menus                                       |
| Table          | `src/shared/ui/table`          | Planned   | TanStack Table layouts                             |
| Data table     | `src/shared/ui/data-table`     | Available | Shared table container chrome                      |
| Page header    | `src/shared/ui/page-header`    | Available | Reusable page intro/header                         |
| Status pill    | `src/shared/ui/status-pill`    | Available | Badge-based status display                         |
| Skeleton       | `src/shared/ui/skeleton`       | Available | Shared pulse placeholders                          |
| Search input   | `src/shared/ui/search-input`   | Planned   | Debounced page/search filters                      |
| Filter bar     | `src/shared/ui/filter-bar`     | Planned   | Reusable filter composition                        |
| Active filters | `src/shared/ui/active-filters` | Planned   | Applied filter chips/actions                       |
| Pagination     | `src/shared/ui/pagination`     | Planned   | Table/list pagination                              |
| Table toolbar  | `src/shared/ui/table-toolbar`  | Planned   | Search/filter/table actions                        |
| Empty state    | `src/shared/ui/empty-state`    | Available | List/table empty views                             |
| Error state    | `src/shared/ui/error-state`    | Available | Query error fallback                               |
| Loading state  | `src/shared/ui/loading-state`  | Available | Skeletons/spinners                                 |
| Toast          | `src/shared/ui/toast`          | Available | Global mutation notifications                      |

When you implement a planned primitive, change its status to **Available** and remove duplicate inline styling from features that should use it.

## File Structure

Each shared primitive follows the same layout as other components:

```text
src/shared/ui/{component-name}/
  ComponentName.tsx
  ComponentName.types.ts      # when props extend or wrap base types
  ComponentName.constants.ts  # CVA variants, size maps
  index.ts
```

Use named exports from `index.ts`. Import from `@/shared/ui/{component-name}` in features and pages.

## Review Checklist

Before finishing UI work, verify:

- [ ] Generic controls live in `src/shared/ui/`, not inline in features.
- [ ] No duplicate Tailwind control styling for the same primitive in multiple files.
- [ ] Theme matches `visual-theme.md` through shared variants, not one-off classes.
- [ ] Enabled buttons and clickable controls show a pointer cursor; disabled controls clearly show the disabled cursor and visual state.
- [ ] Hover, active, selected, and focus-visible states are defined on the shared primitive where the behavior is generic.
- [ ] Shared primitives were checked for stale bright-blue/indigo classes after any palette change.
- [ ] Feature components only compose shared primitives and pass domain data.
- [ ] Inventory table updated if a new shared primitive was added.
- [ ] `npm run build`, `npm run lint`, and `npm run format:check` pass.
