import React, { useState, useEffect, useRef } from "react";
import { FiCalendar } from "react-icons/fi";
import { useCalendar } from "../../hooks/useCalendar";
import { Calendar } from "./Calendar";

interface DatePickerProps extends React.InputHTMLAttributes<HTMLInputElement> {
  selectedDateStr: string;
  setSelectedDateStr: (val: string) => void;
  triggerNativeChange: (val: string) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  error?: string;
}

export function DatePicker({
  selectedDateStr,
  setSelectedDateStr,
  triggerNativeChange,
  inputRef,
  error,
  className = "",
  ...props
}: DatePickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [typedValue, setTypedValue] = useState("");

  const calendarProps = useCalendar(selectedDateStr, setSelectedDateStr, triggerNativeChange, showCalendar);

  useEffect(() => {
    if (selectedDateStr) {
      const d = new Date(selectedDateStr + "T00:00:00");
      const isValid = !isNaN(d.getTime());
      if (isValid) {
        const pad = (n: number) => String(n).padStart(2, "0");
        setTypedValue(`${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`);
      }
    } else {
      setTypedValue("");
    }
  }, [selectedDateStr]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 8) val = val.slice(0, 8);

    let formatted = "";
    if (val.length > 0) formatted += val.slice(0, 2);
    if (val.length > 2) formatted += "/" + val.slice(2, 4);
    if (val.length > 4) formatted += "/" + val.slice(4, 8);
    setTypedValue(formatted);

    const isComplete = val.length === 8;
    if (isComplete) {
      const day = val.slice(0, 2);
      const month = val.slice(2, 4);
      const year = val.slice(4, 8);
      const dateStr = `${year}-${month}-${day}`;
      const testDate = new Date(dateStr + "T00:00:00");

      const today = new Date();
      today.setHours(23, 59, 59, 999);

      const isValid = !isNaN(testDate.getTime()) && testDate <= today;
      if (isValid) {
        setSelectedDateStr(dateStr);
        triggerNativeChange(dateStr);
      }
    } else {
      setSelectedDateStr("");
      triggerNativeChange("");
    }
  };

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const isOutside = containerRef.current && !containerRef.current.contains(e.target as Node);
      if (isOutside) {
        setShowCalendar(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const borderClass = error ? "border-red-500 focus:border-red-500 focus:ring-red-100" : "";

  return (
    <div ref={containerRef} className="relative">
      <input
        type="text"
        placeholder="DD/MM/AAAA"
        value={typedValue}
        onChange={handleTextChange}
        onFocus={() => setShowCalendar(true)}
        className={`w-full border border-slate-200 rounded-md py-2.5 pl-3 pr-10 bg-white text-sm text-slate-800 focus:outline-hidden focus:border-teal-500 focus:ring-3 focus:ring-teal-100 transition-all ${borderClass} ${className}`}
      />
      <div
        onClick={() => setShowCalendar(!showCalendar)}
        className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-slate-400 hover:text-teal-600"
      >
        <FiCalendar className="text-base" />
      </div>

      {showCalendar && (
        <Calendar
          {...calendarProps}
          selectedDateStr={selectedDateStr}
          onSelectDay={(day) => calendarProps.handleSelectDay(day, setShowCalendar)}
          onPrevMonth={calendarProps.handlePrevMonth}
          onNextMonth={calendarProps.handleNextMonth}
        />
      )}
    </div>
  );
}