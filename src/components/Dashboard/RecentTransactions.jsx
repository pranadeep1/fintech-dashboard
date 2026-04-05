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
      <div className="bg-surface-1 border border-border rounded-[14px] p-[22px]">
        <h3 className="text-[0.95rem] font-bold text-text-primary m-0">Recent Transactions</h3>
        <div className="flex items-center justify-center min-h-[200px] text-text-muted text-[0.85rem]">No transactions yet</div>
      </div>
    );
  }

  return (
    <div className="bg-surface-1 border border-border rounded-[14px] p-[22px] transition-shadow duration-300 hover:shadow-sm animate-fade-in min-w-0">
      <div className="flex items-center justify-between mb-[18px]">
        <h3 className="text-[0.95rem] font-bold text-text-primary m-0">Recent Transactions</h3>
        <button
          className="bg-transparent border-none text-accent text-[0.8rem] font-semibold cursor-pointer transition-opacity flex items-center gap-1 hover:opacity-75"
          onClick={() => dispatch({ type: 'SET_PAGE', payload: 'transactions' })}
        >
          View All <ArrowRight size={14} />
        </button>
      </div>
      <div className="flex flex-col gap-[2px]">
        {recent.map(txn => {
          const Icon = categoryIconMap[txn.category] || ShoppingBag;
          return (
            <div key={txn.id} className="flex items-center justify-between py-2.5 px-3 rounded-[10px] transition-colors duration-150 hover:bg-surface-2">
              <div className="flex items-center gap-3">
                <span className="w-[38px] h-[38px] rounded-[10px] bg-surface-2 flex items-center justify-center text-text-secondary shrink-0">
                  <Icon size={18} strokeWidth={1.8} />
                </span>
                <div className="flex flex-col">
                  <span className="text-[0.85rem] font-semibold text-text-primary">{txn.description}</span>
                  <span className="text-[0.73rem] text-text-muted">
                    {new Date(txn.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                    <span className="text-text-muted"> · {txn.category}</span>
                  </span>
                </div>
              </div>
              <span className={`text-[0.9rem] font-bold tabular-nums ${txn.type === 'income' ? 'text-[#10b981]' : 'text-red-500'}`}>
                {txn.type === 'income' ? '+' : '-'}{formatINRFull(txn.amount)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
