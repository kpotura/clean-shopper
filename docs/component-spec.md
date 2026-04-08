# Component Specification — Clean Shopper
**Version:** 1.0
**Last Updated:** 2026-04-07

---

## How to Use This Document
This file is referenced by CLAUDE.md and read by Claude Code at the start of every session. Before creating any new component, check here first. If a component in this spec covers the use case, use it — do not create a new one.

All visual values must use Tailwind token classes from `tailwind.config.js`. Never hardcode hex colors, pixel sizes, or spacing values.

---

## Components

### 1. Button

**Purpose:** The primary interactive control for all user-initiated actions in the app.

**Variants:** `primary` | `secondary` | `ghost`

**Props**
| Prop | Type | Required | Description |
|---|---|---|---|
| `variant` | `'primary' \| 'secondary' \| 'ghost'` | No (default: `'primary'`) | Visual style of the button |
| `size` | `'sm' \| 'md'` | No (default: `'md'`) | Controls padding and font size |
| `children` | `ReactNode` | Yes | Button label or content |
| `onClick` | `() => void` | No | Click handler |
| `disabled` | `boolean` | No | Disables interaction and applies disabled styles |
| `loading` | `boolean` | No | Shows a spinner and disables interaction |
| `type` | `'button' \| 'submit' \| 'reset'` | No (default: `'button'`) | HTML button type |
| `fullWidth` | `boolean` | No | Stretches button to fill its container |

**Visual Structure**

Base (all variants):
```
rounded-md font-sans font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary-dark
```

Size — `md`: `px-lg py-sm text-body`
Size — `sm`: `px-md py-xs text-small`

Primary variant:
```
bg-primary text-neutral-50
hover: bg-primary-light
active: bg-primary-dark
disabled: opacity-50 cursor-not-allowed
```

Secondary variant:
```
bg-secondary text-primary border border-primary
hover: bg-secondary-dark
active: bg-secondary-dark border-primary-dark text-primary-dark
disabled: opacity-50 cursor-not-allowed
```

Ghost variant:
```
bg-transparent text-primary
hover: bg-secondary
active: bg-secondary-dark
disabled: opacity-50 cursor-not-allowed
```

**States**
- **Default:** Full color per variant
- **Hover:** Lightened or tinted background per variant
- **Active/Pressed:** Darkened per variant
- **Disabled:** `opacity-50 cursor-not-allowed`, no hover effect
- **Loading:** Replace label with a spinner icon; keep button dimensions stable; `disabled` is implicitly true

**Usage Rules**
- Use `primary` for the single most important action per view (e.g., Submit, Search, Add to Cart). One primary button per view maximum.
- Use `secondary` for supporting actions alongside a primary (e.g., Cancel, Save for Later).
- Use `ghost` for low-emphasis actions in dense UI (e.g., Clear, Edit inline).
- Do not use `primary` for destructive actions — use `secondary` or `ghost` paired with a `Modal` confirmation.

---

### 2. InputField

**Purpose:** A labeled text input for collecting a single line of user-entered data in forms and settings.

**Props**
| Prop | Type | Required | Description |
|---|---|---|---|
| `id` | `string` | Yes | Links label to input for accessibility |
| `label` | `string` | Yes | Visible label above the input |
| `value` | `string` | Yes | Controlled input value |
| `onChange` | `(value: string) => void` | Yes | Change handler |
| `placeholder` | `string` | No | Placeholder text shown when empty |
| `helperText` | `string` | No | Supporting text shown below the input |
| `error` | `string` | No | Error message; triggers error state when present |
| `disabled` | `boolean` | No | Disables input interaction |
| `type` | `string` | No (default: `'text'`) | HTML input type |

**Visual Structure**

Wrapper: `flex flex-col gap-xs`

Label: `text-small font-semibold text-neutral-900`

Input:
```
w-full px-md py-sm rounded-md border border-neutral-200 bg-white
text-body text-neutral-900 placeholder:text-neutral-400
focus:outline-none focus:ring-2 focus:ring-primary-dark focus:border-primary-dark
transition-colors
```

Helper text: `text-micro text-neutral-600`

Error message: `text-micro text-error`

**States**
- **Default:** `border-neutral-200`
- **Focus:** `ring-2 ring-primary-dark border-primary-dark`
- **Error:** `border-error ring-2 ring-error`, error message visible below, helper text hidden
- **Disabled:** `bg-neutral-100 text-neutral-400 cursor-not-allowed border-neutral-200`

