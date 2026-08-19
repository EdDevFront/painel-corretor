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

    // Sync ref
    useImperativeHandle(ref, () => inputRef.current!);

    // Sync controlled value
    useEffect(() => {
      if (controlledValue !== undefined) {
        setSelectedDateStr(String(controlledValue));
      }
    }, [controlledValue]);

    // Parse date for calendar state
    const parsedDate = selectedDateStr ? new Date(selectedDateStr + "T00:00:00") : new Date();
    const [viewYear, setViewYear] = useState(parsedDate.getFullYear());
    const [viewMonth, setViewMonth] = useState(parsedDate.getMonth());

    // Update calendar viewing month when selection changes
    useEffect(() => {
      if (selectedDateStr) {
        const d = new Date(selectedDateStr + "T00:00:00");
        if (!isNaN(d.getTime())) {
          setViewYear(d.getFullYear());
          setViewMonth(d.getMonth());
        }
      }
    }, [selectedDateStr, showCalendar]);

    // Calendar logic
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

    const handleSelectDay = (day: number) => {
      const pad = (n: number) => String(n).padStart(2, "0");
      const dateStr = `${viewYear}-${pad(viewMonth + 1)}-${pad(day)}`;
      setSelectedDateStr(dateStr);
      setShowCalendar(false);

      if (inputRef.current) {
        inputRef.current.value = dateStr;
        const event = new Event("change", { bubbles: true });
        inputRef.current.dispatchEvent(event);
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

    // Format showing text (e.g. 19/08/2026)
    const getDisplayValue = () => {
      if (!selectedDateStr) return "";
      const d = new Date(selectedDateStr + "T00:00:00");
      if (isNaN(d.getTime())) return "";
      const pad = (n: number) => String(n).padStart(2, "0");
      return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
    };

    return (
      <div ref={containerRef} className="flex flex-col gap-1 w-full relative">
        {label && (
          <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
            {label}
          </label>
        )}

        {/* Hidden/Native input for form registering */}
        <input
          ref={inputRef}
          type={isDate ? "hidden" : type}
          value={selectedDateStr}
          onChange={(e) => {
            setSelectedDateStr(e.target.value);
            onChange?.(e);
          }}
          {...props}
        />

        {/* Custom Visual Wrapper for Date */}
        {isDate ? (
          <div className="relative">
            <div
              onClick={() => setShowCalendar(!showCalendar)}
              className={`w-full flex items-center justify-between border border-slate-200 rounded-md py-2.5 px-3 bg-white cursor-pointer text-sm text-slate-800 hover:border-slate-300 focus-within:border-teal-500 focus-within:ring-3 focus-within:ring-teal-100 transition-all ${
                error ? "border-red-500" : ""
              } ${className}`}
            >
              <span>{getDisplayValue() || "DD/MM/AAAA"}</span>
              <FiCalendar className="text-slate-400" />
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

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectDay(day)}
                        className={`text-xs h-7 w-7 mx-auto rounded-full flex items-center justify-center cursor-pointer transition-colors ${
                          isSelected
                            ? "bg-teal-600 text-white font-semibold"
                            : "text-slate-700 hover:bg-teal-50 hover:text-teal-700"
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
        ) : (
          /* Normal Inputs */
          <input
            className={`border border-slate-200 rounded-md py-2 px-3 focus:outline-hidden focus:border-teal-500 focus:ring-3 focus:ring-teal-100 transition-all text-sm bg-white text-slate-900 ${
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
