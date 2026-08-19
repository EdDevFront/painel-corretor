import React, { forwardRef, useState, useEffect, useRef, useImperativeHandle } from "react";
import { FiChevronDown } from "react-icons/fi";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hideErrorSpace?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, className = "", children, onChange, value: controlledValue, defaultValue, hideErrorSpace, ...props }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const selectRef = useRef<HTMLSelectElement>(null);

    // Sync refs
    useImperativeHandle(ref, () => selectRef.current!);

    // Parse options
    const options = React.Children.toArray(children)
      .map((child) => {
        if (React.isValidElement(child) && child.type === "option") {
          const optChild = child as React.ReactElement<{ value?: string; children?: React.ReactNode }>;
          return {
            value: String(optChild.props.value || ""),
            label: String(optChild.props.children || ""),
          };
        }
        return null;
      })
      .filter(Boolean) as { value: string; label: string }[];

    const [selectedValue, setSelectedValue] = useState<string>(
      String(controlledValue !== undefined ? controlledValue : (defaultValue !== undefined ? defaultValue : (options[0]?.value || "")))
    );

    useEffect(() => {
      if (controlledValue !== undefined) {
        setSelectedValue(String(controlledValue));
      }
    }, [controlledValue]);

    const handleSelect = (val: string) => {
      setSelectedValue(val);
      setIsOpen(false);

      if (selectRef.current) {
        selectRef.current.value = val;
        // Dispatch synthetic event for react-hook-form
        const event = new Event("change", { bubbles: true });
        selectRef.current.dispatchEvent(event);
      }
    };

    // Close when clicking outside
    useEffect(() => {
      const handleOutsideClick = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setIsOpen(false);
        }
      };
      document.addEventListener("mousedown", handleOutsideClick);
      return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, []);

    const selectedOption = options.find((o) => o.value === selectedValue);

    return (
      <div ref={containerRef} className="flex flex-col gap-1 w-full relative">
        {label && (
          <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
            {label}
          </label>
        )}
        
        {/* Hidden native select for form hooks */}
        <select
          ref={selectRef}
          value={selectedValue}
          onChange={(e) => {
            setSelectedValue(e.target.value);
            onChange?.(e);
          }}
          className="sr-only"
          {...props}
        >
          {children}
        </select>

        {/* Custom styled trigger */}
        <div className="relative">
          <div
            onClick={() => setIsOpen(!isOpen)}
            className={`w-full flex items-center justify-between border border-slate-200 rounded-md py-2.5 pl-3 pr-10 bg-white cursor-pointer text-sm text-slate-800 hover:border-slate-300 focus-within:border-teal-500 focus-within:ring-3 focus-within:ring-teal-100 transition-all ${
              error ? "border-red-500" : ""
            } ${className}`}
          >
            <span className="truncate">{selectedOption?.label || "Selecione..."}</span>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
              <FiChevronDown className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
            </div>
          </div>

          {/* Custom styled dropdown menu */}
          {isOpen && (
            <div className="absolute z-50 mt-1.5 w-full bg-white border border-slate-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
              {options.map((opt) => (
                <div
                  key={opt.value}
                  onClick={() => handleSelect(opt.value)}
                  className={`py-2.5 px-3 text-sm cursor-pointer hover:bg-teal-50 hover:text-teal-700 transition-colors ${
                    opt.value === selectedValue ? "bg-teal-50 text-teal-700 font-semibold" : "text-slate-700"
                  }`}
                >
                  {opt.label}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Fixed height error container */}
        {!hideErrorSpace && (
          <div className="h-5">
            {error && <span className="text-red-500 text-xs block mt-0.5">{error}</span>}
          </div>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
