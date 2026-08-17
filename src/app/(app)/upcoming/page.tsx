"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarDays,
  ChevronDown,
  ChevronRight,
  Calendar,
} from "lucide-react";
import { addDays, format } from "date-fns";
import { useAppStore } from "@/lib/store";
import { QuickAddInput } from "@/components/tasks/QuickAddInput";
import { TaskItem } from "@/components/tasks/TaskItem";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  FilterBar,
  TaskFilterState,
  defaultTaskFilterState,
  filterTasks,
} from "@/components/tasks/FilterBar";

export default function UpcomingPage() {
  const tasks = useAppStore((state) => state.tasks);
  const [collapsedDates, setCollapsedDates] = useState<Record<string, boolean>>({});
  const [filters, setFilters] = useState<TaskFilterState>(defaultTaskFilterState);

  const now = new Date();
  
  // Next 7 days (starting from tomorrow)
  const next7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = addDays(now, i + 1);
    const iso = format(d, "yyyy-MM-dd");
    const dayLabel = i === 0 ? "Tomorrow" : format(d, "EEEE");
    const fullLabel = `${dayLabel}, ${format(d, "MMM d")}`;
    return { date: d, iso, dayLabel, fullLabel };
  });

  const toggleDateCollapse = (iso: string) => {
    setCollapsedDates((prev) => ({ ...prev, [iso]: !prev[iso] }));
  };

  const filteredTasks = filterTasks(tasks, filters);

  const totalUpcomingTasks = filteredTasks.filter(
    (t) =>
      !t.completed &&
      t.dueDate &&
      next7Days.some((day) => day.iso === t.dueDate)
  ).length;

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* Page Heading */}
      <div className="flex items-center justify-between border-b border-border pb-3">
        <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          <span>Upcoming</span>
        </h1>
        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-sm bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300 border border-primary-200 dark:border-primary-800">
          {totalUpcomingTasks} {totalUpcomingTasks === 1 ? "task" : "tasks"}
        </span>
      </div>

      {/* Global Quick Add Input */}
      <QuickAddInput />

      {/* Filter Bar */}
      <FilterBar filters={filters} onFilterChange={setFilters} />

      {/* 7 Days Grouped Sections */}
      <div className="space-y-4">
        {next7Days.map((day) => {
          const dayTasks = filteredTasks.filter(
            (t) => !t.completed && t.dueDate === day.iso
          );
          const isCollapsed = !!collapsedDates[day.iso];

          return (
            <div
              key={day.iso}
              className="rounded-md border border-border bg-surface p-3 space-y-2 shadow-2xs"
            >
              {/* Collapsible Section Header */}
              <button
                type="button"
                onClick={() => toggleDateCollapse(day.iso)}
                className="w-full flex items-center justify-between text-left cursor-pointer group select-none"
              >
                <div className="flex items-center gap-2">
                  <div className="text-neutral-400 group-hover:text-foreground transition-colors">
                    {isCollapsed ? (
                      <ChevronRight className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </div>
                  <h2 className="text-sm font-semibold text-foreground group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {day.fullLabel}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-medium px-1.5 py-0.5 rounded-sm bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                    {dayTasks.length}
                  </span>
                </div>
              </button>

              {/* Task Items under this date */}
              {!isCollapsed && (
                <div className="pt-1 space-y-2">
                  {dayTasks.length > 0 ? (
                    <AnimatePresence initial={false}>
                      {dayTasks.map((task) => (
                        <TaskItem key={task.id} task={task} />
                      ))}
                    </AnimatePresence>
                  ) : (
                    <p className="text-xs text-neutral-400 italic py-1 pl-6">
                      No tasks scheduled for {day.dayLabel.toLowerCase()}.
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {totalUpcomingTasks === 0 && (
        <EmptyState
          title="No upcoming tasks"
          subtitle="Your schedule for the next week is completely clear."
          icon={<Calendar className="w-5 h-5 text-primary-500" />}
        />
      )}
    </div>
  );
}
