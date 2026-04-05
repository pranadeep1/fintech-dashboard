import { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { formatINRFull } from '../../data/mockData';
import {
  UtensilsCrossed, Car, ShoppingBag, Clapperboard, Zap, HeartPulse, GraduationCap,
  Banknote, Code2, LineChart, RotateCcw, ArrowRight
} from 'lucide-react';

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

export default function RecentTransactions() {
  const { state, dispatch } = useApp();
  const recent = useMemo(() => state.transactions.slice(0, 5), [state.transactions]);

  if (recent.length === 0) {
    return (
      <div className="chart-card">
        <h3 className="chart-title">Recent Transactions</h3>
        <div className="empty-chart">No transactions yet</div>
      </div>
    );
  }

  return (
    <div className="chart-card animate-fade-in">
      <div className="chart-header">
        <h3 className="chart-title">Recent Transactions</h3>
        <button
          className="view-all-btn"
          onClick={() => dispatch({ type: 'SET_PAGE', payload: 'transactions' })}
        >
          View All <ArrowRight size={14} />
        </button>
      </div>
      <div className="recent-list">
        {recent.map(txn => {
          const Icon = categoryIconMap[txn.category] || ShoppingBag;
          return (
            <div key={txn.id} className="recent-item">
              <div className="recent-left">
                <span className="recent-icon">
                  <Icon size={18} strokeWidth={1.8} />
                </span>
                <div className="recent-info">
                  <span className="recent-desc">{txn.description}</span>
                  <span className="recent-date">
                    {new Date(txn.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                    <span className="recent-cat"> · {txn.category}</span>
                  </span>
                </div>
              </div>
              <span className={`recent-amount ${txn.type}`}>
                {txn.type === 'income' ? '+' : '-'}{formatINRFull(txn.amount)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