**Usage Rules**
- Always include a visible `label` — do not use placeholder text as a substitute for a label.
- Use `helperText` for formatting hints or context; it is replaced by `error` when validation fails.
- Use for single-line text only. Not suitable for multi-line input.

---

### 3. SearchBar

**Purpose:** A prominent input control for submitting product research queries to the conversational agent.

**Props**
| Prop | Type | Required | Description |
|---|---|---|---|
| `value` | `string` | Yes | Controlled input value |
| `onChange` | `(value: string) => void` | Yes | Change handler |
| `onSubmit` | `() => void` | Yes | Called when user submits the query |
| `placeholder` | `string` | No | Placeholder text |
| `loading` | `boolean` | No | Shows spinner in place of submit button during active search |
| `disabled` | `boolean` | No | Disables input and submit button |

**Visual Structure**

Container: `flex items-center gap-sm bg-white border border-neutral-200 rounded-full px-md py-sm shadow-sm focus-within:ring-2 focus-within:ring-primary-dark focus-within:border-primary-dark transition-all`

Input (unstyled inside container): `flex-1 text-body text-neutral-900 placeholder:text-neutral-400 bg-transparent outline-none`

Submit button (icon button, right-aligned): `text-primary hover:text-primary-dark transition-colors`

**States**
- **Default:** `border-neutral-200 shadow-sm`
- **Focus-within:** `ring-2 ring-primary-dark border-primary-dark`
- **Loading:** Submit icon replaced by spinner; input remains editable
- **Disabled:** `bg-neutral-100 text-neutral-400 cursor-not-allowed`

**Usage Rules**
- Use `SearchBar` for the main product query input only — it is the app's primary entry point.
- Use `InputField` for all other text inputs (preferences, settings). `SearchBar` is not a general-purpose input.
- The submit action fires on Enter keypress and on submit button click.

---

### 4. NavBar

**Purpose:** The persistent top navigation bar that provides app-level branding and navigation across all views.

**Props**
| Prop | Type | Required | Description |
|---|---|---|---|
| `activeRoute` | `string` | Yes | Current route path; used to apply active styles to the matching nav item |

**Visual Structure**

Container: `w-full bg-white border-b border-neutral-200 shadow-sm px-xl py-md flex items-center justify-between`

Logo / wordmark: `text-h4 font-semibold text-neutral-900`

Nav links wrapper: `flex items-center gap-lg`

Nav link (default): `text-body text-neutral-600 hover:text-neutral-900 transition-colors`

Nav link (active): `text-body text-primary font-semibold`

**States**
- **Default:** Inactive links in `text-neutral-600`
- **Active:** Matching route link in `text-primary font-semibold`
- **Hover:** `text-neutral-900`

**Usage Rules**
- Render once at the app root — never nest a `NavBar` inside a page component.
- Active state is determined by `activeRoute`, not local state within the component.
- Do not place primary action `Button` components inside `NavBar` — navigation and actions are separate concerns.

---

### 5. ProductCard

**Purpose:** Displays a researched product with its name, brand, clean/not-clean verdict, and key safety signals; used in search results, the saved library, and comparison view.

**Props**
| Prop | Type | Required | Description |
|---|---|---|---|
| `name` | `string` | Yes | Product name |
| `brand` | `string` | Yes | Brand name |
| `verdict` | `'clean' \| 'caution' \| 'avoid'` | Yes | Overall clean assessment |
| `summary` | `string` | Yes | One- to two-sentence AI reasoning for the verdict |
| `imageUrl` | `string` | No | Product image URL |
| `onSave` | `() => void` | No | Called when user saves the product to their library |
| `onAddToCart` | `() => void` | No | Called when user adds the product to cart |
| `category` | `string` | No | Category label displayed alongside the `SafetyBadge` (e.g., "Personal Care") |
| `score` | `number` | No | Numeric safety score (0–100) displayed in the card header |
| `saved` | `boolean` | No | Shows saved state on the save action |
| `loading` | `boolean` | No | Shows skeleton state while product data is loading |

**Visual Structure**

Card container: `bg-white rounded-lg shadow-sm p-lg flex flex-col gap-md hover:shadow-md transition-shadow`

Image (if present): `w-full aspect-square object-cover rounded-md bg-neutral-100`

Header row: `flex items-start justify-between gap-sm`

Product name: `text-h4 text-neutral-900`

Brand: `text-small text-neutral-600`

`SafetyBadge` — rendered with `verdict` prop, full width below header.

Summary: `text-body text-neutral-600`

Actions row: `flex items-center gap-sm mt-auto`

