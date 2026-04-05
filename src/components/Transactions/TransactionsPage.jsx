import { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../Common/Toast';
import { allCategories, formatINRFull } from '../../data/mockData';
import {
  Search, Download, FileJson, Plus, Pencil, Trash2, ChevronLeft, ChevronRight,
  UtensilsCrossed, Car, ShoppingBag, Clapperboard, Zap, HeartPulse, GraduationCap,
  Banknote, Code2, LineChart, RotateCcw, PackageOpen, X
} from 'lucide-react';
import TransactionForm from './TransactionForm';
import './Transactions.css';

const ITEMS_PER_PAGE = 12;

const categoryIconMap = {
  'Food & Dining': UtensilsCrossed,
  'Transport': Car,
  'Shopping': ShoppingBag,
  'Entertainment': Clapperboard,
  'Bills & Utilities': Zap,
  'Healthcare': HeartPulse,
  'Education': GraduationCap,
  'Salary': Banknote,
  'Freelance': Code2,
  'Investments': LineChart,
  'Refund': RotateCcw
};

export default function TransactionsPage() {
  const { state, dispatch } = useApp();
  const toast = useToast();
  const [page, setPage] = useState(1);
  const isAdmin = state.role === 'admin';

  const filtered = useMemo(() => {
    let result = [...state.transactions];
    const { search, category, type, dateFrom, dateTo, sortBy, sortOrder } = state.filters;

    if (search) {
      const s = search.toLowerCase();
      result = result.filter(t =>
        t.description.toLowerCase().includes(s) ||
        t.category.toLowerCase().includes(s)
      );
    }
    if (category !== 'all') result = result.filter(t => t.category === category);
    if (type !== 'all') result = result.filter(t => t.type === type);
    if (dateFrom) result = result.filter(t => t.date >= dateFrom);
    if (dateTo) result = result.filter(t => t.date <= dateTo);

    result.sort((a, b) => {
      let cmp = 0;
      if (sortBy === 'date') cmp = new Date(a.date) - new Date(b.date);
      else if (sortBy === 'amount') cmp = a.amount - b.amount;
      else if (sortBy === 'category') cmp = a.category.localeCompare(b.category);
      return sortOrder === 'desc' ? -cmp : cmp;
    });

    return result;
  }, [state.transactions, state.filters]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleSort = (col) => {
    const currentSortBy = state.filters.sortBy;
    const currentOrder = state.filters.sortOrder;
    dispatch({
      type: 'SET_FILTERS',
      payload: {
        sortBy: col,
        sortOrder: currentSortBy === col && currentOrder === 'desc' ? 'asc' : 'desc'
      }
    });
  };

  const handleFilter = (key, value) => {
    setPage(1);
    dispatch({ type: 'SET_FILTERS', payload: { [key]: value } });
  };

  const handleDelete = (txn) => {
    dispatch({ type: 'DELETE_TRANSACTION', payload: txn.id });
    toast.success(`Deleted "${txn.description}" successfully`);
  };

  const exportCSV = () => {
    const headers = ['Date', 'Description', 'Amount (₹)', 'Category', 'Type'];
    const rows = filtered.map(t => [t.date, `"${t.description}"`, t.amount, t.category, t.type]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${filtered.length} transactions as CSV`);
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(filtered, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${filtered.length} transactions as JSON`);
  };

  const sortIndicator = (col) => {
    if (state.filters.sortBy !== col) return <span className="sort-indicator">↕</span>;
    return <span className="sort-indicator active">{state.filters.sortOrder === 'desc' ? '↓' : '↑'}</span>;
  };

  const hasActiveFilters = state.filters.search || state.filters.category !== 'all' || state.filters.type !== 'all' || state.filters.dateFrom || state.filters.dateTo;

  return (
    <div className="transactions-page animate-fade-in">
      {/* Filters Bar */}
      <div className="filters-bar">
        <div className="filters-left">
          <div className="search-box">
            <Search size={16} className="search-icon-svg" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={state.filters.search}
              onChange={e => handleFilter('search', e.target.value)}
              className="search-input"
              id="search-transactions"
            />
          </div>
          <select
            value={state.filters.category}
            onChange={e => handleFilter('category', e.target.value)}
            className="filter-select"
            id="filter-category"
          >
            <option value="all">All Categories</option>
            {allCategories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select
            value={state.filters.type}
            onChange={e => handleFilter('type', e.target.value)}
            className="filter-select"
            id="filter-type"
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <input
            type="date"
            value={state.filters.dateFrom}
            onChange={e => handleFilter('dateFrom', e.target.value)}
            className="filter-date"
            id="filter-date-from"
          />
          <input
            type="date"
            value={state.filters.dateTo}
            onChange={e => handleFilter('dateTo', e.target.value)}
            className="filter-date"
            id="filter-date-to"
          />
          {hasActiveFilters && (
            <button className="clear-filters-btn" onClick={() => { dispatch({ type: 'RESET_FILTERS' }); setPage(1); }}>
              <X size={13} /> Clear
            </button>
          )}
        </div>
        <div className="filters-right">
          <div className="export-group">
            <button className="export-btn" onClick={exportCSV} title="Export as CSV">
              <Download size={15} /> CSV
            </button>
            <button className="export-btn" onClick={exportJSON} title="Export as JSON">
              <FileJson size={15} /> JSON
            </button>
          </div>
          {isAdmin && (
            <button
              className="add-btn"
              onClick={() => dispatch({ type: 'OPEN_TRANSACTION_MODAL' })}
              id="add-transaction-btn"
            >
              <Plus size={16} /> Add Transaction
            </button>
          )}
        </div>
      </div>

      {/* Results Info */}
      <div className="results-info">
        <span>{filtered.length} transaction{filtered.length !== 1 ? 's' : ''} found</span>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <PackageOpen size={48} strokeWidth={1.2} className="empty-state-icon" />
          <h3>No transactions found</h3>
          <p>Try adjusting your filters or add a new transaction</p>
        </div>
      ) : (
        <>
          <div className="table-wrapper">
            <table className="transactions-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort('date')} className="sortable">
                    Date {sortIndicator('date')}
                  </th>
                  <th>Description</th>
                  <th onClick={() => handleSort('amount')} className="sortable">
                    Amount {sortIndicator('amount')}
                  </th>
                  <th onClick={() => handleSort('category')} className="sortable">
                    Category {sortIndicator('category')}
                  </th>
                  <th>Type</th>
                  {isAdmin && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {paginated.map(txn => {
                  const Icon = categoryIconMap[txn.category] || ShoppingBag;
                  return (
                    <tr key={txn.id} className="table-row">
                      <td className="cell-date">
                        {new Date(txn.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="cell-desc">
                        <span className="desc-icon-wrap">
                          <Icon size={15} strokeWidth={1.8} />
                        </span>
                        {txn.description}
                      </td>
                      <td className={`cell-amount ${txn.type}`}>
                        {txn.type === 'income' ? '+' : '-'}{formatINRFull(txn.amount)}
                      </td>
                      <td>
                        <span className="category-badge">{txn.category}</span>
                      </td>
                      <td>
                        <span className={`type-badge ${txn.type}`}>
                          {txn.type === 'income' ? 'Income' : 'Expense'}
                        </span>
                      </td>
                      {isAdmin && (
                        <td className="cell-actions">
                          <button
                            className="action-btn edit"
                            onClick={() => dispatch({ type: 'OPEN_TRANSACTION_MODAL', payload: txn })}
                            title="Edit transaction"
                            aria-label={`Edit ${txn.description}`}
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            className="action-btn delete"
                            onClick={() => handleDelete(txn)}
                            title="Delete transaction"
                            aria-label={`Delete ${txn.description}`}
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="page-btn"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                aria-label="Previous page"
              >
                <ChevronLeft size={16} /> Prev
              </button>
              <div className="page-numbers">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
                  .map((p, i, arr) => (
                    <span key={p}>
                      {i > 0 && arr[i - 1] !== p - 1 && <span className="page-dots">…</span>}
                      <button
                        className={`page-num ${page === p ? 'active' : ''}`}
                        onClick={() => setPage(p)}
                        aria-label={`Page ${p}`}
                        aria-current={page === p ? 'page' : undefined}
                      >
                        {p}
                      </button>
                    </span>
                  ))}
              </div>
              <button
                className="page-btn"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                aria-label="Next page"
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}

      {state.transactionModalOpen && <TransactionForm />}
    </div>
  );
}
