import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

export function Button({ variant = "primary", className = "", children, ...props }: ButtonProps) {
  const baseStyle = "flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider py-2.5 px-5 rounded-lg cursor-pointer transition-all duration-200";
  
  const variantStyles = variant === "primary"
    ? "bg-slate-900 text-white hover:bg-slate-800 shadow-md shadow-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
    : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50";

  return (
    <button className={`${baseStyle} ${variantStyles} ${className}`} {...props}>
      {children}
    </button>
  );
}
