import { useMemo, useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { computeSummary, formatINR } from '../../data/mockData';
import { Wallet, TrendingUp, TrendingDown, Target, ArrowUpRight, ArrowDownRight } from 'lucide-react';

function AnimatedNumber({ value, formatter }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const duration = 800;
    const steps = 30;
    const increment = value / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(current + increment, value);
      setDisplay(current);
      if (step >= steps) {
        setDisplay(value);
        clearInterval(timer);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{formatter ? formatter(display) : display.toLocaleString('en-IN')}</span>;
}

export default function SummaryCards() {
  const { state } = useApp();
  const summary = useMemo(() => computeSummary(state.transactions), [state.transactions]);

  const cards = [
    {
      title: 'Total Balance',
      value: summary.balance,
      formatter: v => formatINR(v),
      Icon: Wallet,
      accent: 'indigo',
      change: '+12.5%',
      positive: true
    },
    {
      title: 'Total Income',
      value: summary.totalIncome,
      formatter: v => formatINR(v),
      Icon: TrendingUp,
      accent: 'emerald',
      change: '+8.2%',
      positive: true
    },
    {
      title: 'Total Expenses',
      value: summary.totalExpenses,
      formatter: v => formatINR(v),
      Icon: TrendingDown,
      accent: 'rose',
      change: '-3.1%',
      positive: false
    },
    {
      title: 'Savings Rate',
      value: summary.savingsRate,
      formatter: v => `${v.toFixed(1)}%`,
      Icon: Target,
      accent: 'amber',
      change: '+2.4%',
      positive: true
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <div key={card.title} className="p-[22px] rounded-[14px] bg-surface-1 border border-border relative overflow-hidden transition-all duration-300 ease-out hover:-translate-y-[3px] hover:shadow-md animate-fade-in" style={{ animationDelay: `${i * 0.08}s` }}>
          <div className="flex items-center justify-between mb-4">
            <div className={`w-10 h-10 rounded-[10px] flex items-center justify-center ${card.accent === 'indigo' ? 'bg-[#6366f11f] dark:bg-[#6366f114] text-[#6366f1]' : card.accent === 'emerald' ? 'bg-[#10b9811f] dark:bg-[#10b98114] text-[#10b981]' : card.accent === 'rose' ? 'bg-[#ef44441f] dark:bg-[#ef444414] text-[#ef4444]' : 'bg-[#eab3081f] dark:bg-[#eab30814] text-[#d97706]'}`}>
              <card.Icon size={20} strokeWidth={2} />
            </div>
            <span className={`text-[0.73rem] font-semibold py-[3px] px-2 rounded-md flex items-center gap-[2px] ${card.positive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
              {card.positive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
              {card.change}
            </span>
          </div>
          <div className="text-[1.75rem] max-sm:text-[1.4rem] font-extrabold text-text-primary tracking-[-0.5px] mb-1">
            <AnimatedNumber value={card.value} formatter={card.formatter} />
          </div>
          <div className="text-[0.8rem] text-text-muted font-medium">{card.title}</div>
        </div>
      ))}
    </div>
  );
}
