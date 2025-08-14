import React from "react";

export function Label({ children, htmlFor }) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-xs uppercase tracking-wider text-gray-400 font-medium mb-1"
    >
      {children}
    </label>
  );
}

export function TextInput(props) {
  return (
    <input
      {...props}
      className={
        "w-full px-3 py-2 rounded-md bg-[#0f1115] border border-gray-700 focus:border-accent focus:outline-none text-sm transition-colors " +
        (props.className || "")
      }
    />
  );
}

export function TextArea(props) {
  return (
    <textarea
      {...props}
      className={
        "w-full px-3 py-2 rounded-md bg-[#0f1115] border border-gray-700 focus:border-accent focus:outline-none text-sm resize-y min-h-[100px] transition-colors " +
        (props.className || "")
      }
    />
  );
}

export function Button({ children, variant = "primary", ...rest }) {
  const base =
    "px-4 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0f1115]";
  const styles = {
    primary: "bg-accent hover:bg-accent-soft text-white focus:ring-accent-soft",
    hollow:
      "bg-transparent border border-accent text-accent hover:bg-accent/10 focus:ring-accent",
  };
  return (
    <button {...rest} className={`${base} ${styles[variant]}`}>
      {children}
    </button>
  );
}
