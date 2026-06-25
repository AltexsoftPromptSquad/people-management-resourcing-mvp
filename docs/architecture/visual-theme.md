# Visual Theme

This document defines the visual theme for the People Management & Resourcing MVP. Use it as the default color and brand direction for application screens, shared UI primitives, dashboards, tables, forms, status badges, and role-aware navigation.

## Product Character

The application is an internal people operations and resourcing tool for engineering managers, delivery managers, and employees. It should feel:

- Operational, calm, and trustworthy.
- Fast to scan during repeated daily use.
- Professional without feeling corporate-heavy or decorative.
- Clear about status, risk, privacy, and ownership.
- Desktop-first, with dense but readable information surfaces.

Avoid marketing-style pages, bright promotional gradients, decorative illustrations, and oversized hero composition for product screens. The product should look like a serious internal operating system for people, skills, allocations, and requests.

## Brand Direction

**Brand idea:** calm workforce intelligence.

The brand should communicate that managers can see people, risks, requests, and staffing decisions clearly without losing context.

Use restrained neutrals for most surfaces, a muted slate primary color for navigation and main actions, and semantic colors for status-heavy workflows. Blue should appear as a soft supporting accent, not as the dominant brand color.

The active application chrome must stay muted and operational. Do not use bright blue, indigo, or promotional-looking saturated colors as the primary identity for headers, primary buttons, active navigation, segmented controls, or broad layout accents unless this document is deliberately updated first.

## Core Palette

Use Tailwind color families where possible so the theme stays easy to implement.

| Purpose        | Tailwind token |       Hex | Usage                                                |
| -------------- | -------------: | --------: | ---------------------------------------------------- |
| App background |     `slate-50` | `#f8fafc` | Page background, dashboard canvas                    |
| Surface        |        `white` | `#ffffff` | Cards, tables, panels, popovers                      |
| Surface muted  |    `slate-100` | `#f1f5f9` | Secondary panels, inactive tabs, subtle fills        |
| Border         |    `slate-200` | `#e2e8f0` | Table lines, card borders, dividers                  |
| Border strong  |    `slate-300` | `#cbd5e1` | Focus-adjacent structure, resizable/table boundaries |
| Text primary   |    `slate-950` | `#020617` | Headings, high-emphasis labels                       |
| Text body      |    `slate-700` | `#334155` | Body copy, table text                                |
| Text muted     |    `slate-500` | `#64748b` | Secondary metadata, helper text                      |
| Text disabled  |    `slate-400` | `#94a3b8` | Disabled controls and unavailable metadata           |
| Primary        |    `slate-800` | `#1e293b` | Primary actions, active nav, selected state          |
| Primary hover  |    `slate-900` | `#0f172a` | Primary action hover                                 |
| Primary soft   |     `slate-50` | `#f8fafc` | Selected rows, role context panels                   |
| Primary border |    `slate-300` | `#cbd5e1` | Selected item borders, soft callouts                 |
| Brand accent   |      `sky-700` | `#0369a1` | Small labels, keylines, and low-volume brand hints   |
| Brand soft     |       `sky-50` | `#f0f9ff` | Icon wells, quiet callouts, and supporting accents   |

Avoid `blue-700`, `blue-800`, and `indigo-700` for primary actions, active navigation, role switcher selected states, page headers, or large persistent accents. If blue is needed, prefer the `sky-*` accent tokens above and keep usage low-volume.

## Semantic Colors

Semantic colors must be consistent across badges, table cells, alerts, filters, and form feedback.

| Meaning                                  | Tailwind tokens                            | Usage                                                              |
| ---------------------------------------- | ------------------------------------------ | ------------------------------------------------------------------ |
| Success / approved / available           | `emerald-50`, `emerald-200`, `emerald-700` | Approved candidates, active/healthy status, successful saves       |
| Warning / attention / partial allocation | `amber-50`, `amber-200`, `amber-800`       | Candidate warnings, partial availability, due soon                 |
| Danger / blocked / high risk             | `red-50`, `red-200`, `red-700`             | High or critical risk, rejected candidates, destructive validation |
| Info / submitted / in review             | `sky-50`, `sky-200`, `sky-700`             | Submitted requests, in-review states, neutral workflow updates     |
| Neutral / draft / inactive               | `slate-100`, `slate-300`, `slate-700`      | Drafts, closed items, inactive employees, low-emphasis states      |
| Sensitive / restricted                   | `violet-50`, `violet-200`, `violet-700`    | Sensitive profile sections, shared-profile permission hints        |

Do not use semantic colors as decoration. They should always carry business meaning.

## Role Colors

