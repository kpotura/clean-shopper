# Feature Spec: Favorites List
**Status:** Draft
**Last Updated:** 2026-04-17

---

## What the Feature Does

The Favorites List lets users save products they want to revisit, organized into a persistent personal library. Users save a product by tapping "Save" on any `ProductCard`. Saved products appear on the Library screen, where they can filter by category, sort by different criteria, and remove items they no longer want.

Unlike the Shopping List — which is task-oriented and built around purchasing intent — Favorites is reference-oriented: a curated collection of products the user trusts or wants to evaluate further. A product can exist in both lists simultaneously.

**Core user flows:**
1. **Save** — tap "Save" on any `ProductCard` in Browse or Search; button updates to "Saved ✓".
2. **Review** — navigate to Favorites; view all saved products in a filterable, sortable grid.
3. **Filter by category** — tap a `CategoryTag` chip to narrow the grid to one category.
4. **Sort** — change display order via a `SortControl` (Date Saved, Name A–Z, Verdict).
5. **Unsave / remove** — tap "Saved ✓" to toggle off, or use the remove action on the Favorites screen; product leaves the list.
6. **Empty state** — when no products are saved, an `EmptyState` prompts the user to browse.
7. **Share** - tap "Share" at top or bottom of page

---

## Existing Components Reused

| Component | How it is used |
|---|---|
| `NavBar` | Top navigation; `activeRoute='favorites'` |
| `ProductCard` | Renders each saved product; `saved={true}` on all cards; `onSave` wires to the unsave handler |
| `SafetyBadge` | Rendered inside `ProductCard` as usual; no change needed |
| `CategoryTag` | Filter bar above the grid; one chip per category present in saved products |
| `Button` | "Remove all" destructive action (`variant='ghost'`); empty state CTA (`variant='secondary'`) |
| `EmptyState` | Shown when no products are saved; CTA navigates to Browse |

---

## New Components Needed

### 1. `SortControl`

**File:** `/src/components/SortControl.jsx`

**Purpose:** A compact inline control for selecting the sort order of a list. Shared component — suitable for any sorted list view in the app (Browse, Library, Shopping List).

**Props**
| Prop | Type | Required | Description |
|---|---|---|---|
| `options` | `Array<{ value: string, label: string }>` | Yes | The available sort options |
| `value` | `string` | Yes | The currently selected option value |
| `onChange` | `(value: string) => void` | Yes | Called when user selects a new option |
| `label` | `string` | No (default: `'Sort by'`) | Accessible label prefix rendered before the control |

**Visual Structure**

```
Container: inline-flex items-center gap-sm

  ├── Label: text-small text-neutral-600 whitespace-nowrap
  │          e.g. "Sort by"
  │
  └── Select element:
        text-small font-semibold text-neutral-900
        bg-white border border-neutral-200 rounded-md
        px-sm py-xs
        focus:outline-none focus:ring-2 focus:ring-primary-dark focus:border-primary-dark
        cursor-pointer transition-colors
        hover:border-neutral-400
```

**States**
- **Default:** `border-neutral-200`
- **Hover:** `border-neutral-400`
- **Focus:** `ring-2 ring-primary-dark border-primary-dark`
- **Disabled:** `opacity-50 cursor-not-allowed` (for future use when list is empty)

**Design Tokens**
- Label text: `text-small text-neutral-600`
- Select text: `text-small font-semibold text-neutral-900`
- Select bg: `bg-white`
- Border at rest: `border-neutral-200`
- Border hover: `border-neutral-400`
- Border radius: `rounded-md`
- Padding: `px-sm py-xs`
- Gap: `gap-sm`
- Focus ring: `ring-2 ring-primary-dark`

**Usage Rules**
- Always pass a `label` value for screen reader context — do not render a bare select with no label.
- `options` must have at least 2 items; do not render `SortControl` for a single-option list.
- Manage `value` state in the parent. `SortControl` is fully controlled.

---

## Design Tokens Applied to New Components

