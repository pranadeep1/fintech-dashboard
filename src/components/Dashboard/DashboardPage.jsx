import SummaryCards from './SummaryCards';
import BalanceTrend from './BalanceTrend';
import SpendingBreakdown from './SpendingBreakdown';
import RecentTransactions from './RecentTransactions';

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <SummaryCards />
      <div className="grid grid-cols-1 xl:grid-cols-[1.5fr_1fr] gap-4">
        <BalanceTrend />
        <SpendingBreakdown />
      </div>
      <RecentTransactions />
    </div>
  );
}
