---
name: pmr-desktop-ui-audit
description: Audit People Management & Resourcing MVP pages using the Chrome DevTools MCP in desktop view only. Use only when the user explicitly requests a desktop UI audit, or after asking for and receiving permission to run it.
---

# PMR Desktop UI Audit

Use this skill only when the user explicitly asks for a desktop UI audit, or after you ask for and receive permission to run it. Do not run this skill automatically after creating or changing visible PMR application pages.

The audit is desktop-only and uses the Chrome DevTools MCP when it is available.

## Permission Rule

- Do not start a desktop UI audit automatically.
- If the user explicitly asks for the audit, proceed.
- If you believe an audit would be useful but the user did not ask for it, ask for permission before starting.
- If the user says not to run audits automatically, honor that instruction and do not treat visible UI changes as an audit trigger.

## Scope

- Audit only desktop viewports. Do not run mobile or tablet checks unless the user explicitly asks.
- Prefer `1440x900` as the default desktop viewport. Also check `1280x800` when layouts are dense, table-heavy, or sidebar-based.
- Use the Chrome DevTools MCP for navigation, viewport control, DOM inspection, screenshots, console messages, and network/runtime checks.
- Use the Browser plugin only as a fallback if the Chrome DevTools MCP is unavailable.
- Audit created or changed pages, not the entire app, unless the user asks for a broader pass.
- Treat console errors, failed network requests, blank screens, overlapping text, inaccessible controls, and broken navigation as blocking issues.

## Workflow

1. Read `AGENTS.md` and use `$pmr-react-spa` when the audit follows substantial frontend work.
2. Start the app with the project script, usually `npm run dev`, unless a dev server is already running.
3. Open each created or changed route through the Chrome DevTools MCP at a desktop viewport.
4. Wait for mock data and async states to settle. Interact with filters, tabs, dialogs, forms, menus, tables, route links, and empty/error states that the page exposes.
5. Inspect the page visually and through the Chrome DevTools MCP for layout, accessibility basics, console output, and network/runtime failures.
6. Fix issues found during the audit when they are within the current task scope.
7. Re-run the affected desktop checks after fixes.
8. Finish only after reporting the pages checked, the viewport(s), key findings, fixes made, and any remaining risk.

## Desktop Audit Checklist

Check these items on every audited page:

- Page loads without React errors, uncaught exceptions, hydration issues, or blank content.
- Navigation uses route helpers and lands on the expected screen.
- Desktop layout uses the available width well without stretched, sparse, or marketing-style composition for operational screens.
- Tables, dashboards, filters, sidebars, and action bars remain aligned at `1440x900`; dense views also hold at `1280x800`.
- Text does not overlap, clip, wrap awkwardly inside controls, or crowd adjacent content.
- Buttons, icons, menus, form fields, tabs, dialogs, and tooltips have visible hover/focus states.
- Loading, empty, and error states are visible and professional where data is async or filterable.
- Forms expose labels, validation messages, disabled/submitting states, and keyboard-friendly focus order.
- Tables support expected sorting/filtering affordances and remain readable with realistic PMR data.
- Color, spacing, border radius, typography scale, and shadcn/ui usage match the existing app.
- Console has no new errors or noisy warnings caused by the change.
- Network panel has no unexpected failed mock/API requests.

## Reporting Format

Keep the final audit note concise:

- `Pages checked`: route names or paths.
- `Viewport`: desktop size(s), usually `1440x900` and optionally `1280x800`.
- `Result`: pass, fixed issues, or remaining issues.
- `Verification`: commands run and whether the dev server was used.

When issues are found, include file references for fixes. If an issue is intentionally left unresolved, explain why and name the affected route.
