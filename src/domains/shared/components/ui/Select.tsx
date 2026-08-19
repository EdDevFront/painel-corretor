import React, { forwardRef } from "react";
import { FiChevronDown } from "react-icons/fi";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, className = "", children, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1 w-full">
        {label && (
          <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={`w-full appearance-none border border-slate-200 rounded-md py-2.5 pl-3 pr-10 focus:outline-hidden focus:border-teal-500 focus:ring-3 focus:ring-teal-100 transition-all text-sm bg-white cursor-pointer text-slate-800 ${
              error ? "border-red-500 focus:border-red-500 focus:ring-red-100" : ""
            } ${className}`}
            {...props}
          >
            {children}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
            <FiChevronDown />
          </div>
        </div>
        {/* Fixed height container to prevent layout shift */}
        <div className="h-5">
          {error && <span className="text-red-500 text-xs block mt-0.5">{error}</span>}
        </div>
      </div>
    );
  }
);

Select.displayName = "Select";
