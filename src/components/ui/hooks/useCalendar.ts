import { useState, useEffect } from "react";

export function useCalendar(selectedDateStr: string, setSelectedDateStr: (val: string) => void, triggerNativeChange: (val: string) => void, showCalendar: boolean) {
  const parsedDate = selectedDateStr ? new Date(selectedDateStr + "T00:00:00") : new Date();
  const [viewYear, setViewYear] = useState(parsedDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(parsedDate.getMonth());

  useEffect(() => {
    if (selectedDateStr) {
      const d = new Date(selectedDateStr + "T00:00:00");
      const isValidDate = !isNaN(d.getTime());
      if (isValidDate) {
        setViewYear(d.getFullYear());
        setViewMonth(d.getMonth());
      }
    }
  }, [selectedDateStr, showCalendar]);

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    const isJanuary = viewMonth === 0;
    if (isJanuary) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    const isDecember = viewMonth === 11;
    if (isDecember) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

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

  const handleSelectDay = (day: number, setShowCalendar: (show: boolean) => void) => {
    const pad = (n: number) => String(n).padStart(2, "0");
    const dateStr = `${viewYear}-${pad(viewMonth + 1)}-${pad(day)}`;

    const testDate = new Date(dateStr + "T00:00:00");
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    
    const isFutureDate = testDate > today;
    if (isFutureDate) return;

    setSelectedDateStr(dateStr);
    setShowCalendar(false);
    triggerNativeChange(dateStr);
  };

  return {
    viewYear,
    viewMonth,
    daysGrid,
    handlePrevMonth,
    handleNextMonth,
    handleSelectDay
  };
}