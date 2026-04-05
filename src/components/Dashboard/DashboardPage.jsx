import SummaryCards from './SummaryCards';
import BalanceTrend from './BalanceTrend';
import SpendingBreakdown from './SpendingBreakdown';
import RecentTransactions from './RecentTransactions';
import './Dashboard.css';

export default function DashboardPage() {
  return (
    <div className="dashboard-page">
      <SummaryCards />
      <div className="dashboard-charts">
        <BalanceTrend />
        <SpendingBreakdown />
      </div>
      <RecentTransactions />
    </div>
  );
}
