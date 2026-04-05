import { useState, useCallback, createContext, useContext } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext();

let toastId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success', duration = 3000) => {
    const id = ++toastId;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toast = {
    success: (msg) => addToast(msg, 'success'),
    error: (msg) => addToast(msg, 'error'),
    info: (msg) => addToast(msg, 'info'),
  };

  const iconMap = {
    success: <CheckCircle2 size={18} strokeWidth={2} />,
    error: <AlertCircle size={18} strokeWidth={2} />,
    info: <Info size={18} strokeWidth={2} />,
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed bottom-6 right-6 flex flex-col gap-2 z-[300] pointer-events-none max-sm:bottom-4 max-sm:right-4 max-sm:left-4" role="alert" aria-live="polite">
        {toasts.map(t => (
          <div key={t.id} className={`flex items-center gap-[10px] py-3 px-4 rounded-[10px] bg-surface-1 min-w-[280px] max-w-[400px] pointer-events-auto backdrop-blur-[12px] shadow-lg animate-fade-in max-sm:min-w-0 max-sm:max-w-none ${t.type === 'success' ? 'border-y border-r border-border border-l-[3px] border-l-[#10b981]' : t.type === 'error' ? 'border-y border-r border-border border-l-[3px] border-l-[#ef4444]' : 'border-y border-r border-border border-l-[3px] border-l-[#6366f1]'}`}>
            <span className={`shrink-0 flex items-center ${t.type === 'success' ? 'text-[#10b981]' : t.type === 'error' ? 'text-[#ef4444]' : 'text-[#6366f1]'}`}>{iconMap[t.type]}</span>
            <span className="flex-1 text-[0.83rem] font-medium text-text-primary leading-[1.4]">{t.message}</span>
            <button className="shrink-0 w-6 h-6 rounded-md border-none bg-transparent text-text-muted cursor-pointer flex items-center justify-center transition-all duration-150 hover:bg-surface-2 hover:text-text-primary" onClick={() => removeToast(t.id)}>
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
}
