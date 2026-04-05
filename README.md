# fintech-dashboard

A clean, interactive finance dashboard built with **React + Vite** and **Tailwind CSS**. Features real-time charts, transaction management, role-based UI (Admin/Viewer), and dark/light theming — all client-side with `localStorage` persistence. Currency and terminology are localised to Indian Rupees (₹).

---

## Setup

```bash
git clone https://github.com/pranadeep1/fintech-dashboard.git
cd fintech-dashboard
npm install
npm run dev
```

Open **http://localhost:5173/**

---

## Approach

### Architecture
The app uses a **feature-based folder structure** where each page (Dashboard, Transactions, Insights) owns its components. Shared stuff lives in `Common/` and `Layout/`. We completely ripped out all the custom `.css` files and moved to Tailwind CSS for styling, so it's much cleaner now.

```
src/
├── components/
│   ├── Common/          # Toast, ErrorBoundary
│   ├── Dashboard/       # Summary cards, charts, recent transactions
│   ├── Transactions/    # Table, filters, CRUD modal
│   ├── Insights/        # Analytics and visualisations
│   └── Layout/          # Sidebar, Header
├── context/
│   └── AppContext.jsx   # Global state
├── data/
│   └── mockData.js      # Mock transactions + utility functions
└── index.css            # Global CSS variables and Tailwind directives
```

### State Management
State is managed with **React Context API + `useReducer`**, persisted to `localStorage`.

```
AppContext
├── transactions[]       — Full transaction list
├── filters{}            — search, category, type, dateRange, sort
├── role                 — 'admin' | 'viewer'
├── theme                — 'dark' | 'light'
├── currentPage          — 'dashboard' | 'transactions' | 'insights'
├── transactionModalOpen — boolean
└── editingTransaction   — object | null
```

`useReducer` was chosen over plain `useState` because it makes state transitions explicit and named (`ADD_TRANSACTION`, `SET_FILTERS`, `TOGGLE_THEME`), making the logic easy to trace and extend.

### Design System
Styling is handled by **Tailwind CSS**. The base color palette and dark mode variable overrides are kept in `index.css` for simplicity, so dark/light switching is just a matter of changing a `data-theme` attribute on the body.

---

## Features

### Dashboard
- **Summary cards** — Total Balance, Income, Expenses, Savings Rate with animated number counters and trend badges
- **Balance Trend** — Area chart (last 6 months): income vs. expenses vs. net balance
- **Spending Breakdown** — Donut chart with category icons and percentage breakdown
- **Recent Transactions** — Latest 5 entries with quick "View All" navigation

### Transactions
- **Search** — Full-text across description and category 
- **Filters** — Flex-wrapping layout providing category, type, and date constraints. Features a smart empty-state with a "Clear All Filters" action if results return empty.
- **Sorting** — Click any column header (Date, Amount, Category) to toggle asc/desc
- **Pagination** — Dynamic rows per page selector (10, 20, 50, 100) with smart ellipsis page numbers
- **Sticky Headers** — Table structure wraps in an internal scroll-box allowing headers to stay pinned during vertical dataset scrolling.
- **Export** — Download filtered results as CSV or JSON (timestamped filenames)
- **CRUD** (Admin only) — Add, edit (via double-click row or action menu), and delete with a modal form.
- **Toast notifications** — Success/error feedback for every action

### Role-Based UI
| Role | Access |
|------|--------|
| **Admin** | Full CRUD, export |
| **Viewer** | Read-only; Add/Edit/Delete buttons are hidden |

Switch role using the segmented toggle in the sidebar. Role persists across refreshes.

### Insights
- Highest spending category card
- Monthly comparison bar chart (income vs. expenses)
- Spending radar chart (category distribution)
- Average daily spend metric
- Top 5 transactions by amount
- Category breakdown with animated progress bars

### Additional
- **Dark / Light theme** — Sun/Moon toggle in header top-right or via Keyboard shortcut (`Cmd+J` / `Ctrl+J`); persisted to `localStorage`
- **Smooth page transitions** — Fade out/in between pages
- **Mobile responsive** — Fixed-viewport internal layout architecture ensuring 0 horizontal-overflow. Perfectly responsive down to 375px screens using Tailwind utility classes.
- **Error boundary** — Catches runtime errors and shows a recovery UI
- **Accessibility** — ARIA labels, `role="dialog"`, `aria-modal`, `aria-current`, `htmlFor` label associations, keyboard navigation

---

## Tech Stack

| | |
|---|---|
| Framework | React 18 + Vite |
| Charts | Recharts |
| Icons | Lucide React |
| Styling | Tailwind CSS (v3) |
| State | React Context + useReducer |
| Font | Wanted Sans |
| Persistence | localStorage |

---

## Assumptions & Trade-offs

- **No backend** — All data is generated client-side. In production, context actions would map to API calls.
- **No React Router** — Three pages don't justify the dependency; state-based routing is sufficient.
- **Role simulation** — Frontend-only toggle for demonstration. Production would use JWT claims.
- **No test suite** — Out of scope for this assignment. Would use Vitest + React Testing Library in production.
