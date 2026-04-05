import { createContext, useContext, useReducer, useEffect } from 'react';
import { initialTransactions } from '../data/mockData';

const AppContext = createContext();

const STORAGE_KEY = 'zorvyn_finance_state';

function loadPersistedState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        transactions: parsed.transactions || initialTransactions,
        theme: parsed.theme || 'dark',
        role: parsed.role || 'admin',
      };
    }
  } catch (e) { /* ignore */ }
  return null;
}

const defaultState = {
  transactions: initialTransactions,
  filters: {
    search: '',
    category: 'all',
    type: 'all',
    dateFrom: '',
    dateTo: '',
    sortBy: 'date',
    sortOrder: 'desc'
  },
  role: 'admin', // 'admin' or 'viewer'
  theme: 'dark',  // 'light' or 'dark'
  currentPage: 'dashboard',
  transactionModalOpen: false,
  editingTransaction: null,
};

function getInitialState() {
  const persisted = loadPersistedState();
  if (persisted) {
    return { ...defaultState, ...persisted };
  }
  return defaultState;
}

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_ROLE':
      return { ...state, role: action.payload };
    case 'TOGGLE_THEME':
      return { ...state, theme: state.theme === 'dark' ? 'light' : 'dark' };
    case 'SET_PAGE':
      return { ...state, currentPage: action.payload };
    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case 'RESET_FILTERS':
      return { ...state, filters: defaultState.filters };
    case 'ADD_TRANSACTION':
      return { ...state, transactions: [action.payload, ...state.transactions] };
    case 'EDIT_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map(t =>
          t.id === action.payload.id ? action.payload : t
        ),
      };
    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter(t => t.id !== action.payload),
      };
    case 'OPEN_TRANSACTION_MODAL':
      return { ...state, transactionModalOpen: true, editingTransaction: action.payload || null };
    case 'CLOSE_TRANSACTION_MODAL':
      return { ...state, transactionModalOpen: false, editingTransaction: null };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, undefined, getInitialState);

  // Persist state
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        transactions: state.transactions,
        theme: state.theme,
        role: state.role,
      }));
    } catch (e) { /* ignore */ }
  }, [state.transactions, state.theme, state.role]);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme);
  }, [state.theme]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
