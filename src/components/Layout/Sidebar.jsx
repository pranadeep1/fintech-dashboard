import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  ArrowLeftRight,
  Lightbulb,
  ChevronLeft,
  ChevronRight,
  Shield,
  Eye,
  X
} from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions', Icon: ArrowLeftRight },
  { id: 'insights', label: 'Insights', Icon: Lightbulb },
];

export default function Sidebar({ collapsed, mobileOpen, onToggle, onMobileClose }) {
  const { state, dispatch } = useApp();

  return (
    <aside className={`fixed top-0 bottom-0 left-0 z-[100] flex flex-col bg-surface-1 border-r border-border transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${collapsed ? 'w-[68px]' : 'w-[250px]'} ${mobileOpen ? 'max-md:translate-x-0 max-md:shadow-[4px_0_30px_rgba(0,0,0,0.25)]' : 'max-md:-translate-x-full max-md:w-[280px]'}`}>
      <div className={`flex items-center justify-between p-5 py-5 border-b border-border min-h-[65px] ${collapsed ? 'max-md:p-5 md:py-5 md:px-[8px] md:justify-center' : 'md:px-4'}`}>
        <div className="flex items-center gap-2.5">
          {(!collapsed || mobileOpen) && (
            <span className="text-xl font-extrabold bg-gradient-to-br from-accent to-[#8b5cf6] bg-clip-text text-transparent tracking-tight">Zorvyn</span>
          )}
        </div>
        <button className="hidden md:flex bg-surface-2 border border-border text-text-muted w-7 h-7 rounded-lg cursor-pointer items-center justify-center transition-colors duration-200 hover:bg-surface-3 hover:text-text-primary shrink-0" onClick={onToggle} aria-label="Toggle sidebar">
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
        <button className="md:hidden bg-surface-2 border border-border text-text-muted w-7 h-7 rounded-lg cursor-pointer flex items-center justify-center shrink-0" onClick={onMobileClose} aria-label="Close menu">
          <X size={16} />
        </button>
      </div>

      <nav className="flex-1 py-4 px-2.5 flex flex-col gap-0.5">
        {navItems.map(item => {
          const isActive = state.currentPage === item.id;
          return (
            <button
              key={item.id}
              className={`flex items-center w-full rounded-xl border-none outline-none cursor-pointer text-[14px] transition-colors duration-200 text-left font-sans gap-3 ${collapsed ? 'md:justify-center md:px-[11px] md:py-[11px] max-md:px-3.5 max-md:py-[14px]' : 'px-3.5 py-[11px]'} ${isActive ? 'bg-accent-bg text-accent font-semibold' : 'bg-transparent text-text-muted hover:bg-surface-2 hover:text-text-primary font-medium'}`}
              onClick={() => dispatch({ type: 'SET_PAGE', payload: item.id })}
              title={item.label}
            >
              <item.Icon size={20} strokeWidth={isActive ? 2.2 : 1.8} className="shrink-0" />
              {(!collapsed || mobileOpen) && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      <div className="py-4 px-2.5 border-t border-border">
        <div className="flex flex-col gap-2">
          {(!collapsed || mobileOpen) && <label className="text-[10.5px] font-bold uppercase tracking-[1.2px] text-text-muted pl-1">Role</label>}
          <div className="flex gap-1 bg-surface-2 rounded-[10px] p-[3px]">
            <button
              className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg border-none cursor-pointer text-[12.5px] font-sans transition-all duration-200 ${collapsed ? 'md:px-1.5 md:py-[7px] max-md:px-2 max-md:py-[7px]' : 'px-2 py-[7px]'} ${state.role === 'admin' ? 'bg-surface-1 text-accent font-semibold shadow-sm' : 'bg-transparent text-text-muted hover:text-text-secondary font-semibold'}`}
              onClick={() => dispatch({ type: 'SET_ROLE', payload: 'admin' })}
              title="Admin"
            >
              <Shield size={14} />
              {(!collapsed || mobileOpen) && <span>Admin</span>}
            </button>
            <button
              className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg border-none cursor-pointer text-[12.5px] font-sans transition-all duration-200 ${collapsed ? 'md:px-1.5 md:py-[7px] max-md:px-2 max-md:py-[7px]' : 'px-2 py-[7px]'} ${state.role === 'viewer' ? 'bg-surface-1 text-accent font-semibold shadow-sm' : 'bg-transparent text-text-muted hover:text-text-secondary font-semibold'}`}
              onClick={() => dispatch({ type: 'SET_ROLE', payload: 'viewer' })}
              title="Viewer"
            >
              <Eye size={14} />
              {(!collapsed || mobileOpen) && <span>Viewer</span>}
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