**States**
- **Default:** `shadow-sm`
- **Hover:** `shadow-md`
- **Loading:** Replace content with skeleton blocks using `bg-neutral-100 rounded-md animate-pulse`
- **Saved:** Save button reflects saved state (filled icon or label change)

**Usage Rules**
- Always include a `SafetyBadge` — never render a `ProductCard` without a verdict.
- Use `loading` skeleton state while awaiting AI response; do not render partial cards.
- `onSave` and `onAddToCart` are optional — omit them in comparison view where those actions are not relevant.

---

### 6. SafetyBadge

**Purpose:** A color-coded label communicating a product's or ingredient's clean/caution/avoid verdict using semantic design tokens.

**Props**
| Prop | Type | Required | Description |
|---|---|---|---|
| `verdict` | `'clean' \| 'caution' \| 'avoid'` | Yes | Safety verdict to display |
| `size` | `'sm' \| 'md'` | No (default: `'md'`) | Controls badge size |

**Visual Structure**

Base: `inline-flex items-center gap-xs rounded-full font-semibold`

Size — `md`: `px-md py-xs text-small`
Size — `sm`: `px-sm py-xs text-micro`

Verdict — `clean`: `bg-success text-neutral-50`
Verdict — `caution`: `bg-warning text-neutral-50`
Verdict — `avoid`: `bg-error text-neutral-50`

Label text: "Clean" | "Use Caution" | "Avoid"

**States**
- No interactive states. `SafetyBadge` is display-only.

**Usage Rules**
- Always pair the color with a text label — never use color alone to convey verdict.
- Use `clean` / `caution` / `avoid` semantically and consistently. Do not repurpose these colors for non-verdict meaning.
- Do not substitute `bg-primary` (red) for `bg-error` — they are visually similar but semantically distinct.
- Use `size='sm'` inside `ProductCard` where space is constrained. Use `size='md'` (default) on the product detail page where the badge is a primary signal.

---

### 7. CategoryTag

**Purpose:** A small pill label for organizing products or preferences into named categories (e.g., "Cleaning", "Personal Care", "Pantry").

**Props**
| Prop | Type | Required | Description |
|---|---|---|---|
| `label` | `string` | Yes | Category name displayed in the tag |
| `selected` | `boolean` | No | Applies selected styles when the tag is active as a filter |
| `onClick` | `() => void` | No | Makes the tag interactive as a filter control |

**Visual Structure**

Base: `inline-flex items-center px-md py-xs rounded-full text-small font-semibold transition-colors`

Default (unselected): `bg-secondary text-accent-dark`
Selected: `bg-accent text-neutral-50`
Hover (when `onClick` provided): `hover:bg-secondary-dark` (unselected) | `hover:bg-accent-dark` (selected)

**States**
- **Default:** Unselected, non-interactive display label
- **Selected:** `bg-accent text-neutral-50`
- **Hover:** Tinted background; only applies when `onClick` is provided

**Usage Rules**
- Use for category labels and filters only — not for ingredient safety signals (use `SafetyBadge` instead).
- When used as a filter, always manage `selected` state in the parent component.
- If `onClick` is omitted, render as a static label with no hover effect.

---

### 8. EmptyState

**Purpose:** A centered, informative placeholder shown when a surface has no content to display, with an optional call-to-action.

**Props**
| Prop | Type | Required | Description |
|---|---|---|---|
| `headline` | `string` | Yes | Primary message explaining why the surface is empty |
| `description` | `string` | No | Supporting copy with context or next-step guidance |
| `actionLabel` | `string` | No | Label for the optional CTA button |
| `onAction` | `() => void` | No | Handler for the CTA button; required if `actionLabel` is provided |
| `icon` | `ReactNode` | No | Illustrative icon or graphic above the headline |

**Visual Structure**

Container: `flex flex-col items-center justify-center text-center gap-md py-3xl px-xl`

Icon wrapper (if present): `text-neutral-400 mb-sm`

Headline: `text-h3 text-neutral-900`

Description (if present): `text-body text-neutral-600 max-w-md`

CTA (if present): render a `Button` with `variant='secondary'` and `actionLabel` as the label.

**States**
- **Default:** Static display, no interactive states on the container itself.
- CTA button follows `Button` component states.

**Usage Rules**
- Use in the saved library, shopping cart, and initial pre-search state.
- Always include a `headline`. `description` and `actionLabel` are strongly recommended when a clear next step exists.
- Do not use `EmptyState` as a loading placeholder — use skeleton states on the relevant component instead.
- CTA should use `variant='secondary'`, not `primary` — the empty state is a prompt, not the primary action of the view.
