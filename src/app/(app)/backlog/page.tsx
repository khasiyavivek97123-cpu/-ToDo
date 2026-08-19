"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, ChevronDown, ChevronRight, Calendar, AlertCircle } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { QuickAddInput } from "@/components/tasks/QuickAddInput";
import { TaskItem } from "@/components/tasks/TaskItem";
import { EmptyState } from "@/components/ui/EmptyState";
import { getTodayISO, isTaskOverdue, sortByPriority } from "@/lib/utils";
import { groupTasksByDate } from "@/lib/grouping";
import {
  FilterBar,
  TaskFilterState,
  defaultTaskFilterState,
  filterTasks,
} from "@/components/tasks/FilterBar";

export default function BacklogPage() {
  const tasks = useAppStore((state) => state.tasks);
  const updateTask = useAppStore((state) => state.updateTask);
  const [showCompleted, setShowCompleted] = useState(false);
  const [schedulingTaskId, setSchedulingTaskId] = useState<string | null>(null);
  const [filters, setFilters] = useState<TaskFilterState>(defaultTaskFilterState);

  const todayISO = getTodayISO();
  const filteredTasks = filterTasks(tasks, filters);

  // Active backlog tasks: unscheduled OR overdue tasks
  const activeBacklogTasks = filteredTasks.filter(
    (t) => !t.completed && (!t.dueDate || isTaskOverdue(t, todayISO))
  );

  const overdueCount = activeBacklogTasks.filter((t) => isTaskOverdue(t, todayISO)).length;

  // Completed backlog tasks
  const completedBacklogTasks = sortByPriority(
    filteredTasks.filter(
      (t) => t.completed && (!t.dueDate || t.dueDate < todayISO)
    )
  );

  // Date-grouped active backlog tasks (Overdue, Today, Tomorrow, dd/mm/yyyy, No Due Date)
  const groupedBacklogTasks = groupTasksByDate(activeBacklogTasks);

  const handleScheduleDate = (taskId: string, dateStr: string) => {
    if (!dateStr) return;
    updateTask(taskId, { dueDate: dateStr });
    setSchedulingTaskId(null);
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto select-none">
      {/* Page Heading */}
      <div className="flex items-center justify-between border-b border-border pb-3">
        <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Layers className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          <span>Backlog</span>
        </h1>
        <div className="flex items-center gap-2">
          {overdueCount > 0 && (
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-sm bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300 border border-red-200 dark:border-red-800 flex items-center gap-1">
              <AlertCircle className="w-3 h-3 text-red-600 dark:text-red-400" />
              <span>{overdueCount} overdue</span>
            </span>
          )}
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-sm bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300 border border-primary-200 dark:border-primary-800">
            {activeBacklogTasks.length} {activeBacklogTasks.length === 1 ? "task" : "tasks"}
          </span>
        </div>
      </div>

      {/* Quick Add Input */}
      <QuickAddInput />

      {/* Filter Bar */}
      <FilterBar filters={filters} onFilterChange={setFilters} />

      {/* Active Backlog Tasks List Grouped By Date */}
      <div className="space-y-5">
        {activeBacklogTasks.length > 0 ? (
          groupedBacklogTasks.map((group) => (
            <div key={group.key} className="space-y-2">
              {/* Group Subheading with Light Gray Divider Line & Task Count Pill */}
              <div className="flex items-center gap-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                <span className="shrink-0 text-foreground font-bold text-xs tracking-tight">
                  {group.label}
                </span>
                <div className="h-[1px] flex-1 bg-neutral-200 dark:bg-neutral-800" />
                <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-sm bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">
                  {group.tasks.length} {group.tasks.length === 1 ? "task" : "tasks"}
                </span>
              </div>

              {/* Group Task Items with Inline Schedule Action */}
              <div className="space-y-2">
                <AnimatePresence initial={false}>
                  {group.tasks.map((task) => (
                    <div key={task.id} className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <div className="flex-1 min-w-0">
                        <TaskItem task={task} />
                      </div>

                      {/* Inline Reschedule / Schedule Picker */}
                      <div className="shrink-0 pl-11 sm:pl-0">
                        {schedulingTaskId === task.id ? (
                          <input
                            type="date"
                            autoFocus
                            onBlur={() => setSchedulingTaskId(null)}
                            onChange={(e) => handleScheduleDate(task.id, e.target.value)}
                            className="h-8 px-2 rounded-sm border border-primary-500 bg-background text-xs text-foreground focus:outline-none"
                          />
                        ) : (
                          <button
                            type="button"
                            onClick={() => setSchedulingTaskId(task.id)}
                            className="inline-flex items-center gap-1.5 h-8 px-2.5 rounded-sm border border-border bg-surface hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 text-xs font-medium transition-colors cursor-pointer"
                          >
                            <Calendar className="w-3.5 h-3.5 text-primary-500" />
                            <span>Schedule</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          ))
        ) : (
          <EmptyState
            imageSrc="/assets/images/empty-state-backlog.png"
            title="Backlog is empty"
            subtitle="No unscheduled or overdue tasks! All your items are on track."
          />
        )}
      </div>

      {/* Completed Tasks Collapsible Section */}
      {completedBacklogTasks.length > 0 && (
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
            <span>Completed ({completedBacklogTasks.length})</span>
          </button>

          {showCompleted && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2 pt-1"
            >
              {completedBacklogTasks.map((task) => (
                <TaskItem key={task.id} task={task} />
              ))}
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
