import React from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const MONTH_NAMES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const WEEK_DAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

interface CalendarProps {
  viewYear: number;
  viewMonth: number;
  daysGrid: (number | null)[];
  selectedDateStr: string;
  onPrevMonth: (e: React.MouseEvent) => void;
  onNextMonth: (e: React.MouseEvent) => void;
  onSelectDay: (day: number) => void;
}

export function Calendar({
  viewYear,
  viewMonth,
  daysGrid,
  selectedDateStr,
  onPrevMonth,
  onNextMonth,
  onSelectDay,
}: CalendarProps) {
  return (
    <div className="absolute z-50 mt-1.5 w-[280px] bg-white border border-slate-200 rounded-md shadow-lg p-4 left-0">
      <div className="flex items-center justify-between mb-4">
        <button type="button" onClick={onPrevMonth} className="p-1 hover:bg-slate-100 rounded text-slate-600 cursor-pointer">
          <FiChevronLeft />
        </button>
        <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          {MONTH_NAMES[viewMonth]} {viewYear}
        </span>
        <button type="button" onClick={onNextMonth} className="p-1 hover:bg-slate-100 rounded text-slate-600 cursor-pointer">
          <FiChevronRight />
        </button>
      </div>

      <div className="grid grid-cols-7 text-center mb-2 gap-y-1">
        {WEEK_DAYS.map((d) => (
          <span key={d} className="text-[10px] font-bold text-slate-400 uppercase">
            {d}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 text-center gap-y-1">
        {daysGrid.map((day, idx) => {
          const isEmpty = day === null;
          if (isEmpty) return <span key={`empty-${idx}`} />;
          
          const pad = (n: number) => String(n).padStart(2, "0");
          const dateStr = `${viewYear}-${pad(viewMonth + 1)}-${pad(day)}`;
          const isSelected = dateStr === selectedDateStr;

          const testDate = new Date(dateStr + "T00:00:00");
          const today = new Date();
          today.setHours(23, 59, 59, 999);
          const isFuture = testDate > today;

          const btnClass = isSelected
            ? "bg-teal-600 text-white font-semibold"
            : isFuture
            ? "text-slate-200 cursor-not-allowed"
            : "text-slate-700 hover:bg-teal-50 hover:text-teal-700 cursor-pointer";

          return (
            <button
              key={idx}
              type="button"
              disabled={isFuture}
              onClick={() => onSelectDay(day!)}
              className={`text-xs h-7 w-7 mx-auto rounded-full flex items-center justify-center transition-colors ${btnClass}`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}