Role colors are secondary accents. Use them for role switcher affordances, role labels, and small contextual indicators. Do not recolor whole pages per role.

| Role                     | Token       | Usage                                                     |
| ------------------------ | ----------- | --------------------------------------------------------- |
| Unit Manager             | `sky-700`   | Default management context, dashboards, incoming requests |
| Sales / Delivery Manager | `teal-700`  | Request creation, candidate review context                |
| Employee                 | `slate-700` | Personal profile/self-service context                     |

Use role accents sparingly. Navigation structure and permissions should communicate role changes more than color alone.

## Status Mapping

Use this mapping for request, candidate, employee, risk, and action-item states.

| Domain          | State examples                            | Tone                                    |
| --------------- | ----------------------------------------- | --------------------------------------- |
| Request         | Draft, Closed, Cancelled                  | Neutral                                 |
| Request         | Submitted, In Review, Candidates Proposed | Info                                    |
| Request         | Approved                                  | Success                                 |
| Request         | Rejected                                  | Danger                                  |
| Candidate       | Proposed, Withdrawn                       | Info or Neutral                         |
| Candidate       | Approved                                  | Success                                 |
| Candidate       | Rejected                                  | Danger                                  |
| Employee status | Active, Allocated                         | Success or Neutral depending on context |
| Employee status | Partially Allocated, Booked               | Warning                                 |
| Employee status | Bench                                     | Info                                    |
| Employee status | Unavailable, Notice Period, Inactive      | Danger or Neutral depending on severity |
| Risk            | None, Low                                 | Neutral                                 |
| Risk            | Medium                                    | Warning                                 |
| Risk            | High, Critical                            | Danger                                  |
| Action item     | Open                                      | Info                                    |
| Action item     | Due soon                                  | Warning                                 |
| Action item     | Overdue                                   | Danger                                  |
| Action item     | Completed                                 | Success                                 |

## UI Application Rules

- Use `slate-50` page backgrounds with white surfaces for content-heavy pages.
- Use `slate-800` for primary actions and active navigation. Keep one obvious primary action where practical.
- Use `slate-900` only for hover/pressed states or very small high-emphasis surfaces; do not let dark chrome dominate the page.
- Use `sky-700`, `sky-50`, and `sky-200` as supporting brand accents for labels, icon wells, focus-adjacent details, and quiet highlights.
- Use semantic badges for workflow state and risk, not arbitrary colored labels.
- Keep table rows mostly neutral. Use subtle semantic backgrounds only for selected rows, warnings, or high-risk signals.
- Use borders and spacing before shadows. Operational screens should feel structured, not floating.
- Use `rounded-md` or `rounded-lg` consistently. Avoid pill-shaped cards and overly soft controls.
- Keep cards at `8px` radius or less unless the shared UI primitive already defines otherwise.
- Maintain visible focus rings with a muted slate or sky focus color and enough contrast against white and slate surfaces.
- Use color plus text or icons for risk and status. Never rely on color alone.
- When role-aware controls are styled as segmented buttons, the selected state should use the shared primary slate treatment; role colors may appear as icons, labels, or small accents only.

## Typography And Density

- Use compact dashboard/table typography: headings should be clear but not hero-sized.
- Prefer `text-2xl` or `text-3xl` for page titles and `text-sm` for supporting metadata.
- Use `font-medium` for table headers, labels, and status emphasis.
- Avoid negative letter spacing in dense operational UI.
- Keep line lengths comfortable in forms and detail panels; avoid wide paragraphs in dashboard screens.

## Accessibility

- Text on colored badges must meet contrast expectations against the badge background.
- Do not place important status information only in color; include labels such as `High risk`, `Submitted`, or `Approved`.
- Focus states must be visible on buttons, links, role switcher controls, table row actions, tabs, dialogs, and form fields.
- Error text should use `red-700` with clear language and be associated with the relevant field.

## Implementation Notes

- Prefer Tailwind utility classes and shadcn/ui primitives.
- Keep shared tone mappings in constants when reused by badges, status pills, tables, or filters.
- When the palette changes, update shared primitives in the same change. At minimum check `Button`, `Badge`, shadcn-style badge wrappers, navigation, and role switcher controls for stale bright-blue or inconsistent focus classes.
- Do not fix theme drift only in feature components. If a color, focus ring, hover state, cursor, disabled state, radius, or variant belongs to a generic control, update the shared UI primitive.
- Reuse the existing neutral/status tone direction already present in component examples:
  - neutral: slate
  - success: emerald
  - warning: amber
  - danger: red
- Add new tokens only when they support a repeated product meaning.
