import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../Common/Toast';
import { allCategories } from '../../data/mockData';
import { X } from 'lucide-react';

export default function TransactionForm() {
  const { state, dispatch } = useApp();
  const toast = useToast();
  const editing = state.editingTransaction;

  const [form, setForm] = useState({
    description: '',
    amount: '',
    category: 'Food & Dining',
    type: 'expense',
    date: new Date().toISOString().split('T')[0]
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editing) {
      setForm({
        description: editing.description,
        amount: editing.amount.toString(),
        category: editing.category,
        type: editing.type,
        date: editing.date,
      });
    }
  }, [editing]);

  const validate = () => {
    const newErrors = {};
    if (!form.description.trim()) newErrors.description = 'Description is required';
    if (!form.amount || parseFloat(form.amount) <= 0) newErrors.amount = 'Enter a valid amount';
    if (!form.date) newErrors.date = 'Date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const transaction = {
      id: editing ? editing.id : 'txn_' + Math.random().toString(36).substr(2, 9),
      description: form.description.trim(),
      amount: parseFloat(form.amount),
      category: form.category,
      type: form.type,
      date: form.date,
    };

    dispatch({
      type: editing ? 'EDIT_TRANSACTION' : 'ADD_TRANSACTION',
      payload: transaction
    });

    toast.success(editing
      ? `Updated "${transaction.description}" successfully`
      : `Added "${transaction.description}" successfully`
    );

    dispatch({ type: 'CLOSE_TRANSACTION_MODAL' });
  };

  const handleClose = () => dispatch({ type: 'CLOSE_TRANSACTION_MODAL' });

  const categories = form.type === 'income'
    ? allCategories.filter(c => ['Salary', 'Freelance', 'Investments', 'Refund'].includes(c))
    : allCategories.filter(c => !['Salary', 'Freelance', 'Investments', 'Refund'].includes(c));

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[200] animate-fade-in" onClick={handleClose}>
      <div className="bg-surface-1 border border-border rounded-2xl p-6 w-[90%] max-w-[500px] shadow-[0_20px_60px_rgba(0,0,0,0.3)] animate-fade-in max-sm:p-4 max-sm:w-[95%]" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="flex items-center justify-between mb-5">
          <h2 id="modal-title" className="text-[1.1rem] font-bold text-text-primary m-0">{editing ? 'Edit Transaction' : 'Add Transaction'}</h2>
          <button className="w-[30px] h-[30px] rounded-lg border border-border bg-surface-2 text-text-muted cursor-pointer flex items-center justify-center transition-colors duration-150 hover:bg-surface-3 hover:text-text-primary" onClick={handleClose} aria-label="Close">
            <X size={16} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
            <div className="flex flex-col gap-[5px]">
              <label htmlFor="txn-type" className="text-[0.73rem] font-bold text-text-muted uppercase tracking-[0.5px]">Type</label>
              <div className="grid grid-cols-2 gap-1 bg-surface-2 rounded-lg p-[3px]">
                <button
                  type="button"
                  className={`p-[7px] rounded-md border-none bg-transparent text-text-muted text-[0.83rem] font-semibold cursor-pointer font-sans transition-all duration-200 ${form.type === 'expense' ? 'bg-[#ef44441f] text-[#ef4444]' : ''}`}
                  onClick={() => setForm(f => ({ ...f, type: 'expense', category: 'Food & Dining' }))}
                >
                  Expense
                </button>
                <button
                  type="button"
                  className={`p-[7px] rounded-md border-none bg-transparent text-text-muted text-[0.83rem] font-semibold cursor-pointer font-sans transition-all duration-200 ${form.type === 'income' ? 'bg-[#10b9811f] text-[#10b981]' : ''}`}
                  onClick={() => setForm(f => ({ ...f, type: 'income', category: 'Salary' }))}
                >
                  Income
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-[5px]">
              <label htmlFor="txn-date" className="text-[0.73rem] font-bold text-text-muted uppercase tracking-[0.5px]">Date</label>
              <input
                type="date"
                id="txn-date"
                value={form.date}
                onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                className={`p-[9px] px-3 rounded-lg border border-border bg-surface-2 text-text-primary text-[0.85rem] font-sans transition-all duration-200 focus:outline-none focus:border-accent focus:ring-[3px] focus:ring-accent-bg ${errors.date ? '!border-[#ef4444] !shadow-[0_0_0_3px_rgba(239,68,68,0.1)]' : ''}`}
                required
              />
              {errors.date && <span className="text-[0.7rem] text-[#ef4444] font-medium mt-[1px]">{errors.date}</span>}
            </div>
          </div>

          <div className="flex flex-col gap-[5px]">
            <label htmlFor="txn-description" className="text-[0.73rem] font-bold text-text-muted uppercase tracking-[0.5px]">Description</label>
            <input
              type="text"
              id="txn-description"
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="e.g., Swiggy Order, Monthly Salary"
              className={`p-[9px] px-3 rounded-lg border border-border bg-surface-2 text-text-primary text-[0.85rem] font-sans transition-all duration-200 focus:outline-none focus:border-accent focus:ring-[3px] focus:ring-accent-bg ${errors.description ? '!border-[#ef4444] !shadow-[0_0_0_3px_rgba(239,68,68,0.1)]' : ''}`}
              required
              autoFocus
            />
            {errors.description && <span className="text-[0.7rem] text-[#ef4444] font-medium mt-[1px]">{errors.description}</span>}
          </div>

          <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
            <div className="flex flex-col gap-[5px]">
              <label htmlFor="txn-amount" className="text-[0.73rem] font-bold text-text-muted uppercase tracking-[0.5px]">Amount (₹)</label>
              <input
                type="number"
                id="txn-amount"
                step="1"
                min="1"
                value={form.amount}
                onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                placeholder="0"
                className={`p-[9px] px-3 rounded-lg border border-border bg-surface-2 text-text-primary text-[0.85rem] font-sans transition-all duration-200 focus:outline-none focus:border-accent focus:ring-[3px] focus:ring-accent-bg ${errors.amount ? '!border-[#ef4444] !shadow-[0_0_0_3px_rgba(239,68,68,0.1)]' : ''}`}
                required
              />
              {errors.amount && <span className="text-[0.7rem] text-[#ef4444] font-medium mt-[1px]">{errors.amount}</span>}
            </div>
            <div className="flex flex-col gap-[5px]">
              <label htmlFor="txn-category" className="text-[0.73rem] font-bold text-text-muted uppercase tracking-[0.5px]">Category</label>
              <select
                id="txn-category"
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className="p-[9px] px-3 rounded-lg border border-border bg-surface-2 text-text-primary text-[0.85rem] font-sans transition-all duration-200 focus:outline-none focus:border-accent focus:ring-[3px] focus:ring-accent-bg"
              >
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-1.5">
            <button type="button" className="px-[18px] py-[9px] rounded-lg border border-border bg-surface-2 text-text-secondary text-[0.83rem] font-semibold cursor-pointer font-sans transition-all duration-200 hover:bg-surface-3" onClick={handleClose}>
              Cancel
            </button>
            <button type="submit" className="px-[20px] py-[9px] rounded-lg border-none bg-gradient-to-br from-accent to-[#8b5cf6] text-white text-[0.83rem] font-bold cursor-pointer font-sans transition-all duration-200 hover:opacity-90 hover:-translate-y-[1px]">
              {editing ? 'Save Changes' : 'Add Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
