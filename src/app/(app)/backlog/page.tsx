"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, ChevronDown, ChevronRight, Calendar, AlertCircle } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { QuickAddInput } from "@/components/tasks/QuickAddInput";
import { TaskItem } from "@/components/tasks/TaskItem";
import { EmptyState } from "@/components/ui/EmptyState";
import { getTodayISO, isTaskOverdue, sortByPriority } from "@/lib/utils";
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

  // Overdue active tasks (moved to Backlog) sorted by priority
  const overdueTasks = sortByPriority(
    filteredTasks.filter((t) => isTaskOverdue(t, todayISO))
  );

  // Unscheduled active tasks (no dueDate) sorted by priority
  const unscheduledTasks = sortByPriority(
    filteredTasks.filter((t) => !t.completed && !t.dueDate)
  );

  // Total active backlog tasks sorted by priority
  const activeTasks = sortByPriority([...overdueTasks, ...unscheduledTasks]);

  // Completed backlog tasks sorted by priority
  const completedTasks = sortByPriority(
    filteredTasks.filter(
      (t) => t.completed && (!t.dueDate || t.dueDate < todayISO)
    )
  );


  const handleScheduleDate = (taskId: string, dateStr: string) => {
    if (!dateStr) return;
    updateTask(taskId, { dueDate: dateStr });
    setSchedulingTaskId(null);
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* Page Heading */}
      <div className="flex items-center justify-between border-b border-border pb-3">
        <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Layers className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          <span>Backlog</span>
        </h1>
        <div className="flex items-center gap-2">
          {overdueTasks.length > 0 && (
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-sm bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300 border border-red-200 dark:border-red-800 flex items-center gap-1">
              <AlertCircle className="w-3 h-3 text-red-600 dark:text-red-400" />
              <span>{overdueTasks.length} overdue moved here</span>
            </span>
          )}
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-sm bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300 border border-primary-200 dark:border-primary-800">
            {activeTasks.length} {activeTasks.length === 1 ? "task" : "tasks"}
          </span>
        </div>
      </div>

      {/* Quick Add Input */}
      <QuickAddInput />

      {/* Filter Bar */}
      <FilterBar filters={filters} onFilterChange={setFilters} />

      {/* Active Backlog Tasks List with Inline Schedule Controls */}
      <div className="space-y-4">
        {/* Overdue Section Header if overdue tasks present */}
        {overdueTasks.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Overdue Tasks ({overdueTasks.length})</span>
            </div>
            <div className="space-y-2">
              <AnimatePresence initial={false}>
                {overdueTasks.map((task) => (
                  <div key={task.id} className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <div className="flex-1">
                      <TaskItem task={task} />
                    </div>

                    {/* Schedule/Reschedule Action Button */}
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
                          className="inline-flex items-center gap-1.5 h-8 px-2.5 rounded-sm border border-red-200 bg-red-50 hover:bg-red-100 dark:border-red-900 dark:bg-red-950 dark:hover:bg-red-900 text-red-700 dark:text-red-300 text-xs font-medium transition-colors cursor-pointer"
                        >
                          <Calendar className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                          <span>Reschedule</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Unscheduled Section Header if overdue tasks also present */}
        {unscheduledTasks.length > 0 ? (
          <div className="space-y-2">
            {overdueTasks.length > 0 && (
              <div className="flex items-center gap-2 text-xs font-bold text-neutral-500 uppercase tracking-wider pt-2 border-t border-border">
                <Layers className="w-3.5 h-3.5" />
                <span>Unscheduled Backlog ({unscheduledTasks.length})</span>
              </div>
            )}
            <div className="space-y-2">
              <AnimatePresence initial={false}>
                {unscheduledTasks.map((task) => (
                  <div key={task.id} className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <div className="flex-1">
                      <TaskItem task={task} />
                    </div>

                    {/* Schedule Action Button / Date Picker */}
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
        ) : overdueTasks.length === 0 ? (
          <EmptyState
            imageSrc="/assets/images/empty-state-backlog.png"
            title="Backlog is empty"
            subtitle="No unscheduled or overdue tasks! All your items are on track."
          />
        ) : null}
      </div>

      {/* Completed Tasks Collapsible Section */}
      {completedTasks.length > 0 && (
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
            <span>Completed ({completedTasks.length})</span>
          </button>

          {showCompleted && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2 pt-1"
            >
              {completedTasks.map((task) => (
                <TaskItem key={task.id} task={task} />
              ))}
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}

