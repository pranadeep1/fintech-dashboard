import { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { getInsights, formatINR, formatINRFull, categoryColors } from '../../data/mockData';
import {
  Flame, CalendarDays, TrendingUp, TrendingDown, CheckCircle2, AlertTriangle,
  UtensilsCrossed, Car, ShoppingBag, Clapperboard, Zap, HeartPulse, GraduationCap,
  Banknote, Code2, LineChart, RotateCcw, PackageOpen
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import './Insights.css';

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

export default function InsightsPage() {
  const { state } = useApp();
  const insights = useMemo(() => getInsights(state.transactions), [state.transactions]);

  const radarData = useMemo(() => {
    return insights.categoryBreakdown.slice(0, 7).map(c => ({
      category: c.name.split(' ')[0],
      amount: c.value,
      fullName: c.name
    }));
  }, [insights.categoryBreakdown]);

  if (state.transactions.length === 0) {
    return (
      <div className="insights-page">
        <div className="empty-state">
          <PackageOpen size={48} strokeWidth={1.2} className="empty-state-icon" />
          <h3>No data for insights</h3>
          <p>Add some transactions to see spending insights</p>
        </div>
      </div>
    );
  }

  return (
    <div className="insights-page animate-fade-in">
      {/* Insight Cards */}
      <div className="insight-cards-grid">
        <div className="insight-card highlight">
          <div className="insight-card-header">
            <div className="insight-icon-wrap accent-rose">
              <Flame size={18} strokeWidth={2} />
            </div>
            <span className="insight-badge">Top Category</span>
          </div>
          <h3 className="insight-value">{insights.highestCategory.name}</h3>
          <p className="insight-detail">{formatINRFull(insights.highestCategory.value)} total spent</p>
        </div>

        <div className="insight-card">
          <div className="insight-card-header">
            <div className="insight-icon-wrap accent-blue">
              <CalendarDays size={18} strokeWidth={2} />
            </div>
            <span className="insight-badge">Daily Average</span>
          </div>
          <h3 className="insight-value">{formatINRFull(insights.avgDailySpending)}</h3>
          <p className="insight-detail">Average daily spending</p>
        </div>

        {insights.monthChange && (
          <div className="insight-card">
            <div className="insight-card-header">
              <div className={`insight-icon-wrap ${insights.monthChange.increased ? 'accent-rose' : 'accent-emerald'}`}>
                {insights.monthChange.increased ? <TrendingUp size={18} strokeWidth={2} /> : <TrendingDown size={18} strokeWidth={2} />}
              </div>
              <span className={`insight-badge ${insights.monthChange.increased ? 'negative' : 'positive'}`}>
                {insights.monthChange.increased ? 'Increased' : 'Decreased'}
              </span>
            </div>
            <h3 className={`insight-value ${insights.monthChange.increased ? 'text-red' : 'text-green'}`}>
              {insights.monthChange.pct >= 0 ? '+' : ''}{insights.monthChange.pct.toFixed(1)}%
            </h3>
            <p className="insight-detail">Month-over-month expenses</p>
          </div>
        )}

        <div className="insight-card">
          <div className="insight-card-header">
            <div className={`insight-icon-wrap ${insights.currentMonth && insights.currentMonth.income > insights.currentMonth.expenses ? 'accent-emerald' : 'accent-amber'}`}>
              {insights.currentMonth && insights.currentMonth.income > insights.currentMonth.expenses
                ? <CheckCircle2 size={18} strokeWidth={2} />
                : <AlertTriangle size={18} strokeWidth={2} />}
            </div>
            <span className="insight-badge">Observation</span>
          </div>
          <h3 className="insight-value-sm">
            {insights.currentMonth && insights.currentMonth.income > insights.currentMonth.expenses
              ? 'You\'re saving money this month!'
              : 'Spending exceeds income this month'}
          </h3>
          <p className="insight-detail">
            {insights.currentMonth
              ? `Income: ${formatINR(insights.currentMonth.income)} · Expenses: ${formatINR(insights.currentMonth.expenses)}`
              : 'No data for this month'}
          </p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="insights-charts">
        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Monthly Comparison</h3>
            <span className="chart-subtitle">Income vs Expenses</span>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={insights.monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
              <XAxis dataKey="label" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="income" name="Income" fill="#10b981" radius={[5, 5, 0, 0]} />
              <Bar dataKey="expenses" name="Expenses" fill="#ef4444" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Spending Radar</h3>
            <span className="chart-subtitle">Category distribution</span>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="var(--chart-grid)" />
              <PolarAngleAxis dataKey="category" stroke="var(--text-muted)" fontSize={11} />
              <PolarRadiusAxis stroke="var(--chart-grid)" fontSize={10} />
              <Radar
                name="Spending"
                dataKey="amount"
                stroke="#6366f1"
                fill="#6366f1"
                fillOpacity={0.2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Transactions */}
      <div className="chart-card">
        <div className="chart-header">
          <h3 className="chart-title">Top 5 Transactions</h3>
          <span className="chart-subtitle">Largest by amount</span>
        </div>
        <div className="top-transactions">
          {insights.topTransactions.map((txn, i) => {
            const Icon = categoryIconMap[txn.category] || ShoppingBag;
            return (
              <div key={txn.id} className="top-txn-item">
                <div className="top-txn-rank">#{i + 1}</div>
                <div className="top-txn-info">
                  <span className="top-txn-icon">
                    <Icon size={16} strokeWidth={1.8} />
                  </span>
                  <div>
                    <span className="top-txn-desc">{txn.description}</span>
                    <span className="top-txn-cat">{txn.category}</span>
                  </div>
                </div>
                <div className="top-txn-right">
                  <span className={`top-txn-amount ${txn.type}`}>
                    {txn.type === 'income' ? '+' : '-'}{formatINRFull(txn.amount)}
                  </span>
                  <span className="top-txn-date">{new Date(txn.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="chart-card">
        <div className="chart-header">
          <h3 className="chart-title">Category Breakdown</h3>
          <span className="chart-subtitle">Detailed spending by category</span>
        </div>
        <div className="category-bars">
          {insights.categoryBreakdown.map(cat => {
            const maxValue = insights.categoryBreakdown[0]?.value || 1;
            const pct = (cat.value / maxValue) * 100;
            const Icon = categoryIconMap[cat.name] || ShoppingBag;
            return (
              <div key={cat.name} className="cat-bar-row">
                <div className="cat-bar-label">
                  <Icon size={14} strokeWidth={1.8} style={{ color: categoryColors[cat.name] }} />
                  <span>{cat.name}</span>
                </div>
                <div className="cat-bar-track">
                  <div
                    className="cat-bar-fill"
                    style={{
                      width: `${pct}%`,
                      background: categoryColors[cat.name]
                    }}
                  />
                </div>
                <span className="cat-bar-value">{formatINRFull(cat.value)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
