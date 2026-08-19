import React from "react";

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export function IconButton({ className = "", children, ...props }: IconButtonProps) {
  return (
    <button
      className={`p-2.5 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 cursor-pointer transition-all duration-200 inline-flex items-center justify-center ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
