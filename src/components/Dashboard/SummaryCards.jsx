import { useMemo, useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { computeSummary, formatINR } from '../../data/mockData';
import { Wallet, TrendingUp, TrendingDown, Target, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import './Dashboard.css';

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
    <div className="summary-cards">
      {cards.map((card, i) => (
        <div key={card.title} className={`summary-card accent-${card.accent}`} style={{ animationDelay: `${i * 0.08}s` }}>
          <div className="card-header">
            <div className={`card-icon-wrap accent-${card.accent}`}>
              <card.Icon size={20} strokeWidth={2} />
            </div>
            <span className={`card-change ${card.positive ? 'positive' : 'negative'}`}>
              {card.positive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
              {card.change}
            </span>
          </div>
          <div className="card-value">
            <AnimatedNumber value={card.value} formatter={card.formatter} />
          </div>
          <div className="card-title">{card.title}</div>
        </div>
      ))}
    </div>
  );
}
