import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = {
    success: (msg, duration) => addToast(msg, 'success', duration),
    error: (msg, duration) => addToast(msg, 'error', duration || 5000),
    info: (msg, duration) => addToast(msg, 'info', duration),
    warning: (msg, duration) => addToast(msg, 'warning', duration)
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* Toast Notification Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-md w-full px-4 pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => {
            let bgClass = 'bg-navy-900 text-white border-gold-500/30';
            let Icon = Info;
            let iconColor = 'text-gold-500';

            if (t.type === 'success') {
              bgClass = 'bg-emerald-950/95 text-emerald-100 border-emerald-500/40';
              Icon = CheckCircle2;
              iconColor = 'text-emerald-400';
            } else if (t.type === 'error') {
              bgClass = 'bg-rose-950/95 text-rose-100 border-rose-500/40';
              Icon = AlertCircle;
              iconColor = 'text-rose-400';
            } else if (t.type === 'warning') {
              bgClass = 'bg-amber-950/95 text-amber-100 border-amber-500/40';
              Icon = AlertCircle;
              iconColor = 'text-amber-400';
            }

            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-2xl backdrop-blur-md ${bgClass}`}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconColor}`} />
                <div className="flex-1 text-sm font-medium leading-relaxed">
                  {t.message}
                </div>
                <button
                  onClick={() => removeToast(t.id)}
                  className="text-white/60 hover:text-white transition-colors p-1 -mr-1 -mt-1 rounded-lg"
                  aria-label="Close alert"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

