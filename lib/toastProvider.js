import { createContext, useContext, useRef, useState, useCallback } from "react";
import { ToastContainer } from "../components/ToastContainer";

/**
 * Toast context for managing app-wide notifications.
 * Provides toast visibility and dismiss functionality.
 */
const ToastContext = createContext(null);

/**
 * Provider component that manages toast state and renders ToastContainer.
 * Wrap your app with this to enable toasts.
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const toastRef = useRef({
    addToast: (toast) => {
      setToasts((prev) => [...prev, toast].slice(-3));
    },
    removeToast: (id) => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    },
  });

  const handleDismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={toastRef}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={handleDismiss} />
    </ToastContext.Provider>
  );
}

/**
 * Hook to show toasts from any component.
 * Usage:
 *   const toast = useToast();
 *   toast.success("Saved!", "Your counter was saved successfully");
 *   toast.error("Error", "Something went wrong");
 *   toast.info("Info", "This is an informational message");
 */
export function useToast() {
  const toastRef = useContext(ToastContext);
  if (!toastRef) {
    throw new Error("useToast must be used within ToastProvider");
  }

  const show = useCallback(
    (type, title, message = "", duration = 2200) => {
      if (!toastRef.current?.addToast) return;
      
      const id = Date.now() + Math.random();
      toastRef.current.addToast({
        id,
        type,
        title,
        message,
        duration,
      });
      return id;
    },
    [toastRef]
  );

  return {
    success: (title, message, duration) =>
      show("success", title, message, duration),
    error: (title, message, duration) =>
      show("error", title, message, duration),
    info: (title, message, duration) =>
      show("info", title, message, duration),
    show,
  };
}
