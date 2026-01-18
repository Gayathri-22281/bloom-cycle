import { useState, useEffect } from "react";

export interface PeriodData {
  dates: string[];
  cycleLength: number;
  lastPeriodStart: string | null;
  nextExpectedDate: string | null;
}

const STORAGE_KEY = "femcare_period_data";

export function usePeriodTracker() {
  const [periodData, setPeriodData] = useState<PeriodData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      dates: [],
      cycleLength: 28,
      lastPeriodStart: null,
      nextExpectedDate: null,
    };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(periodData));
  }, [periodData]);

  const toggleDate = (dateStr: string) => {
    setPeriodData((prev) => {
      const newDates = prev.dates.includes(dateStr)
        ? prev.dates.filter((d) => d !== dateStr)
        : [...prev.dates, dateStr].sort();
      
      // Calculate cycle info
      const sortedDates = [...newDates].sort();
      let cycleLength = 28;
      let lastPeriodStart: string | null = null;
      let nextExpectedDate: string | null = null;

      if (sortedDates.length > 0) {
        // Find period start dates (first day after a gap)
        const periodStarts: string[] = [sortedDates[0]];
        for (let i = 1; i < sortedDates.length; i++) {
          const prev = new Date(sortedDates[i - 1]);
          const curr = new Date(sortedDates[i]);
          const diffDays = Math.floor((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));
          if (diffDays > 7) {
            periodStarts.push(sortedDates[i]);
          }
        }

        lastPeriodStart = periodStarts[periodStarts.length - 1];

        // Calculate average cycle length
        if (periodStarts.length >= 2) {
          let totalGap = 0;
          for (let i = 1; i < periodStarts.length; i++) {
            const prev = new Date(periodStarts[i - 1]);
            const curr = new Date(periodStarts[i]);
            totalGap += Math.floor((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));
          }
          cycleLength = Math.round(totalGap / (periodStarts.length - 1));
        }

        // Calculate next expected date
        if (lastPeriodStart) {
          const lastDate = new Date(lastPeriodStart);
          lastDate.setDate(lastDate.getDate() + cycleLength);
          nextExpectedDate = lastDate.toISOString().split('T')[0];
        }
      }

      return {
        dates: newDates,
        cycleLength,
        lastPeriodStart,
        nextExpectedDate,
      };
    });
  };

  const getCycleStatus = (): { status: string; color: string; emoji: string } => {
    const { cycleLength } = periodData;
    if (cycleLength >= 21 && cycleLength <= 35) {
      return { status: "Normal", color: "text-green-600", emoji: "✅" };
    } else if (cycleLength > 35 && cycleLength <= 45) {
      return { status: "Delayed", color: "text-yellow-600", emoji: "⚠️" };
    } else {
      return { status: "Needs Attention", color: "text-red-600", emoji: "🚨" };
    }
  };

  const isPeriodDate = (dateStr: string) => periodData.dates.includes(dateStr);

  return {
    periodData,
    toggleDate,
    getCycleStatus,
    isPeriodDate,
  };
}
