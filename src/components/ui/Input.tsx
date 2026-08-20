import React, { forwardRef, useState, useEffect, useRef, useImperativeHandle } from "react";
import { DatePicker } from "./components/DatePicker/DatePicker";
import { InputBase } from "./components/InputBase";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hideErrorSpace?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", type = "text", onChange, value: controlledValue, defaultValue, hideErrorSpace, ...props }, ref) => {
    const isDate = type === "date";
    const inputRef = useRef<HTMLInputElement>(null);
    useImperativeHandle(ref, () => inputRef.current!);

    const initialValue = String(controlledValue !== undefined ? controlledValue : (defaultValue !== undefined ? defaultValue : ""));
    const [selectedDateStr, setSelectedDateStr] = useState<string>(initialValue);

    useEffect(() => {
      const hasControlledValue = controlledValue !== undefined;
      if (hasControlledValue) {
        setSelectedDateStr(String(controlledValue));
      }
    }, [controlledValue]);

    const triggerNativeChange = (dateStr: string) => {
      const currentInput = inputRef.current;
      if (currentInput) {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
        nativeInputValueSetter?.call(currentInput, dateStr);
        currentInput.dispatchEvent(new Event("input", { bubbles: true }));
        currentInput.dispatchEvent(new Event("change", { bubbles: true }));
      }
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSelectedDateStr(e.target.value);
      if (onChange) onChange(e);
    };

    return (
      <div className="flex flex-col gap-1 w-full relative">
        {label && (
          <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
            {label}
          </label>
        )}

        {isDate ? (
          <>
            <input
              ref={inputRef}
              type="text"
              value={selectedDateStr}
              onChange={handleDateChange}
              className="absolute opacity-0 pointer-events-none w-0 h-0"
              {...props}
            />
            <DatePicker
              selectedDateStr={selectedDateStr}
              setSelectedDateStr={setSelectedDateStr}
              triggerNativeChange={triggerNativeChange}
              inputRef={inputRef}
              error={error}
              className={className}
            />
          </>
        ) : (
          <InputBase
            inputRef={inputRef}
            type={type}
            onChange={onChange}
            error={error}
            className={className}
            {...props}
          />
        )}

        {!hideErrorSpace && (
          <div className="h-5">
            {error && <span className="text-red-500 text-xs block mt-0.5">{error}</span>}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";