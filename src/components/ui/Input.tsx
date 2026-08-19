import React, { forwardRef, useState, useEffect, useRef, useImperativeHandle } from "react";
import { FiCalendar, FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const MONTH_NAMES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const WEEK_DAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", type = "text", onChange, value: controlledValue, defaultValue, ...props }, ref) => {
    const isDate = type === "date";
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    
    // Custom calendar states
    const [showCalendar, setShowCalendar] = useState(false);
    const [selectedDateStr, setSelectedDateStr] = useState<string>(
      String(controlledValue !== undefined ? controlledValue : (defaultValue !== undefined ? defaultValue : ""))
    );
    const [typedValue, setTypedValue] = useState("");

    // Sync ref
    useImperativeHandle(ref, () => inputRef.current!);

    // Sync controlled value to selectedDateStr
    useEffect(() => {
      if (controlledValue !== undefined) {
        setSelectedDateStr(String(controlledValue));
      }
    }, [controlledValue]);

    // Format typing display value (e.g. 19/08/2026) when date state changes
    useEffect(() => {
      if (selectedDateStr) {
        const d = new Date(selectedDateStr + "T00:00:00");
        if (!isNaN(d.getTime())) {
          const pad = (n: number) => String(n).padStart(2, "0");
          setTypedValue(`${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`);
        }
      } else {
        setTypedValue("");
      }
    }, [selectedDateStr]);

    // Parse date for calendar initial state
    const parsedDate = selectedDateStr ? new Date(selectedDateStr + "T00:00:00") : new Date();
    const [viewYear, setViewYear] = useState(parsedDate.getFullYear());
    const [viewMonth, setViewMonth] = useState(parsedDate.getMonth());

    // Update calendar viewing month when popover opens
    useEffect(() => {
      if (selectedDateStr) {
        const d = new Date(selectedDateStr + "T00:00:00");
        if (!isNaN(d.getTime())) {
          setViewYear(d.getFullYear());
          setViewMonth(d.getMonth());
        }
      }
    }, [selectedDateStr, showCalendar]);

    // Calendar logic helpers
    const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
    const getFirstDayOfMonth = (y: number, m: number) => new Date(y, m, 1).getDay();

    const daysInMonth = getDaysInMonth(viewYear, viewMonth);
    const firstDayIndex = getFirstDayOfMonth(viewYear, viewMonth);

    const daysGrid: (number | null)[] = [];
    for (let i = 0; i < firstDayIndex; i++) {
      daysGrid.push(null);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      daysGrid.push(d);
    }

    const handlePrevMonth = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (viewMonth === 0) {
        setViewMonth(11);
        setViewYear(viewYear - 1);
      } else {
        setViewMonth(viewMonth - 1);
      }
    };

    const handleNextMonth = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (viewMonth === 11) {
        setViewMonth(0);
        setViewYear(viewYear + 1);
      } else {
        setViewMonth(viewMonth + 1);
      }
    };

    const triggerNativeChange = (dateStr: string) => {
      if (inputRef.current) {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          HTMLInputElement.prototype,
          "value"
        )?.set;
        nativeInputValueSetter?.call(inputRef.current, dateStr);
        inputRef.current.dispatchEvent(new Event("input", { bubbles: true }));
        inputRef.current.dispatchEvent(new Event("change", { bubbles: true }));
      }
    };

    const handleSelectDay = (day: number) => {
      const pad = (n: number) => String(n).padStart(2, "0");
      const dateStr = `${viewYear}-${pad(viewMonth + 1)}-${pad(day)}`;

      // Don't select future dates
      const testDate = new Date(dateStr + "T00:00:00");
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      if (testDate > today) return;

      setSelectedDateStr(dateStr);
      setShowCalendar(false);
      triggerNativeChange(dateStr);
    };

    // Handle manual typing with slashes
    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let val = e.target.value.replace(/\D/g, "");
      if (val.length > 8) val = val.slice(0, 8);

      let formatted = "";
      if (val.length > 0) {
        formatted += val.slice(0, 2);
      }
      if (val.length > 2) {
        formatted += "/" + val.slice(2, 4);
      }
      if (val.length > 4) {
        formatted += "/" + val.slice(4, 8);
      }
      setTypedValue(formatted);

      if (val.length === 8) {
        const day = val.slice(0, 2);
        const month = val.slice(2, 4);
        const year = val.slice(4, 8);
        const dateStr = `${year}-${month}-${day}`;
        const testDate = new Date(dateStr + "T00:00:00");

        const today = new Date();
        today.setHours(23, 59, 59, 999);

        if (!isNaN(testDate.getTime()) && testDate <= today) {
          setSelectedDateStr(dateStr);
          triggerNativeChange(dateStr);
        }
      } else {
        // If incomplete, set state to empty so react hook form validation triggers
        setSelectedDateStr("");
        triggerNativeChange("");
      }
    };

    // Close on outside clicks
    useEffect(() => {
      const handleOutsideClick = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setShowCalendar(false);
        }
      };
      document.addEventListener("mousedown", handleOutsideClick);
      return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, []);

    return (
      <div ref={containerRef} className="flex flex-col gap-1 w-full relative">
        {label && (
          <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
            {label}
          </label>
        )}

        {isDate ? (
          <>
            {/* Hidden native input registered by form hook */}
            <input
              ref={inputRef}
              type="text"
              value={selectedDateStr}
              onChange={(e) => {
                setSelectedDateStr(e.target.value);
                onChange?.(e);
              }}
              className="absolute opacity-0 pointer-events-none w-0 h-0"
              {...props}
            />

            {/* Custom Interactive Text Input Datepicker */}
            <div className="relative">
              <input
                type="text"
                placeholder="DD/MM/AAAA"
                value={typedValue}
                onChange={handleTextChange}
                onFocus={() => setShowCalendar(true)}
                className={`w-full border border-slate-200 rounded-md py-2.5 pl-3 pr-10 bg-white text-sm text-slate-800 focus:outline-hidden focus:border-teal-500 focus:ring-3 focus:ring-teal-100 transition-all ${
                  error ? "border-red-500 focus:border-red-500 focus:ring-red-100" : ""
                } ${className}`}
              />
              <div
                onClick={() => setShowCalendar(!showCalendar)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-slate-400 hover:text-teal-600"
              >
                <FiCalendar className="text-base" />
              </div>

              {/* Custom Calendar Popover */}
              {showCalendar && (
                <div className="absolute z-50 mt-1.5 w-[280px] bg-white border border-slate-200 rounded-md shadow-lg p-4 left-0">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <button type="button" onClick={handlePrevMonth} className="p-1 hover:bg-slate-100 rounded text-slate-600 cursor-pointer">
                      <FiChevronLeft />
                    </button>
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      {MONTH_NAMES[viewMonth]} {viewYear}
                    </span>
                    <button type="button" onClick={handleNextMonth} className="p-1 hover:bg-slate-100 rounded text-slate-600 cursor-pointer">
                      <FiChevronRight />
                    </button>
                  </div>

                  {/* Weekdays */}
                  <div className="grid grid-cols-7 text-center mb-2 gap-y-1">
                    {WEEK_DAYS.map((d) => (
                      <span key={d} className="text-[10px] font-bold text-slate-400 uppercase">
                        {d}
                      </span>
                    ))}
                  </div>

                  {/* Days Grid */}
                  <div className="grid grid-cols-7 text-center gap-y-1">
                    {daysGrid.map((day, idx) => {
                      if (day === null) return <span key={`empty-${idx}`} />;
                      
                      const pad = (n: number) => String(n).padStart(2, "0");
                      const dateStr = `${viewYear}-${pad(viewMonth + 1)}-${pad(day)}`;
                      const isSelected = dateStr === selectedDateStr;

                      const testDate = new Date(dateStr + "T00:00:00");
                      const today = new Date();
                      today.setHours(23, 59, 59, 999);
                      const isFuture = testDate > today;

                      return (
                        <button
                          key={idx}
                          type="button"
                          disabled={isFuture}
                          onClick={() => handleSelectDay(day)}
                          className={`text-xs h-7 w-7 mx-auto rounded-full flex items-center justify-center transition-colors ${
                            isSelected
                              ? "bg-teal-600 text-white font-semibold"
                              : isFuture
                              ? "text-slate-200 cursor-not-allowed"
                              : "text-slate-700 hover:bg-teal-50 hover:text-teal-700 cursor-pointer"
                          }`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          /* Normal Inputs - No Duplicate */
          <input
            ref={inputRef}
            type={type}
            onChange={onChange}
            className={`border border-slate-200 rounded-md py-2.5 px-3 focus:outline-hidden focus:border-teal-500 focus:ring-3 focus:ring-teal-100 transition-all text-sm bg-white text-slate-900 ${
              error ? "border-red-500 focus:border-red-500 focus:ring-red-100" : ""
            } ${className}`}
            {...props}
          />
        )}

        {/* Fixed height container to prevent layout shift */}
        <div className="h-5">
          {error && <span className="text-red-500 text-xs block mt-0.5">{error}</span>}
        </div>
      </div>
    );
  }
);

Input.displayName = "Input";
