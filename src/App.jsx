import { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { ToastProvider } from './components/Common/Toast';
import ErrorBoundary from './components/Common/ErrorBoundary';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import DashboardPage from './components/Dashboard/DashboardPage';
import TransactionsPage from './components/Transactions/TransactionsPage';
import InsightsPage from './components/Insights/InsightsPage';

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
    <div className="flex h-[100dvh] w-full overflow-hidden bg-bg text-text-primary font-sans transition-colors duration-300">
      <Sidebar
        collapsed={sidebarCollapsed}
        mobileOpen={mobileMenuOpen}
        onToggle={() => setSidebarCollapsed(c => !c)}
        onMobileClose={() => setMobileMenuOpen(false)}
      />
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[90] backdrop-blur-[2px] pointer-events-auto transition-colors duration-300"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}
      <main className={`flex-1 min-w-0 h-[100dvh] overflow-y-auto overflow-x-hidden sleek-scroll flex flex-col transition-[margin] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${sidebarCollapsed ? 'md:ml-[68px]' : 'md:ml-[250px]'}`}>
        <Header onMobileMenuToggle={() => setMobileMenuOpen(o => !o)} />
        <div className={`flex-1 min-w-0 w-full overflow-x-hidden max-w-[1400px] mx-auto p-4 max-sm:p-3 md:py-6 md:px-7 transition-all duration-150 ease-out ${pageTransition ? 'opacity-0 translate-y-[6px]' : 'opacity-100 translate-y-0'}`}>
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
