import React, { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1 w-full">
        {label && (
          <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`border border-slate-200 rounded-md py-2 px-3 focus:outline-hidden focus:border-teal-500 focus:ring-3 focus:ring-teal-100 transition-all text-sm bg-white text-slate-900 ${
            error ? "border-red-500 focus:border-red-500 focus:ring-red-100" : ""
          } ${className}`}
          {...props}
        />
        {/* Fixed height container to prevent layout shift */}
        <div className="h-5">
          {error && <span className="text-red-500 text-xs block mt-0.5">{error}</span>}
        </div>
      </div>
    );
  }
);

Input.displayName = "Input";
