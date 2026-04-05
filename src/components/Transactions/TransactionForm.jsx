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
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="modal-header">
          <h2 id="modal-title">{editing ? 'Edit Transaction' : 'Add Transaction'}</h2>
          <button className="modal-close" onClick={handleClose} aria-label="Close">
            <X size={16} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="transaction-form" noValidate>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="txn-type">Type</label>
              <div className="type-toggle">
                <button
                  type="button"
                  className={`type-btn ${form.type === 'expense' ? 'active expense' : ''}`}
                  onClick={() => setForm(f => ({ ...f, type: 'expense', category: 'Food & Dining' }))}
                >
                  Expense
                </button>
                <button
                  type="button"
                  className={`type-btn ${form.type === 'income' ? 'active income' : ''}`}
                  onClick={() => setForm(f => ({ ...f, type: 'income', category: 'Salary' }))}
                >
                  Income
                </button>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="txn-date">Date</label>
              <input
                type="date"
                id="txn-date"
                value={form.date}
                onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                className={`form-input ${errors.date ? 'input-error' : ''}`}
                required
              />
              {errors.date && <span className="field-error">{errors.date}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="txn-description">Description</label>
            <input
              type="text"
              id="txn-description"
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="e.g., Swiggy Order, Monthly Salary"
              className={`form-input ${errors.description ? 'input-error' : ''}`}
              required
              autoFocus
            />
            {errors.description && <span className="field-error">{errors.description}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="txn-amount">Amount (₹)</label>
              <input
                type="number"
                id="txn-amount"
                step="1"
                min="1"
                value={form.amount}
                onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                placeholder="0"
                className={`form-input ${errors.amount ? 'input-error' : ''}`}
                required
              />
              {errors.amount && <span className="field-error">{errors.amount}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="txn-category">Category</label>
              <select
                id="txn-category"
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className="form-input"
              >
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={handleClose}>
              Cancel
            </button>
            <button type="submit" className="btn-submit">
              {editing ? 'Save Changes' : 'Add Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
