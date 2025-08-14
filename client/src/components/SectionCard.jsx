import React from "react";

export default function SectionCard({ title, description, children }) {
  return (
    <div className="bg-[#161b22] rounded-xl border border-gray-800 p-5 shadow-sm hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold tracking-wide gradient-title">
          {title}
        </h2>
      </div>
      {description && (
        <p className="text-sm text-gray-400 mb-4 leading-relaxed">
          {description}
        </p>
      )}
      {children}
    </div>
  );
}
