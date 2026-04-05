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
    <div className="bg-surface-1 border border-border rounded-[10px] py-2.5 px-3.5 shadow-md">
      <p className="text-[0.75rem] font-semibold text-text-primary m-0 mb-1">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-[0.8rem] font-semibold my-[2px]" style={{ color: entry.color }}>
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
      <div className="flex flex-col gap-5">
        <div className="flex flex-col items-center justify-center py-14 px-5 bg-surface-1 border border-border rounded-[14px] text-center">
          <PackageOpen size={48} strokeWidth={1.2} className="text-text-muted mb-4" />
          <h3 className="text-text-primary m-0 mb-1.5 text-[1rem]">No data for insights</h3>
          <p className="text-text-muted m-0 text-[0.85rem]">Add some transactions to see spending insights</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 animate-fade-in">
      {/* Insight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-[14px]">
        <div className="bg-surface-1 border border-indigo-500/30 rounded-[14px] p-5 transition-all duration-250 ease-out hover:-translate-y-[2px] hover:shadow-sm">
          <div className="flex items-center justify-between mb-[14px]">
            <div className="w-9 h-9 rounded-[10px] flex items-center justify-center bg-red-500/10 text-red-500">
              <Flame size={18} strokeWidth={2} />
            </div>
            <span className="text-[0.65rem] font-bold uppercase tracking-[0.8px] py-[3px] px-2 rounded-md bg-surface-2 text-text-muted">Top Category</span>
          </div>
          <h3 className="text-[1.2rem] font-bold text-text-primary m-0 mb-1 tracking-[-0.2px]">{insights.highestCategory.name}</h3>
          <p className="text-[0.75rem] text-text-muted m-0">{formatINRFull(insights.highestCategory.value)} total spent</p>
        </div>

        <div className="bg-surface-1 border border-border rounded-[14px] p-5 transition-all duration-250 ease-out hover:-translate-y-[2px] hover:shadow-sm">
          <div className="flex items-center justify-between mb-[14px]">
            <div className="w-9 h-9 rounded-[10px] flex items-center justify-center bg-blue-500/10 text-blue-500">
              <CalendarDays size={18} strokeWidth={2} />
            </div>
            <span className="text-[0.65rem] font-bold uppercase tracking-[0.8px] py-[3px] px-2 rounded-md bg-surface-2 text-text-muted">Daily Average</span>
          </div>
          <h3 className="text-[1.2rem] font-bold text-text-primary m-0 mb-1 tracking-[-0.2px]">{formatINRFull(insights.avgDailySpending)}</h3>
          <p className="text-[0.75rem] text-text-muted m-0">Average daily spending</p>
        </div>

        {insights.monthChange && (
          <div className="bg-surface-1 border border-border rounded-[14px] p-5 transition-all duration-250 ease-out hover:-translate-y-[2px] hover:shadow-sm">
            <div className="flex items-center justify-between mb-[14px]">
              <div className={`w-9 h-9 rounded-[10px] flex items-center justify-center ${insights.monthChange.increased ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                {insights.monthChange.increased ? <TrendingUp size={18} strokeWidth={2} /> : <TrendingDown size={18} strokeWidth={2} />}
              </div>
              <span className={`text-[0.65rem] font-bold uppercase tracking-[0.8px] py-[3px] px-2 rounded-md ${insights.monthChange.increased ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                {insights.monthChange.increased ? 'Increased' : 'Decreased'}
              </span>
            </div>
            <h3 className={`text-[1.2rem] font-bold m-0 mb-1 tracking-[-0.2px] ${insights.monthChange.increased ? 'text-red-500' : 'text-emerald-500'}`}>
              {insights.monthChange.pct >= 0 ? '+' : ''}{insights.monthChange.pct.toFixed(1)}%
            </h3>
            <p className="text-[0.75rem] text-text-muted m-0">Month-over-month expenses</p>
          </div>
        )}

        <div className="bg-surface-1 border border-border rounded-[14px] p-5 transition-all duration-250 ease-out hover:-translate-y-[2px] hover:shadow-sm">
          <div className="flex items-center justify-between mb-[14px]">
            <div className={`w-9 h-9 rounded-[10px] flex items-center justify-center ${insights.currentMonth && insights.currentMonth.income > insights.currentMonth.expenses ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
              {insights.currentMonth && insights.currentMonth.income > insights.currentMonth.expenses
                ? <CheckCircle2 size={18} strokeWidth={2} />
                : <AlertTriangle size={18} strokeWidth={2} />}
            </div>
            <span className="text-[0.65rem] font-bold uppercase tracking-[0.8px] py-[3px] px-2 rounded-md bg-surface-2 text-text-muted">Observation</span>
          </div>
          <h3 className="text-[0.95rem] font-semibold text-text-primary m-0 mb-1 leading-[1.4]">
            {insights.currentMonth && insights.currentMonth.income > insights.currentMonth.expenses
              ? 'You\'re saving money this month!'
              : 'Spending exceeds income this month'}
          </h3>
          <p className="text-[0.75rem] text-text-muted m-0">
            {insights.currentMonth
              ? `Income: ${formatINR(insights.currentMonth.income)} · Expenses: ${formatINR(insights.currentMonth.expenses)}`
              : 'No data for this month'}
          </p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-surface-1 border border-border rounded-[14px] p-[22px] transition-shadow duration-300 hover:shadow-sm min-w-0">
          <div className="flex items-center justify-between mb-[18px]">
            <h3 className="text-[0.95rem] font-bold text-text-primary m-0">Monthly Comparison</h3>
            <span className="text-[0.75rem] text-text-muted font-medium">Income vs Expenses</span>
          </div>
          <div className="w-full min-w-0 overflow-hidden">
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
        </div>

        <div className="bg-surface-1 border border-border rounded-[14px] p-[22px] transition-shadow duration-300 hover:shadow-sm min-w-0">
          <div className="flex items-center justify-between mb-[18px]">
            <h3 className="text-[0.95rem] font-bold text-text-primary m-0">Spending Radar</h3>
            <span className="text-[0.75rem] text-text-muted font-medium">Category distribution</span>
          </div>
          <div className="w-full min-w-0 overflow-hidden">
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
      </div>

      {/* Top Transactions */}
      <div className="bg-surface-1 border border-border rounded-[14px] p-[22px] transition-shadow duration-300 hover:shadow-sm min-w-0">
        <div className="flex items-center justify-between mb-[18px]">
          <h3 className="text-[0.95rem] font-bold text-text-primary m-0">Top 5 Transactions</h3>
          <span className="text-[0.75rem] text-text-muted font-medium">Largest by amount</span>
        </div>
        <div className="flex flex-col gap-[2px]">
          {insights.topTransactions.map((txn, i) => {
            const Icon = categoryIconMap[txn.category] || ShoppingBag;
            return (
              <div key={txn.id} className="flex items-center gap-[14px] py-2.5 px-3 rounded-[10px] transition-colors duration-150 hover:bg-surface-2">
                <div className="text-[0.8rem] font-extrabold text-text-muted min-w-[24px]">#{i + 1}</div>
                <div className="flex items-center gap-[10px] flex-1">
                  <span className="w-9 h-9 rounded-[10px] bg-surface-2 flex items-center justify-center text-text-secondary shrink-0">
                    <Icon size={16} strokeWidth={1.8} />
                  </span>
                  <div>
                    <span className="block text-[0.85rem] font-semibold text-text-primary">{txn.description}</span>
                    <span className="block text-[0.73rem] text-text-muted">{txn.category}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`block text-[0.9rem] font-bold tabular-nums ${txn.type === 'income' ? 'text-emerald-500' : 'text-red-500'}`}>
                    {txn.type === 'income' ? '+' : '-'}{formatINRFull(txn.amount)}
                  </span>
                  <span className="block text-[0.7rem] text-text-muted">{new Date(txn.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-surface-1 border border-border rounded-[14px] p-[22px] transition-shadow duration-300 hover:shadow-sm min-w-0">
        <div className="flex items-center justify-between mb-[18px]">
          <h3 className="text-[0.95rem] font-bold text-text-primary m-0">Category Breakdown</h3>
          <span className="text-[0.75rem] text-text-muted font-medium">Detailed spending by category</span>
        </div>
        <div className="flex flex-col gap-2.5">
          {insights.categoryBreakdown.map(cat => {
            const maxValue = insights.categoryBreakdown[0]?.value || 1;
            const pct = (cat.value / maxValue) * 100;
            const Icon = categoryIconMap[cat.name] || ShoppingBag;
            return (
              <div key={cat.name} className="flex items-center gap-[14px]">
                <div className="flex items-center gap-2 min-w-[100px] sm:min-w-[155px] text-[0.75rem] sm:text-[0.8rem] font-medium text-text-secondary">
                  <Icon size={14} strokeWidth={1.8} style={{ color: categoryColors[cat.name] }} />
                  <span>{cat.name}</span>
                </div>
                <div className="flex-1 h-2 bg-surface-2 rounded-md overflow-hidden">
                  <div
                    className="h-full rounded-md transition-all duration-[800ms] ease-out"
                    style={{
                      width: `${pct}%`,
                      background: categoryColors[cat.name]
                    }}
                  />
                </div>
                <span className="text-[0.8rem] font-bold text-text-primary min-w-[85px] text-right tabular-nums">{formatINRFull(cat.value)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
