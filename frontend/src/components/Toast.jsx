import { useState, useCallback, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((type, message) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  }, []);

  const hideToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            className={`toast toast--${toast.type}`}
            initial={{ opacity: 0, x: 300, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={() => hideToast(toast.id)}
            role="alert"
            aria-live="polite"
          >
            <span className="toast-icon" aria-hidden="true">
              {toast.type === "success" && "✓"}
              {toast.type === "error" && "✕"}
              {toast.type === "warning" && "⚠"}
              {toast.type === "info" && "ℹ"}
            </span>
            <span className="toast-message">{toast.message}</span>
            <button className="toast-close" onClick={(e) => { e.stopPropagation(); hideToast(toast.id); }} aria-label="Dismiss">
              ×
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

// Convenience hooks
export function useSuccessToast() {
  const { showToast } = useToast();
  return (message) => showToast("success", message);
}

export function useErrorToast() {
  const { showToast } = useToast();
  return (message) => showToast("error", message);
}

export function useWarningToast() {
  const { showToast } = useToast();
  return (message) => showToast("warning", message);
}

export function useInfoToast() {
  const { showToast } = useToast();
  return (message) => showToast("info", message);
}