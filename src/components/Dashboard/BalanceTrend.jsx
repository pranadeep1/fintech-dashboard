import { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { getMonthlyData, formatINRFull } from '../../data/mockData';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload) return null;
  return (
    <div className="chart-tooltip">
      <p className="tooltip-label">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="tooltip-value" style={{ color: entry.color }}>
          {entry.name}: {formatINRFull(entry.value)}
        </p>
      ))}
    </div>
  );
};

export default function BalanceTrend() {
  const { state } = useApp();
  const monthlyData = useMemo(() => getMonthlyData(state.transactions), [state.transactions]);

  if (monthlyData.length === 0) {
    return (
      <div className="chart-card">
        <h3 className="chart-title">Balance Trend</h3>
        <div className="empty-chart">No data available</div>
      </div>
    );
  }

  return (
    <div className="chart-card animate-fade-in">
      <div className="chart-header">
        <h3 className="chart-title">Balance Trend</h3>
        <span className="chart-subtitle">Last 6 months</span>
      </div>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="gradientIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradientExpenses" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradientBalance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
            <XAxis dataKey="label" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area type="monotone" dataKey="income" name="Income" stroke="#10b981" fill="url(#gradientIncome)" strokeWidth={2} dot={false} />
            <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#ef4444" fill="url(#gradientExpenses)" strokeWidth={2} dot={false} />
            <Area type="monotone" dataKey="balance" name="Balance" stroke="#6366f1" fill="url(#gradientBalance)" strokeWidth={2} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
