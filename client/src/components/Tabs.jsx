import React from "react";

export function Tabs({ tabs, active, onChange }) {
  return (
    <div className="flex gap-2 flex-wrap mb-4">
      {tabs.map((t) => (
        <button
          key={t}
          onClick={() => onChange(t)}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide border transition-colors ${
            active === t
              ? "bg-accent text-white border-accent"
              : "border-gray-700 text-gray-400 hover:text-gray-200"
          }`}
        >
          {t}
        </button>
      ))}
    </div>
  );
}
