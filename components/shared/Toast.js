'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertTriangle, Info, X, Copy } from 'lucide-react';

const ToastContext = createContext(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
}

const icons = {
  success: CheckCircle,
  error: AlertTriangle,
  info: Info,
  copy: Copy,
};

const colors = {
  success: 'var(--low)',
  error: 'var(--critical)',
  info: 'var(--accent-cyan)',
  copy: 'var(--accent-purple)',
};

let toastId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = ++toastId;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toast = {
    success: (msg) => addToast(msg, 'success'),
    error: (msg) => addToast(msg, 'error'),
    info: (msg) => addToast(msg, 'info'),
    copy: (msg) => addToast(msg, 'copy', 2000),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="toast-container">
        <AnimatePresence>
          {toasts.map(t => {
            const Icon = icons[t.type] || Info;
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 80, scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="toast-item"
                style={{ '--toast-color': colors[t.type] }}
              >
                <Icon size={16} style={{ color: colors[t.type], flexShrink: 0 }} />
                <span className="toast-message">{t.message}</span>
                <button className="toast-close" onClick={() => removeToast(t.id)}>
                  <X size={14} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <style jsx>{`
        .toast-container {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 9999;
          display: flex;
          flex-direction: column-reverse;
          gap: 8px;
          pointer-events: none;
        }
        :global(.toast-item) {
          pointer-events: auto;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          background: rgba(10, 22, 40, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid var(--toast-color);
          border-radius: 8px;
          box-shadow: 0 0 20px rgba(0,0,0,0.4), 0 0 10px var(--toast-color);
          min-width: 280px;
          max-width: 420px;
        }
        .toast-message {
          color: var(--text-primary);
          font-size: 13px;
          line-height: 1.4;
          flex: 1;
        }
        .toast-close {
          color: var(--text-muted);
          cursor: pointer;
          flex-shrink: 0;
          transition: color 0.2s;
        }
        .toast-close:hover {
          color: var(--text-primary);
        }
      `}</style>
    </ToastContext.Provider>
  );
}
