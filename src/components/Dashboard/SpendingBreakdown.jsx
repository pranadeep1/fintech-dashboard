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
    <div className="chart-tooltip">
      <p className="tooltip-label">{data.name}</p>
      <p className="tooltip-value" style={{ color: data.payload.color }}>
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
      <div className="chart-card">
        <h3 className="chart-title">Spending Breakdown</h3>
        <div className="empty-chart">No expense data available</div>
      </div>
    );
  }

  return (
    <div className="chart-card animate-fade-in">
      <div className="chart-header">
        <h3 className="chart-title">Spending Breakdown</h3>
        <span className="chart-subtitle">By category</span>
      </div>
      <div className="breakdown-content">
        <div className="pie-wrapper">
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
          <div className="pie-center-label">
            <span className="pie-total">{formatINR(total)}</span>
            <span className="pie-total-label">Total</span>
          </div>
        </div>
        <div className="breakdown-legend">
          {breakdown.slice(0, 6).map(item => {
            const Icon = categoryIconMap[item.name] || ShoppingBag;
            return (
              <div key={item.name} className="legend-item">
                <div className="legend-left">
                  <span className="legend-dot" style={{ background: item.color }}></span>
                  <Icon size={14} strokeWidth={1.8} style={{ color: item.color }} />
                  <span className="legend-name">{item.name}</span>
                </div>
                <div className="legend-right">
                  <span className="legend-value">{formatINRFull(item.value)}</span>
                  <span className="legend-pct">{((item.value / total) * 100).toFixed(1)}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
