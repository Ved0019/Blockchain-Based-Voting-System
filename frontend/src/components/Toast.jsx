import { AnimatePresence, motion } from "framer-motion";
import { createContext, useCallback, useContext, useState } from "react";

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
      <div className="toast-container" aria-live="polite" aria-atomic="true">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              className={`toast toast--${toast.type}`}
              initial={{ opacity: 0, x: 80, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 80, scale: 0.95, transition: { duration: 0.2 } }}
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
              onClick={() => hideToast(toast.id)}
              role="alert"
            >
              <span className="toast-icon" aria-hidden="true">
                {toast.type === "success" && "✓"}
                {toast.type === "error" && "✕"}
                {toast.type === "warning" && "⚠"}
                {toast.type === "info" && "ℹ"}
              </span>
              <span className="toast-message">{toast.message}</span>
              <button
                className="toast-close"
                onClick={(e) => {
                  e.stopPropagation();
                  hideToast(toast.id);
                }}
                aria-label="Dismiss"
              >
                ×
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
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
  return useCallback((message) => showToast("success", message), [showToast]);
}

export function useErrorToast() {
  const { showToast } = useToast();
  return useCallback((message) => showToast("error", message), [showToast]);
}

export function useWarningToast() {
  const { showToast } = useToast();
  return useCallback((message) => showToast("warning", message), [showToast]);
}

export function useInfoToast() {
  const { showToast } = useToast();
  return useCallback((message) => showToast("info", message), [showToast]);
}
