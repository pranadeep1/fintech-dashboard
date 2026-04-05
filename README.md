# fintech-dashboard

A clean, interactive finance dashboard built with **React + Vite** to track and understand financial activity. Features real-time charts, transaction management, role-based UI (Admin/Viewer), and dark/light theming — all client-side with `localStorage` persistence. Currency and terminology are localised to Indian Rupees (₹).

---

## Setup

```bash
git clone https://github.com/<your-username>/fintech-dashboard.git
cd fintech-dashboard
npm install
npm run dev
```

Open **http://localhost:5173/**

---

## Approach

### Architecture
The app uses a **feature-based folder structure** where each page (Dashboard, Transactions, Insights) owns its components and styles. Shared infrastructure lives in `Common/` and `Layout/`.

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
└── index.css            # Design system (CSS custom properties)
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
All theming is done via **CSS custom properties** (`--bg`, `--surface-1`, `--accent`, etc.), making dark/light switching a single `data-theme` attribute toggle with zero JavaScript re-renders.

---

## Features

### Dashboard
- **Summary cards** — Total Balance, Income, Expenses, Savings Rate with animated number counters and trend badges
- **Balance Trend** — Area chart (last 6 months): income vs. expenses vs. net balance
- **Spending Breakdown** — Donut chart with category icons and percentage breakdown
- **Recent Transactions** — Latest 5 entries with quick "View All" navigation

### Transactions
- **Search** — Full-text across description and category
- **Filters** — Category, type (income/expense), date range; clear-all button appears when active
- **Sorting** — Click any column header (Date, Amount, Category) to toggle asc/desc
- **Pagination** — 12 rows per page with smart ellipsis page numbers
- **Export** — Download filtered results as CSV or JSON (timestamped filenames)
- **CRUD** (Admin only) — Add, edit, and delete with a modal form; inline form validation with field-level errors
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
- **Dark / Light theme** — Sun/Moon toggle in header top-right; persisted to `localStorage`
- **Smooth page transitions** — Fade + slight slide between pages
- **Mobile responsive** — Hamburger menu with slide-in sidebar + backdrop overlay; body scroll locked when open; Escape key closes it
- **Error boundary** — Catches runtime errors and shows a recovery UI
- **Accessibility** — ARIA labels, `role="dialog"`, `aria-modal`, `aria-current`, `htmlFor` label associations, keyboard navigation

---

## Tech Stack

| | |
|---|---|
| Framework | React 18 + Vite |
| Charts | Recharts |
| Icons | Lucide React |
| Styling | Vanilla CSS + CSS Custom Properties |
| State | React Context + useReducer |
| Font | Inter (Google Fonts) |
| Persistence | localStorage |

---

## Assumptions & Trade-offs

- **No backend** — All data is generated client-side. In production, context actions would map to API calls.
- **No React Router** — Three pages don't justify the dependency; state-based routing is sufficient.
- **Role simulation** — Frontend-only toggle for demonstration. Production would use JWT claims.
- **No test suite** — Out of scope for this assignment. Would use Vitest + React Testing Library in production.