### Colors
| Token | Where used |
|---|---|
| `bg-white` | `SortControl` select background |
| `border-neutral-200` | `SortControl` select border at rest |
| `border-neutral-400` | `SortControl` select border on hover |
| `text-neutral-900` | `SortControl` selected option text |
| `text-neutral-600` | `SortControl` label text |
| `ring-primary-dark` | Focus ring on `SortControl` select |

### Typography
| Token | Where used |
|---|---|
| `text-h2` | Page title "Library" |
| `text-body` | Saved item count summary (e.g., "12 saved products") |
| `text-small` | `SortControl` label and select text; category filter label |

### Spacing
| Token | Where used |
|---|---|
| `gap-sm` (8px) | `SortControl` gap between label and select; `CategoryTag` filter bar gap |
| `px-sm py-xs` | `SortControl` select padding |
| `gap-md` (16px) | Gap between filter bar and product grid |
| `gap-lg` (24px) | Product grid column and row gap |
| `py-xl` (40px) | Page-level top/bottom padding |

### Shadows & Radius
| Token | Where used |
|---|---|
| `rounded-md` | `SortControl` select element |

---

## Data Model

**Table:** `saved_products`

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | Primary key |
| `user_id` | `uuid` | FK → `auth.users`, RLS enforced |
| `product_id` | `uuid` | FK → `products` |
| `created_at` | `timestamptz` | Used for "Date Saved" sort order |

Row Level Security: users may only read and write their own rows. A unique constraint on `(user_id, product_id)` prevents duplicate saves.

---

## Sort Options

| Value | Label | Behavior |
|---|---|---|
| `date_desc` | Date Saved | Most recently saved first (default) |
| `name_asc` | Name A–Z | Alphabetical by product name |
| `verdict` | Verdict | clean → caution → avoid |

---

## Acceptance Criteria

### Save / Unsave
- [ ] Tapping "Save" on a `ProductCard` saves the product and updates the button to "Saved ✓" immediately (optimistic update).
- [ ] Tapping "Saved ✓" on a saved product removes it from favorites and reverts the button to "Save" immediately (optimistic update).
- [ ] A failed Supabase write reverts the optimistic update and surfaces an inline error.
- [ ] Saved state is consistent across views — if a product is saved in Browse, it appears as "Saved ✓" anywhere that product is rendered in the same session.

### Library Screen
- [ ] Navigating to Library sets the NavBar active state to `'library'`.
- [ ] All saved products render as `ProductCard` components with `saved={true}`.
- [ ] Saved product count is displayed below the page title (e.g., "12 saved products").
- [ ] Cards are ordered by the active sort option; default is Date Saved (most recent first).
- [ ] When no products are saved, `EmptyState` renders with headline "No saved products yet" and a "Browse products" CTA that navigates to Browse.

### Filter
- [ ] `CategoryTag` chips appear above the grid whenever ≥ 2 distinct categories are present in saved products.
- [ ] Selecting a chip filters the grid to that category only; count label updates to reflect the filtered count.
- [ ] An "All" chip resets the filter and is selected by default.
- [ ] When a filter is active and yields zero results, `EmptyState` renders with headline "No [Category] products saved" and a "Clear filter" CTA.

### Sort
- [ ] `SortControl` renders above the grid with options: Date Saved, Name A–Z, Verdict.
- [ ] Changing the sort option reorders the visible grid immediately (client-side, no reload).
- [ ] Sort selection persists for the session (does not need to survive page reload).

### Remove
- [ ] Unsaving a product from the Library screen removes it from the grid immediately (optimistic).
- [ ] The removed product's `ProductCard` in Browse/Search reverts to `saved={false}` in the same session.

### Accessibility (WCAG 2.2 AA)
- [ ] All text in `SortControl` meets 4.5:1 contrast against its background.
- [ ] The `SortControl` select has a programmatically associated label (via `<label>` with `htmlFor` or `aria-label`).
- [ ] The select element has a visible focus ring using `ring-primary-dark`.
- [ ] `CategoryTag` filter chips are keyboard operable and have visible focus rings.
- [ ] `ProductCard` save/unsave button label change ("Save" ↔ "Saved ✓") is announced to screen readers via `aria-pressed` or `aria-label` update.
- [ ] The saved product count summary is rendered in a `<p>` or appropriate landmark so it is reachable by screen readers after filtering.
