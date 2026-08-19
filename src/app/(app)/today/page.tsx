"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar as CalendarIcon,
  AlertCircle,
  ChevronRight,
  ChevronDown,
  CheckCircle2,
} from "lucide-react";
import { format } from "date-fns";
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

import Link from "next/link";
import { getTodayISO } from "@/lib/utils";

export default function TodayPage() {
  const tasks = useAppStore((state) => state.tasks);
  const [showCompleted, setShowCompleted] = useState(false);
  const [filters, setFilters] = useState<TaskFilterState>(defaultTaskFilterState);

  const todayISO = getTodayISO();

  const filteredTasks = filterTasks(tasks, filters);

  // Overdue tasks that moved to Backlog
  const overdueMovedCount = filteredTasks.filter(
    (t) => !t.completed && t.dueDate && t.dueDate < todayISO
  ).length;

  // Today tasks: dueDate === todayISO and not completed
  const todayTasks = filteredTasks.filter(
    (t) => !t.completed && t.dueDate === todayISO
  );

  // Completed tasks due today
  const completedTodayTasks = filteredTasks.filter(
    (t) => t.completed && t.dueDate && t.dueDate === todayISO
  );

  const totalPending = todayTasks.length;

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* Page Heading */}
      <div className="flex items-center justify-between border-b border-border pb-3">
        <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          <span>Today</span>
        </h1>
        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-sm bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300 border border-primary-200 dark:border-primary-800">
          {totalPending} {totalPending === 1 ? "task" : "tasks"}
        </span>
      </div>

      {/* Quick Add Input (Automatically defaults to Today's date!) */}
      <QuickAddInput defaultDueDate={todayISO} />

      {/* Filter Bar */}
      <FilterBar filters={filters} onFilterChange={setFilters} />

      {/* Overdue Notice Banner (Overdue tasks move to Backlog page) */}
      {overdueMovedCount > 0 && (
        <div className="rounded-md border border-amber-200 bg-amber-50 dark:border-amber-900/60 dark:bg-amber-950/40 p-3 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-medium">
            <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>
              <strong>{overdueMovedCount}</strong> {overdueMovedCount === 1 ? "task" : "tasks"} missed {overdueMovedCount === 1 ? "its" : "their"} due date and moved to <strong>Backlog</strong>.
            </span>
          </div>
          <Link
            href="/backlog"
            className="px-2.5 py-1 rounded-sm bg-amber-600 hover:bg-amber-700 text-white font-semibold text-[11px] transition-colors shrink-0 shadow-2xs"
          >
            View Backlog
          </Link>
        </div>
      )}


      {/* Today Tasks Section */}
      <div className="space-y-2">
        {todayTasks.length > 0 ? (
          <div className="space-y-2">
            <AnimatePresence initial={false}>
              {todayTasks.map((task) => (
                <TaskItem key={task.id} task={task} />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <EmptyState
            title="Nothing due today"
            subtitle="Enjoy your day, or use the quick add input above to schedule new tasks!"
            icon={<CheckCircle2 className="w-5 h-5 text-primary-500" />}
          />
        )}
      </div>

      {/* Completed Tasks Collapsible Section */}
      {completedTodayTasks.length > 0 && (
        <div className="pt-3 border-t border-border space-y-2">
          <button
            type="button"
            onClick={() => setShowCompleted(!showCompleted)}
            className="flex items-center gap-2 text-xs font-semibold text-neutral-500 hover:text-foreground transition-colors cursor-pointer select-none"
          >
            {showCompleted ? (
              <ChevronDown className="w-3.5 h-3.5" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5" />
            )}
            <span>Completed ({completedTodayTasks.length})</span>
          </button>

          {showCompleted && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2 pt-1"
            >
              {completedTodayTasks.map((task) => (
                <TaskItem key={task.id} task={task} />
              ))}
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
