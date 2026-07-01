# State And Rendering

Use this guide before implementing pages, filters, search inputs, tables, tabs, drawers, dialogs, or any flow where state changes can trigger route updates, queries, or large component renders.

The goal is predictable ownership: one place owns each kind of state, queries receive stable normalized params, UI controls stay controlled and reusable, and pages remain thin.

## State Ownership Decision Flow

Choose the owner before writing JSX:

```text
Need state
  |
  +-- Comes from a remote-like source? --> TanStack Query in a feature hook
  |
  +-- Should be shareable/bookmarkable in the URL?
  |     +-- useSearchParamState(defaultParams) in the route page or page/feature hook
  |
  +-- Is it temporary control input before applying/searching?
  |     +-- local state in a page/feature hook
  |
  +-- Is it a non-trivial form?
  |     +-- React Hook Form + feature schema
  |
  +-- Is it app-wide UI state?
  |     +-- Zustand in src/store
  |
  +-- Is it derived display data?
        +-- compute inline if cheap; useMemo only when expensive or passed to heavy children
```

Do not keep the same state in multiple layers unless one copy is deliberately temporary draft state. When a draft exists, name it clearly and synchronize it intentionally with the applied source.

## URL Params And Draft Inputs

`useSearchParamState(defaultParams)` is the shared primitive for URL-synchronized params. It owns one internal params state synchronized with the URL and exposes:

```ts
const { params, setParams } = useSearchParamState(defaultParams)
```

Use it for applied page state such as:

- Search text after debounce or submit.
- Active tab.
- Selected unit, status, or role filters.
- Sort field and direction.
- Pagination.

Do not use it as the local draft state for every keystroke. For text search, keep a local draft in a page/feature hook, debounce the draft, then write to URL params:

```tsx
const { params, setParams } = useSearchParamState(defaultPeopleSearchParams)
const [draftSearch, setDraftSearch] = useState(params.search)
const debouncedSearch = useDebouncedValue(draftSearch, 300)

useEffect(() => {
  setDraftSearch(params.search)
}, [params.search])

useEffect(() => {
  setParams({ search: debouncedSearch, page: 1 })
}, [debouncedSearch, setParams])
```

For an explicit **Apply filters** UX, skip debounce for those controls and write URL params only from the apply handler. Reset pagination to page 1 when search, filters, or sort changes can alter the result set.

## Page And Feature Hook Pattern

When a page has more than one state concern, create a page/feature orchestration hook instead of keeping the behavior in JSX.

Good candidates:

- `usePeoplePageState`
- `useResourcingRequestsPageState`
- `useCustomListsPageState`

These hooks may coordinate:

- URL-synchronized params.
- Temporary draft filters.
- Debounced search.
- Pagination reset behavior.
- Selected rows or active item ids.
- Dialog/drawer disclosure state.
- Normalized query params passed into feature query hooks.

Pages should compose layout, feature components, and page states. They should not contain search-param parsing, table column arrays, filter normalization, or repeated debounce logic.

## TanStack Query Keys

Feature query hooks should accept one typed params object and build query keys from stable, normalized values.

Rules:

- Do not use raw `URLSearchParams` in query keys.
- Do not use temporary draft input state in query keys.
- Do not create query keys from objects with functions, class instances, dates, or mutable references.
- Normalize empty values before they reach the query key.
- Keep feature query key helpers in the feature when more than one hook/component needs the same key.

Preferred shape:

```ts
export type PeopleQueryParams = {
  search: string
  page: number
  unitIds: readonly string[]
}

export const peopleQueryKeys = {
  all: ['people'] as const,
  list: (params: PeopleQueryParams) => [...peopleQueryKeys.all, 'list', params] as const,
}
```

If a query key changes, verify the API function, MSW handler, empty state, and table UI agree on the same params.

## Render Stability

Before finishing a page, check what causes it to render and what causes it to fetch.

Ask:

- Does typing in a search box update the URL or query on every keypress?
- Are large table columns or option arrays recreated inside the page body?
- Are expensive filters/maps/sorts recalculated on every render?
- Are unstable inline objects passed to memoized or heavy children?
- Does a query depend on draft state instead of URL-synchronized params?
- Is server-like data duplicated in Zustand or local state?

Use `useMemo` for expensive derived data or stable props for heavy children such as TanStack Table columns/options. Use `useCallback` when callback identity matters for a child, hook dependency, or event subscription. Do not add memoization by habit when the value is cheap and local.

## Filter And Table UX

Filter and table flows should behave consistently:

- Text search uses local draft + debounce by default.
- Selects, tabs, and segmented filters may write URL params immediately when the change is low-cost and obvious.
- Multi-field filter panels should usually use an explicit Apply/Clear action.
- Active filters should be visible or easy to infer from the controls.
- Clear/reset actions should restore default params.
- Pagination, sort, and active tab should be URL-synchronized when useful for sharing or browser navigation.
- Loading, empty, and error states must be present for async table/list content.
- Keep previous table structure stable during loading where practical, so the UI does not jump.

## Shared Extraction Signals

Create shared UI or shared hooks when the same app-agnostic behavior appears on a second screen.

Good shared candidates:

- `SearchInput`
- `FilterBar`
- `ActiveFilters`
- `Pagination`
- `DataTable`
- `TableToolbar`
- `ColumnVisibilityMenu`
- `useDebouncedValue`
- `useSearchParamState`
- `useDisclosure`

Keep domain-specific behavior in feature hooks/components. Shared primitives should not import feature types or encode PMR business rules.

## Review Checklist

Before finishing page/table/filter work:

- [ ] State ownership is explicit and not duplicated accidentally.
- [ ] URL-synchronized params use `useSearchParamState(defaultParams)`.
- [ ] Draft inputs do not trigger query refetches on every keypress.
- [ ] Query keys use normalized serializable params.
- [ ] Table columns, filter options, and expensive derived data are stable where needed.
- [ ] Repeated generic UI or behavior was extracted to `src/shared/ui` or `src/shared/hooks`.
- [ ] Page/feature hooks own orchestration instead of large JSX blocks.
- [ ] Loading, empty, error, and clear/reset states exist where relevant.
