import React, { forwardRef } from "react";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className = "", ...props }, ref) => {
    return (
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          ref={ref}
          className={`w-5 h-5 cursor-pointer accent-teal-600 rounded border-slate-300 text-teal-600 focus:ring-teal-500 transition-all ${className}`}
          {...props}
        />
        <label htmlFor={props.id} className="text-sm font-semibold text-slate-700 cursor-pointer select-none">
          {label}
        </label>
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";
