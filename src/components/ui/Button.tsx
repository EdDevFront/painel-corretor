import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  size?: "md" | "lg";
}

export function Button({ variant = "primary", size = "md", className = "", children, ...props }: ButtonProps) {
  const baseStyle = "flex items-center justify-center gap-2 uppercase rounded-lg cursor-pointer transition-all duration-200";
  
  const variantStyles = variant === "primary"
    ? "bg-slate-900 text-white hover:bg-slate-800 shadow-md shadow-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
    : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50";

  const sizeStyles = size === "lg"
    ? "py-3.5 px-8 text-xs font-bold tracking-widest"
    : "py-2.5 px-5 text-xs font-semibold tracking-wider";

  return (
    <button className={`${baseStyle} ${variantStyles} ${sizeStyles} ${className}`} {...props}>
      {children}
    </button>
  );
}
