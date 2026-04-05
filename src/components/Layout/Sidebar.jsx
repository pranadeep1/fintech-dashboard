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
import './Sidebar.css';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions', Icon: ArrowLeftRight },
  { id: 'insights', label: 'Insights', Icon: Lightbulb },
];

export default function Sidebar({ collapsed, mobileOpen, onToggle, onMobileClose }) {
  const { state, dispatch } = useApp();

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
      <div className="sidebar-header">
        <div className="logo">
          {!collapsed && <span className="logo-text">Zorvyn</span>}
        </div>
        <button className="sidebar-toggle desktop-only" onClick={onToggle} aria-label="Toggle sidebar">
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
        <button className="sidebar-toggle mobile-only" onClick={onMobileClose} aria-label="Close menu">
          <X size={16} />
        </button>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(item => (
          <button
            key={item.id}
            className={`nav-item ${state.currentPage === item.id ? 'active' : ''}`}
            onClick={() => dispatch({ type: 'SET_PAGE', payload: item.id })}
            title={item.label}
          >
            <item.Icon size={20} strokeWidth={state.currentPage === item.id ? 2.2 : 1.8} />
            {!collapsed && <span className="nav-label">{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="role-selector">
          {!collapsed && <label className="role-label">Role</label>}
          <div className="role-toggle-group">
            <button
              className={`role-toggle-btn ${state.role === 'admin' ? 'active' : ''}`}
              onClick={() => dispatch({ type: 'SET_ROLE', payload: 'admin' })}
              title="Admin"
            >
              <Shield size={14} />
              {!collapsed && <span>Admin</span>}
            </button>
            <button
              className={`role-toggle-btn ${state.role === 'viewer' ? 'active' : ''}`}
              onClick={() => dispatch({ type: 'SET_ROLE', payload: 'viewer' })}
              title="Viewer"
            >
              <Eye size={14} />
              {!collapsed && <span>Viewer</span>}
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
