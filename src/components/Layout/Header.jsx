import { useApp } from '../../context/AppContext';
import { Sun, Moon, Shield, Eye, Bell } from 'lucide-react';
import './Header.css';

const pageTitles = {
  dashboard: 'Dashboard',
  transactions: 'Transactions',
  insights: 'Insights'
};

const pageDescriptions = {
  dashboard: 'Your financial overview at a glance',
  transactions: 'Track and manage all your transactions',
  insights: 'Understand your spending patterns'
};

export default function Header({ onMobileMenuToggle }) {
  const { state, dispatch } = useApp();

  return (
    <header className="header">
      <div className="header-left">
        <button className="mobile-menu-btn" onClick={onMobileMenuToggle} aria-label="Menu">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
        </button>
        <div className="header-title-group">
          <h1 className="header-title">{pageTitles[state.currentPage]}</h1>
          <p className="header-description">{pageDescriptions[state.currentPage]}</p>
        </div>
      </div>
      <div className="header-right">
        <button className="header-icon-btn" title="Notifications">
          <Bell size={18} strokeWidth={1.8} />
          <span className="notification-dot"></span>
        </button>

        <button
          className="theme-toggle-btn"
          onClick={() => dispatch({ type: 'TOGGLE_THEME' })}
          title={`Switch to ${state.theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {state.theme === 'dark' ? <Sun size={18} strokeWidth={1.8} /> : <Moon size={18} strokeWidth={1.8} />}
        </button>

        <div className={`role-badge ${state.role}`}>
          {state.role === 'admin' ? <Shield size={13} strokeWidth={2} /> : <Eye size={13} strokeWidth={2} />}
          <span>{state.role === 'admin' ? 'Admin' : 'Viewer'}</span>
        </div>

        <div className="user-avatar">
          <span>PR</span>
        </div>
      </div>
    </header>
  );
}
