import { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { getCategoryBreakdown, formatINRFull, formatINR } from '../../data/mockData';
import {
  UtensilsCrossed, Car, ShoppingBag, Clapperboard, Zap, HeartPulse, GraduationCap,
  Banknote, Code2, LineChart, RotateCcw
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

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

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const data = payload[0];
  return (
    <div className="bg-surface-1 border border-border rounded-[10px] py-2.5 px-3.5 shadow-md">
      <p className="text-[0.75rem] font-semibold text-text-primary m-0 mb-1">{data.name}</p>
      <p className="text-[0.8rem] font-semibold my-[2px]" style={{ color: data.payload.color }}>
        {formatINRFull(data.value)}
      </p>
    </div>
  );
};

export default function SpendingBreakdown() {
  const { state } = useApp();
  const breakdown = useMemo(() => getCategoryBreakdown(state.transactions), [state.transactions]);
  const total = useMemo(() => breakdown.reduce((s, b) => s + b.value, 0), [breakdown]);

  if (breakdown.length === 0) {
    return (
      <div className="bg-surface-1 border border-border rounded-[14px] p-[22px]">
        <h3 className="text-[0.95rem] font-bold text-text-primary m-0">Spending Breakdown</h3>
        <div className="flex items-center justify-center min-h-[200px] text-text-muted text-[0.85rem]">No expense data available</div>
      </div>
    );
  }

  return (
    <div className="bg-surface-1 border border-border rounded-[14px] p-[22px] transition-shadow duration-300 hover:shadow-sm animate-fade-in min-w-0">
      <div className="flex items-center justify-between mb-[18px]">
        <h3 className="text-[0.95rem] font-bold text-text-primary m-0">Spending Breakdown</h3>
        <span className="text-[0.75rem] text-text-muted font-medium">By category</span>
      </div>
      <div className="flex flex-col gap-3.5">
        <div className="relative flex justify-center w-full min-w-0 overflow-hidden">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={breakdown}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={88}
                paddingAngle={3}
                dataKey="value"
                animationBegin={0}
                animationDuration={1000}
              >
                {breakdown.map((entry, i) => (
                  <Cell key={i} fill={entry.color} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
            <span className="block text-[1.15rem] font-extrabold text-text-primary tracking-[-0.3px]">{formatINR(total)}</span>
            <span className="text-[0.7rem] text-text-muted font-medium">Total</span>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          {breakdown.slice(0, 6).map(item => {
            const Icon = categoryIconMap[item.name] || ShoppingBag;
            return (
              <div key={item.name} className="flex items-center justify-between py-[7px] px-2.5 rounded-lg transition-colors duration-150 hover:bg-surface-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: item.color }}></span>
                  <Icon size={14} strokeWidth={1.8} style={{ color: item.color }} />
                  <span className="text-[0.8rem] text-text-secondary font-medium">{item.name}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="text-[0.8rem] font-bold text-text-primary">{formatINRFull(item.value)}</span>
                  <span className="text-[0.7rem] text-text-muted w-[38px] text-right">{((item.value / total) * 100).toFixed(1)}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
