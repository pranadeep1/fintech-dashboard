import { useMemo, useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../Common/Toast';
import { allCategories, formatINRFull } from '../../data/mockData';
import {
  Search, Download, FileJson, Plus, Pencil, Trash2, ChevronLeft, ChevronRight,
  UtensilsCrossed, Car, ShoppingBag, Clapperboard, Zap, HeartPulse, GraduationCap,
  Banknote, Code2, LineChart, RotateCcw, PackageOpen, X
} from 'lucide-react';
import TransactionForm from './TransactionForm';


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
  const [itemsPerPage, setItemsPerPage] = useState(10);
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

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('search-transactions');
        if (searchInput) searchInput.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
    if (state.filters.sortBy !== col) return <span className="text-[0.7rem] text-text-muted ml-[2px]">↕</span>;
    return <span className="text-[0.7rem] text-accent ml-[2px]">{state.filters.sortOrder === 'desc' ? '↓' : '↑'}</span>;
  };

  const hasActiveFilters = state.filters.search || state.filters.category !== 'all' || state.filters.type !== 'all' || state.filters.dateFrom || state.filters.dateTo;

  return (
    <div className="flex flex-col gap-3.5 animate-fade-in">
      {/* Filters Bar */}
      <div className="flex items-center justify-between gap-3 flex-wrap bg-surface-1 border border-border rounded-[14px] py-3.5 px-[18px]">
        <div className="flex items-center gap-2 flex-wrap flex-1 w-full">
          <div className="relative min-w-[200px] max-[900px]:min-w-0 max-[900px]:w-full">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
            <input
              type="text"
              placeholder="Search..."
              value={state.filters.search}
              onChange={e => handleFilter('search', e.target.value)}
              className="w-full py-[9px] pr-9 pl-9 rounded-lg border border-border bg-surface-2 text-text-primary text-[0.83rem] font-sans transition-all duration-200 focus:outline-none focus:border-accent focus:ring-[3px] focus:ring-accent-bg"
              id="search-transactions"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center max-sm:hidden pointer-events-none">
              <kbd className="bg-surface-1 border border-border text-text-muted rounded-[4px] px-1.5 py-[2px] text-[0.65rem] font-mono font-bold shadow-sm">
                ⌘K
              </kbd>
            </div>
          </div>
          <select
            value={state.filters.category}
            onChange={e => handleFilter('category', e.target.value)}
            className="flex-1 min-w-[130px] py-[9px] px-3 rounded-lg border border-border bg-surface-2 text-text-primary text-[0.83rem] font-sans cursor-pointer transition-all duration-200 focus:outline-none focus:border-accent focus:ring-[3px] focus:ring-accent-bg"
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
            className="flex-1 min-w-[110px] py-[9px] px-3 rounded-lg border border-border bg-surface-2 text-text-primary text-[0.83rem] font-sans cursor-pointer transition-all duration-200 focus:outline-none focus:border-accent focus:ring-[3px] focus:ring-accent-bg"
            id="filter-type"
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <input
            type={state.filters.dateFrom ? "date" : "text"}
            placeholder="Start Date"
            onFocus={e => e.target.type = "date"}
            onBlur={e => { if (!e.target.value) e.target.type = "text"; }}
            value={state.filters.dateFrom}
            onChange={e => handleFilter('dateFrom', e.target.value)}
            className="flex-1 min-w-[120px] py-[9px] px-3 rounded-lg border border-border bg-surface-2 text-text-primary text-[0.83rem] font-sans cursor-pointer transition-all duration-200 focus:outline-none focus:border-accent focus:ring-[3px] focus:ring-accent-bg"
            id="filter-date-from"
          />
          <input
            type={state.filters.dateTo ? "date" : "text"}
            placeholder="End Date"
            onFocus={e => e.target.type = "date"}
            onBlur={e => { if (!e.target.value) e.target.type = "text"; }}
            value={state.filters.dateTo}
            onChange={e => handleFilter('dateTo', e.target.value)}
            className="flex-1 min-w-[120px] py-[9px] px-3 rounded-lg border border-border bg-surface-2 text-text-primary text-[0.83rem] font-sans cursor-pointer transition-all duration-200 focus:outline-none focus:border-accent focus:ring-[3px] focus:ring-accent-bg"
            id="filter-date-to"
          />
          {hasActiveFilters && (
            <button className="flex items-center gap-1 py-[7px] px-3 rounded-lg border-none bg-red-500/10 text-red-500 text-[0.78rem] font-semibold cursor-pointer font-sans transition-all duration-200 hover:bg-red-500/20" onClick={() => { dispatch({ type: 'RESET_FILTERS' }); setPage(1); }}>
              <X size={13} /> Clear
            </button>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2 max-[900px]:justify-between max-[900px]:w-full">
          <div className="flex flex-wrap gap-1">
            <button className="flex items-center gap-[5px] py-[9px] px-[14px] rounded-lg border border-border bg-surface-2 text-text-primary text-[0.83rem] font-semibold cursor-pointer font-sans transition-all duration-200 hover:bg-surface-3 hover:border-accent" onClick={exportCSV} title="Export as CSV">
              <Download size={15} /> CSV
            </button>
            <button className="flex items-center gap-[5px] py-[9px] px-[14px] rounded-lg border border-border bg-surface-2 text-text-primary text-[0.83rem] font-semibold cursor-pointer font-sans transition-all duration-200 hover:bg-surface-3 hover:border-accent" onClick={exportJSON} title="Export as JSON">
              <FileJson size={15} /> JSON
            </button>
          </div>
          {isAdmin && (
            <button
              className="flex items-center gap-[5px] py-[9px] px-4 rounded-lg border-none bg-gradient-to-br from-accent to-[#8b5cf6] text-white text-[0.83rem] font-bold cursor-pointer font-sans transition-all duration-200 whitespace-nowrap hover:opacity-90 hover:-translate-y-[1px]"
              onClick={() => dispatch({ type: 'OPEN_TRANSACTION_MODAL' })}
              id="add-transaction-btn"
            >
              <Plus size={16} /> Add Transaction
            </button>
          )}
        </div>
      </div>

      {/* Results Info */}
      <div className="text-[0.78rem] text-text-muted px-1 font-medium">
        <span>{filtered.length} transaction{filtered.length !== 1 ? 's' : ''} found</span>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-14 px-5 bg-surface-1 border border-border rounded-[14px] text-center">
          <PackageOpen size={48} strokeWidth={1.2} className="text-text-muted mb-4" />
          <h3 className="text-text-primary m-0 mb-1.5 text-[1rem]">No transactions found</h3>
          <p className="text-text-muted m-0 text-[0.85rem] mb-4">Try adjusting your filters or add a new transaction</p>
          {hasActiveFilters && (
            <button
              className="flex items-center gap-2 py-2 px-4 rounded-lg border-none bg-red-500/10 text-red-500 font-semibold cursor-pointer font-sans transition-all duration-200 hover:bg-red-500/20"
              onClick={() => { dispatch({ type: 'RESET_FILTERS' }); setPage(1); }}
            >
              <RotateCcw size={16} /> Clear All Filters
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="overflow-auto w-full max-w-full max-h-[calc(100vh-320px)] min-h-[300px] rounded-[14px] border border-border bg-surface-1 shadow-sm">
            <table className="w-full border-collapse text-[0.85rem] relative">
              <thead className="sticky top-0 z-10 shadow-sm outline outline-1 outline-border">
                <tr>
                  <th onClick={() => handleSort('date')} className="py-3 px-4 text-left font-semibold text-text-muted text-[0.73rem] uppercase tracking-[0.5px] bg-surface-2 whitespace-nowrap cursor-pointer select-none hover:text-accent">
                    Date {sortIndicator('date')}
                  </th>
                  <th className="py-3 px-4 text-left font-semibold text-text-muted text-[0.73rem] uppercase tracking-[0.5px] bg-surface-2 whitespace-nowrap">Description</th>
                  <th onClick={() => handleSort('amount')} className="py-3 px-4 text-left font-semibold text-text-muted text-[0.73rem] uppercase tracking-[0.5px] bg-surface-2 whitespace-nowrap cursor-pointer select-none hover:text-accent">
                    Amount {sortIndicator('amount')}
                  </th>
                  <th onClick={() => handleSort('category')} className="py-3 px-4 text-left font-semibold text-text-muted text-[0.73rem] uppercase tracking-[0.5px] bg-surface-2 whitespace-nowrap cursor-pointer select-none hover:text-accent">
                    Category {sortIndicator('category')}
                  </th>
                  <th className="py-3 px-4 text-left font-semibold text-text-muted text-[0.73rem] uppercase tracking-[0.5px] bg-surface-2 whitespace-nowrap">Type</th>
                  {isAdmin && <th className="py-3 px-4 text-left font-semibold text-text-muted text-[0.73rem] uppercase tracking-[0.5px] bg-surface-2 whitespace-nowrap">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {paginated.map(txn => {
                  const Icon = categoryIconMap[txn.category] || ShoppingBag;
                  return (
                    <tr 
                      key={txn.id} 
                      className={`transition-colors duration-150 hover:bg-surface-2 ${isAdmin ? 'cursor-pointer' : ''}`}
                      onDoubleClick={() => isAdmin && dispatch({ type: 'OPEN_TRANSACTION_MODAL', payload: txn })}
                      title={isAdmin ? "Double-click to edit" : ""}
                    >
                      <td className="py-3 px-4 border-b border-border text-text-secondary whitespace-nowrap text-[0.8rem]">
                        {new Date(txn.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="py-3 px-4 border-b border-border text-text-primary flex items-center gap-2 font-medium">
                        <span className="w-[30px] h-[30px] rounded-lg bg-surface-2 flex items-center justify-center text-text-muted shrink-0">
                          <Icon size={15} strokeWidth={1.8} />
                        </span>
                        {txn.description}
                      </td>
                      <td className={`py-3 px-4 border-b border-border text-text-primary font-bold whitespace-nowrap tabular-nums ${txn.type === 'income' ? 'text-emerald-500' : 'text-red-500'}`}>
                        {txn.type === 'income' ? '+' : '-'}{formatINRFull(txn.amount)}
                      </td>
                      <td className="py-3 px-4 border-b border-border text-text-primary">
                        <span className="inline-block py-1 px-2.5 rounded-md text-[0.73rem] font-medium bg-surface-2 text-text-secondary">{txn.category}</span>
                      </td>
                      <td className="py-3 px-4 border-b border-border text-text-primary">
                        <span className={`inline-block py-[3px] px-2.5 rounded-md text-[0.7rem] font-bold tracking-[0.3px] ${txn.type === 'income' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                          {txn.type === 'income' ? 'Income' : 'Expense'}
                        </span>
                      </td>
                      {isAdmin && (
                        <td className="py-3 px-4 border-b border-border text-text-primary">
                          <div className="flex gap-1">
                            <button
                              className="w-[30px] h-[30px] rounded-lg border border-border bg-surface-2 text-text-muted cursor-pointer flex items-center justify-center transition-all duration-150 hover:bg-accent-bg hover:text-accent hover:border-accent"
                              onClick={() => dispatch({ type: 'OPEN_TRANSACTION_MODAL', payload: txn })}
                              title="Edit transaction"
                              aria-label={`Edit ${txn.description}`}
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              className="w-[30px] h-[30px] rounded-lg border border-border bg-surface-2 text-text-muted cursor-pointer flex items-center justify-center transition-all duration-150 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500"
                              onClick={() => handleDelete(txn)}
                              title="Delete transaction"
                              aria-label={`Delete ${txn.description}`}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 py-2 px-1">
            <div className="flex items-center gap-2 text-[0.8rem] text-text-muted">
              <span className="font-medium">Rows per page:</span>
              <select
                value={itemsPerPage}
                onChange={e => {
                  setItemsPerPage(Number(e.target.value));
                  setPage(1);
                }}
                className="bg-surface-2 border border-border text-text-primary rounded-md px-1.5 py-1 outline-none focus:border-accent font-semibold cursor-pointer transition-colors duration-200"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>

            {totalPages > 1 && (
              <div className="flex flex-wrap items-center justify-center gap-1.5 py-1">
                <button
                  className="flex items-center gap-1 py-[7px] px-3.5 rounded-lg border border-border bg-surface-1 text-text-secondary text-[0.8rem] font-semibold cursor-pointer font-sans transition-all duration-200 hover:not:disabled:bg-surface-2 hover:not:disabled:text-text-primary disabled:opacity-35 disabled:cursor-not-allowed"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  aria-label="Previous page"
                >
                  <ChevronLeft size={16} /> Prev
                </button>
                <div className="flex flex-wrap items-center justify-center gap-[3px]">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
                    .map((p, i, arr) => (
                      <span key={p} className="flex">
                        {i > 0 && arr[i - 1] !== p - 1 && <span className="px-[3px] text-text-muted text-[0.8rem] flex items-center justify-center">…</span>}
                        <button
                          className={`w-[34px] h-[34px] rounded-lg border bg-surface-1 text-[0.8rem] font-semibold cursor-pointer font-sans transition-all duration-200 ${page === p ? 'bg-accent text-white border-accent' : 'border-border text-text-secondary hover:bg-surface-2'}`}
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
                  className="flex items-center gap-1 py-[7px] px-3.5 rounded-lg border border-border bg-surface-1 text-text-secondary text-[0.8rem] font-semibold cursor-pointer font-sans transition-all duration-200 hover:not:disabled:bg-surface-2 hover:not:disabled:text-text-primary disabled:opacity-35 disabled:cursor-not-allowed"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  aria-label="Next page"
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {state.transactionModalOpen && <TransactionForm />}
    </div>
  );
}
