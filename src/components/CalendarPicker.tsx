"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, addDays, startOfDay } from "date-fns";
import { fr } from "date-fns/locale";

interface CalendarPickerProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

export function CalendarPicker({ selectedDate, onSelectDate }: CalendarPickerProps) {
  const today = startOfDay(new Date());
  const minDate = addDays(today, 1);
  const maxDate = addDays(today, 180);

  const [currentMonth, setCurrentMonth] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  });
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [loadingMonth, setLoadingMonth] = useState(false);

  // Charge les jours bloqués du mois affiché
  useEffect(() => {
    setLoadingMonth(true);
    fetch(`/api/availability?month=${currentMonth}`)
      .then((r) => r.json())
      .then((data) => setBlockedDates(data.blockedDates || []))
      .catch(() => setBlockedDates([]))
      .finally(() => setLoadingMonth(false));
  }, [currentMonth]);

  const [year, month] = currentMonth.split("-").map(Number);
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  const daysInMonth = lastDay.getDate();

  // Jour de la semaine du 1er (0=dim, converti en lundi=0)
  let startDow = firstDay.getDay() - 1;
  if (startDow < 0) startDow = 6;

  const monthLabel = format(firstDay, "MMMM yyyy", { locale: fr });

  const prevMonth = () => {
    const d = new Date(year, month - 2, 1);
    setCurrentMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  };

  const nextMonth = () => {
    const d = new Date(year, month, 1);
    setCurrentMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  };

  const canGoPrev = () => {
    const prevDate = new Date(year, month - 2, 1);
    return prevDate >= new Date(minDate.getFullYear(), minDate.getMonth(), 1);
  };

  const canGoNext = () => {
    const nextDate = new Date(year, month, 1);
    return nextDate <= new Date(maxDate.getFullYear(), maxDate.getMonth(), 1);
  };

  const days = [];
  // Cases vides avant le 1er
  for (let i = 0; i < startDow; i++) {
    days.push(null);
  }
  // Jours du mois
  for (let d = 1; d <= daysInMonth; d++) {
    days.push(d);
  }

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      {/* Header mois */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
        <button
          onClick={prevMonth}
          disabled={!canGoPrev()}
          className="p-1 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={18} />
        </button>
        <span className="text-sm font-semibold text-basque-dark capitalize">
          {loadingMonth ? "..." : monthLabel}
        </span>
        <button
          onClick={nextMonth}
          disabled={!canGoNext()}
          className="p-1 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Jours de la semaine */}
      <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-100">
        {["L", "M", "M", "J", "V", "S", "D"].map((d, i) => (
          <div key={i} className="text-center text-xs font-medium text-gray-400 py-2">
            {d}
          </div>
        ))}
      </div>

      {/* Grille des jours */}
      <div className="grid grid-cols-7 p-2 gap-1">
        {days.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} />;

          const dateStr = `${currentMonth}-${String(day).padStart(2, "0")}`;
          const date = new Date(dateStr);
          const isPast = date < minDate;
          const isFuture = date > maxDate;
          const isBlocked = blockedDates.includes(dateStr);
          const isUnavailable = isPast || isFuture || isBlocked;
          const isSelected = selectedDate === dateStr;
          const isToday = dateStr === format(today, "yyyy-MM-dd");

          return (
            <button
              key={day}
              onClick={() => !isUnavailable && onSelectDate(dateStr)}
              disabled={isUnavailable}
              className={`
                aspect-square flex items-center justify-center rounded-lg text-sm transition-all
                ${isSelected
                  ? "bg-basque-red text-white font-bold shadow-md"
                  : isUnavailable
                  ? "text-gray-200 cursor-not-allowed"
                  : "text-basque-dark font-semibold hover:bg-basque-red/10 hover:text-basque-red cursor-pointer"
                }
                ${isToday && !isSelected ? "ring-1 ring-basque-red/30" : ""}
              `}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* Légende */}
      <div className="flex items-center gap-4 px-4 pb-3 text-xs text-gray-400">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-basque-red inline-block" /> Sélectionné
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-gray-100 inline-block" /> Indisponible
        </span>
      </div>
    </div>
  );
}
