import { useState } from "react";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePeriodTracker } from "@/hooks/usePeriodTracker";
import { cn } from "@/lib/utils";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function PeriodCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { periodData, toggleDate, getCycleStatus, isPeriodDate } = usePeriodTracker();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleDateClick = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    toggleDate(dateStr);
  };

  const isToday = (day: number) => {
    const today = new Date();
    return today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
  };

  const isNextExpected = (day: number) => {
    if (!periodData.nextExpectedDate) return false;
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return dateStr === periodData.nextExpectedDate;
  };

  const cycleStatus = getCycleStatus();

  const days: (number | null)[] = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-primary/20 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/30 pb-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={prevMonth} className="rounded-full">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <CardTitle className="text-xl font-semibold text-foreground">
              {MONTHS[month]} {year}
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={nextMonth} className="rounded-full">
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-7 gap-1 mb-2">
            {DAYS.map((day) => (
              <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              if (day === null) {
                return <div key={`empty-${index}`} className="h-12" />;
              }

              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const isPeriod = isPeriodDate(dateStr);
              const todayClass = isToday(day);
              const isExpected = isNextExpected(day);

              return (
                <button
                  key={day}
                  onClick={() => handleDateClick(day)}
                  className={cn(
                    "h-12 rounded-xl text-sm font-medium transition-all duration-200 relative",
                    "hover:scale-105 hover:shadow-md",
                    isPeriod && "bg-primary text-primary-foreground shadow-md",
                    !isPeriod && "hover:bg-accent/50",
                    todayClass && !isPeriod && "ring-2 ring-primary ring-offset-2",
                    isExpected && !isPeriod && "bg-accent text-accent-foreground border-2 border-dashed border-primary/50"
                  )}
                >
                  {day}
                  {isPeriod && (
                    <Heart className="absolute -top-1 -right-1 h-3 w-3 text-primary-foreground fill-current" />
                  )}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Cycle Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-primary/20">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground mb-1">Cycle Length</p>
            <p className="text-2xl font-bold text-primary">{periodData.cycleLength} days</p>
          </CardContent>
        </Card>
        <Card className="border-primary/20">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground mb-1">Cycle Status</p>
            <p className={cn("text-2xl font-bold", cycleStatus.color)}>
              {cycleStatus.emoji} {cycleStatus.status}
            </p>
          </CardContent>
        </Card>
        <Card className="border-primary/20">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground mb-1">Next Expected</p>
            <p className="text-lg font-bold text-foreground">
              {periodData.nextExpectedDate 
                ? new Date(periodData.nextExpectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                : "Mark dates to predict"
              }
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 justify-center text-sm">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-primary" />
          <span className="text-muted-foreground">Period Days</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-accent border-2 border-dashed border-primary/50" />
          <span className="text-muted-foreground">Expected Next Period</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded ring-2 ring-primary ring-offset-1" />
          <span className="text-muted-foreground">Today</span>
        </div>
      </div>
    </div>
  );
}
