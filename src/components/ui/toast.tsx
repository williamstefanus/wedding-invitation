"use client";

import { createContext, useContext, useState, useCallback, useRef } from "react";
import { CheckCircle2, XCircle, AlertCircle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastContextValue {
  toast: (opts: { type: ToastType; title: string; message?: string }) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const ICONS: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-500" />,
  error: <XCircle className="w-5 h-5 flex-shrink-0 text-red-500" />,
  warning: <AlertCircle className="w-5 h-5 flex-shrink-0 text-amber-500" />,
  info: <Info className="w-5 h-5 flex-shrink-0 text-blue-500" />,
};

const STYLES: Record<ToastType, string> = {
  success: "border-emerald-100 bg-white",
  error: "border-red-100 bg-white",
  warning: "border-amber-100 bg-white",
  info: "border-blue-100 bg-white",
};

const TITLE_STYLES: Record<ToastType, string> = {
  success: "text-emerald-800",
  error: "text-red-800",
  warning: "text-amber-800",
  info: "text-blue-800",
};

const PROGRESS_STYLES: Record<ToastType, string> = {
  success: "bg-emerald-400",
  error: "bg-red-400",
  warning: "bg-amber-400",
  info: "bg-blue-400",
};

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  return (
    <div
      className={`
        relative flex items-start gap-3 w-full max-w-sm rounded-2xl border shadow-xl px-4 py-3.5
        animate-slide-in-right overflow-hidden
        ${STYLES[toast.type]}
      `}
      role="alert"
    >
      {/* Icon */}
      <div className="mt-0.5">{ICONS[toast.type]}</div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-bold leading-snug ${TITLE_STYLES[toast.type]}`}>
          {toast.title}
        </p>
        {toast.message && (
          <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{toast.message}</p>
        )}
      </div>

      {/* Dismiss */}
      <button
        onClick={() => onDismiss(toast.id)}
        className="flex-shrink-0 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition mt-0.5"
      >
        <X className="w-3.5 h-3.5" />
      </button>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-100">
        <div
          className={`h-full ${PROGRESS_STYLES[toast.type]} animate-progress-drain`}
        />
      </div>
    </div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timerRefs = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const dismiss = useCallback((id: string) => {
    clearTimeout(timerRefs.current[id]);
    delete timerRefs.current[id];
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const addToast = useCallback((type: ToastType, title: string, message?: string) => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev.slice(-4), { id, type, title, message }]); // max 5
    timerRefs.current[id] = setTimeout(() => dismiss(id), 4000);
  }, [dismiss]);

  const ctx: ToastContextValue = {
    toast: ({ type, title, message }) => addToast(type, title, message),
    success: (title, message) => addToast("success", title, message),
    error: (title, message) => addToast("error", title, message),
    warning: (title, message) => addToast("warning", title, message),
    info: (title, message) => addToast("info", title, message),
  };

  return (
    <ToastContext.Provider value={ctx}>
      {children}

      {/* Toast Container */}
      <div
        aria-live="polite"
        className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 items-end pointer-events-none"
      >
        {toasts.map(t => (
          <div key={t.id} className="pointer-events-auto">
            <ToastItem toast={t} onDismiss={dismiss} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}
