import { useApp } from '../../context/AppContext';
import { Sun, Moon, Shield, Eye, Bell } from 'lucide-react';

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
    <header className="flex items-center justify-between py-3.5 px-4 md:px-7 max-sm:px-3 bg-surface-1 border-b border-border sticky top-0 z-50 min-h-[65px]">
      <div className="flex items-center gap-2 max-sm:gap-2 md:gap-4">
        <button className="md:hidden bg-surface-2 border border-border text-text-primary w-9 h-9 rounded-[10px] cursor-pointer flex items-center justify-center shrink-0" onClick={onMobileMenuToggle} aria-label="Menu">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
        </button>
        <div className="flex flex-col">
          <h1 className="text-[1.15rem] md:text-[1.35rem] font-bold text-text-primary m-0 tracking-[-0.3px]">{pageTitles[state.currentPage]}</h1>
          <p className="hidden md:block text-[0.8rem] text-text-muted m-0 mt-[2px]">{pageDescriptions[state.currentPage]}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button className="relative flex items-center justify-center w-[38px] h-[38px] rounded-[10px] border border-border bg-surface-2 text-text-secondary cursor-pointer transition-colors duration-200 hover:bg-surface-3 hover:text-text-primary" title="Notifications">
          <Bell size={18} strokeWidth={1.8} />
          <span className="absolute top-2 right-2.5 w-[7px] h-[7px] rounded-full bg-[#ef4444] border-[1.5px] border-surface-2"></span>
        </button>

        <button
          className="flex items-center justify-center w-[38px] h-[38px] rounded-[10px] border border-border bg-surface-2 text-text-secondary cursor-pointer transition-colors duration-200 hover:bg-surface-3 hover:text-accent hover:border-accent"
          onClick={() => dispatch({ type: 'TOGGLE_THEME' })}
          title={`Switch to ${state.theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {state.theme === 'dark' ? <Sun size={18} strokeWidth={1.8} /> : <Moon size={18} strokeWidth={1.8} />}
        </button>

        <div className={`flex items-center gap-1.5 px-2 py-1.5 md:px-3 rounded-lg text-[0.75rem] font-semibold capitalize tracking-[0.2px] ml-1 max-sm:hidden ${state.role === 'admin' ? 'bg-accent-bg text-accent' : 'bg-[#22c55e1f] text-[#22c55e] dark:bg-[#16a34a1a] dark:text-[#16a34a]'}`}>
          {state.role === 'admin' ? <Shield size={13} strokeWidth={2} /> : <Eye size={13} strokeWidth={2} />}
          <span className="hidden md:inline">{state.role === 'admin' ? 'Admin' : 'Viewer'}</span>
        </div>

        <div className="w-[38px] h-[38px] rounded-[10px] bg-gradient-to-br from-accent to-[#8b5cf6] flex items-center justify-center text-white font-bold text-[0.8rem] tracking-[0.5px] ml-1 shrink-0">
          <span>PR</span>
        </div>
      </div>
    </header>
  );
}
