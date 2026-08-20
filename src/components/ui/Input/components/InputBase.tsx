import React from "react";

interface InputBaseProps extends React.InputHTMLAttributes<HTMLInputElement> {
  inputRef: React.RefObject<HTMLInputElement | null>;
  error?: string;
}

export function InputBase({ inputRef, error, className = "", type = "text", onChange, ...props }: InputBaseProps) {
  const borderClass = error ? "border-red-500 focus:border-red-500 focus:ring-red-100" : "";
  
  return (
    <input
      ref={inputRef}
      type={type}
      onChange={onChange}
      className={`border border-slate-200 rounded-md py-2.5 px-3 focus:outline-hidden focus:border-teal-500 focus:ring-3 focus:ring-teal-100 transition-all text-sm bg-white text-slate-900 ${borderClass} ${className}`}
      {...props}
    />
  );
}