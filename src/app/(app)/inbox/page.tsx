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
import { sortByPriority } from "@/lib/utils";
import { groupTasksByDate } from "@/lib/grouping";

export default function InboxPage() {
  const tasks = useAppStore((state) => state.tasks);
  const [showCompleted, setShowCompleted] = useState(false);
  const [filters, setFilters] = useState<TaskFilterState>(defaultTaskFilterState);

  // Inbox tasks: tasks without a project assigned
  const inboxTasks = tasks.filter((t) => !t.projectId);
  const filteredInboxTasks = filterTasks(inboxTasks, filters);

  const activeInboxTasks = filteredInboxTasks.filter((t) => !t.completed);
  const completedInboxTasks = sortByPriority(filteredInboxTasks.filter((t) => t.completed));

  // Date-grouped active tasks (Today, Tomorrow, dd/mm/yyyy, No Due Date)
  const groupedActiveTasks = groupTasksByDate(activeInboxTasks);

  return (
    <div className="space-y-4 max-w-4xl mx-auto select-none">
      {/* Page Heading */}
      <div className="flex items-center justify-between border-b border-border pb-3">
        <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <InboxIcon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          <span>Inbox</span>
        </h1>
        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-sm bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300 border border-primary-200 dark:border-primary-800">
          {activeInboxTasks.length} {activeInboxTasks.length === 1 ? "task" : "tasks"}
        </span>
      </div>

      {/* Quick Add Input */}
      <QuickAddInput />

      {/* Filter Bar */}
      <FilterBar filters={filters} onFilterChange={setFilters} />

      {/* Active Tasks List Grouped By Date */}
      <div className="space-y-5">
        {activeInboxTasks.length > 0 ? (
          groupedActiveTasks.map((group) => (
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

              {/* Group Task Items */}
              <div className="space-y-2">
                <AnimatePresence initial={false}>
                  {group.tasks.map((task) => (
                    <TaskItem key={task.id} task={task} />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          ))
        ) : (
          <EmptyState
            imageSrc="/assets/images/empty-state-inbox.png"
            title="Your inbox is clear"
            subtitle="You're all caught up! Use the quick add input above to capture new tasks."
          />
        )}
      </div>

      {/* Completed Tasks Collapsible Section */}
      {completedInboxTasks.length > 0 && (
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
            <span>Completed ({completedInboxTasks.length})</span>
          </button>

          {showCompleted && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2 pt-1"
            >
              {completedInboxTasks.map((task) => (
                <TaskItem key={task.id} task={task} />
              ))}
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
