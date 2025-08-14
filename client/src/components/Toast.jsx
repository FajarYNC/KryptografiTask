import React, { useEffect } from "react";

export function ToastStack({ toasts, onRemove }) {
  useEffect(() => {
    const timers = toasts.map((t) =>
      setTimeout(() => onRemove(t.id), t.ttl || 3500)
    );
    return () => timers.forEach(clearTimeout);
  }, [toasts, onRemove]);
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 w-72">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`rounded-lg border px-4 py-2 shadow text-sm flex items-start gap-2 backdrop-blur bg-[#0f1115]/80 ${
            t.type === "error"
              ? "border-red-500 text-red-300"
              : "border-accent text-accent-soft"
          }`}
        >
          <span className="mt-0.5 select-none">
            {t.type === "error" ? "⚠️" : "✅"}
          </span>
          <div className="flex-1 leading-snug">{t.message}</div>
          <button
            onClick={() => onRemove(t.id)}
            className="text-xs opacity-60 hover:opacity-100"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
