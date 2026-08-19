"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronDown, Inbox as InboxIcon } from "lucide-react";
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

import { getTodayISO, isTaskOverdue, sortByPriority } from "@/lib/utils";

export default function InboxPage() {
  const tasks = useAppStore((state) => state.tasks);
  const [showCompleted, setShowCompleted] = useState(false);
  const [filters, setFilters] = useState<TaskFilterState>(defaultTaskFilterState);

  const todayISO = getTodayISO();

  // Filter tasks with no project assigned
  const inboxTasks = tasks.filter((t) => !t.projectId);
  const filteredInboxTasks = filterTasks(inboxTasks, filters);

  // Active inbox tasks exclude overdue tasks (which move to Backlog) sorted by priority P1 -> P4
  const activeTasks = sortByPriority(
    filteredInboxTasks.filter(
      (t) => !t.completed && !isTaskOverdue(t, todayISO)
    )
  );
  const completedTasks = sortByPriority(
    filteredInboxTasks.filter((t) => t.completed)
  );



  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* Page Heading */}
      <div className="flex items-center justify-between border-b border-border pb-3">
        <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <InboxIcon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          <span>Inbox</span>
        </h1>
        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-sm bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300 border border-primary-200 dark:border-primary-800">
          {activeTasks.length} {activeTasks.length === 1 ? "task" : "tasks"}
        </span>
      </div>

      {/* Quick Add Input */}
      <QuickAddInput />

      {/* Filter Bar */}
      <FilterBar filters={filters} onFilterChange={setFilters} />

      {/* Active Tasks List */}
      <div className="space-y-2">
        {activeTasks.length > 0 ? (
          <div className="space-y-2">
            <AnimatePresence initial={false}>
              {activeTasks.map((task) => (
                <TaskItem key={task.id} task={task} />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <EmptyState
            imageSrc="/assets/images/empty-state-inbox.png"
            title="Your inbox is clear"
            subtitle="You're all caught up! Use the quick add input above to capture new tasks."
          />
        )}
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
