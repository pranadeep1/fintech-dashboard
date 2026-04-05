import { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { ToastProvider } from './components/Common/Toast';
import ErrorBoundary from './components/Common/ErrorBoundary';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import DashboardPage from './components/Dashboard/DashboardPage';
import TransactionsPage from './components/Transactions/TransactionsPage';
import InsightsPage from './components/Insights/InsightsPage';
import './App.css';

function AppContent() {
  const { state } = useApp();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pageTransition, setPageTransition] = useState(false);
  const [activePage, setActivePage] = useState(state.currentPage);

  // Smooth page transitions
  useEffect(() => {
    if (state.currentPage !== activePage) {
      setPageTransition(true);
      const timer = setTimeout(() => {
        setActivePage(state.currentPage);
        setPageTransition(false);
        setMobileMenuOpen(false);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [state.currentPage, activePage]);

  // Close mobile menu on escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const renderPage = () => {
    switch (activePage) {
      case 'transactions':
        return <TransactionsPage />;
      case 'insights':
        return <InsightsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="app-layout">
      <Sidebar
        collapsed={sidebarCollapsed}
        mobileOpen={mobileMenuOpen}
        onToggle={() => setSidebarCollapsed(c => !c)}
        onMobileClose={() => setMobileMenuOpen(false)}
      />
      {mobileMenuOpen && (
        <div
          className="mobile-overlay active"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}
      <main className={`main-content ${sidebarCollapsed ? 'expanded' : ''}`}>
        <Header onMobileMenuToggle={() => setMobileMenuOpen(o => !o)} />
        <div className={`page-content ${pageTransition ? 'page-exit' : 'page-enter'}`}>
          <ErrorBoundary>
            {renderPage()}
          </ErrorBoundary>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AppProvider>
  );
}

export default App;
