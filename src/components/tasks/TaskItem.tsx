"use client";

import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  Repeat,
  Paperclip,
  Trash2,
  Edit2,
  Folder,
  AlertCircle,
} from "lucide-react";
import { Task } from "@/lib/types";
import { useAppStore } from "@/lib/store";
import { cn, isTaskOverdue, formatOverdueIndicator, getTodayISO } from "@/lib/utils";

interface TaskItemProps {
  task: Task;
}

export function TaskItem({ task }: TaskItemProps) {
  const toggleComplete = useAppStore((state) => state.toggleComplete);
  const deleteTask = useAppStore((state) => state.deleteTask);
  const setSelectedTaskId = useAppStore((state) => state.setSelectedTaskId);
  const sections = useAppStore((state) => state.sections);
  const projects = useAppStore((state) => state.projects);

  const matchedSection = sections.find((s) => s.id === task.sectionId);
  const matchedProject = projects.find((p) => p.id === task.projectId);

  const todayISO = getTodayISO();
  const overdue = isTaskOverdue(task, todayISO);

  const getPriorityBadge = (priority: number) => {
    switch (priority) {
      case 1:
        return "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800 font-semibold";
      case 2:
        return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800 font-semibold";
      case 3:
        return "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950 dark:text-sky-300 dark:border-sky-800 font-semibold";
      default:
        return "bg-neutral-100 text-neutral-600 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-700 font-semibold";
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className={cn(
        "group flex items-center justify-between gap-3 px-4 py-3 rounded-md border bg-surface hover:bg-neutral-100 dark:hover:bg-neutral-800/50 hover:shadow-[inset_0_1px_3px_rgba(0,0,0,0.06)] dark:hover:shadow-[inset_0_1px_3px_rgba(0,0,0,0.4)] transition-all shadow-2xs",
        overdue ? "border-red-300 dark:border-red-900/60 bg-red-50/30 dark:bg-red-950/20" : "border-border"
      )}
    >
      {/* Left: Checkbox + Title + Meta */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {/* Animated Checkbox */}
        <motion.button
          type="button"
          whileTap={{ scale: 0.88 }}
          onClick={() => toggleComplete(task.id)}
          aria-label={task.completed ? "Mark incomplete" : "Mark complete"}
          className={cn(
            "w-5 h-5 rounded-full border flex items-center justify-center transition-all shrink-0 cursor-pointer",
            task.completed
              ? "bg-primary-600 border-primary-600 dark:bg-primary-500 dark:border-primary-500 shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)]"
              : "border-neutral-300 dark:border-neutral-600 hover:border-primary-500 hover:shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]"
          )}
        >
          <motion.svg
            className="w-3 h-3 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <motion.path
              d="M20 6L9 17l-5-5"
              initial={false}
              animate={{
                pathLength: task.completed ? 1 : 0,
                opacity: task.completed ? 1 : 0,
              }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            />
          </motion.svg>
        </motion.button>

        {/* Task Title & Metadata info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              onClick={() => setSelectedTaskId(task.id)}
              className={cn(
                "text-sm font-medium transition-colors cursor-pointer truncate",
                task.completed
                  ? "line-through text-neutral-400 dark:text-neutral-500"
                  : "text-foreground hover:text-primary-700 dark:hover:text-primary-300"
              )}
            >
              {task.title}
            </span>

            {/* Section / Project Label */}
            {(matchedSection || matchedProject) && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-neutral-600 dark:text-neutral-400">
                <Folder className="w-3 h-3 text-primary-500 shrink-0" />
                <span>{matchedSection?.name || matchedProject?.name}</span>
              </span>
            )}
          </div>

          {/* Priority, Due Date & Recurrence Metadata Badges */}
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            {/* Priority Badge */}
            <span
              className={cn(
                "px-2 py-0.5 rounded-sm border text-[11px] tracking-tight shadow-2xs",
                getPriorityBadge(task.priority)
              )}
            >
              P{task.priority}
            </span>

            {/* Due Date & Deadline Time Pill with Overdue indicator */}
            {task.dueDate && (
              <span
                className={cn(
                  "inline-flex items-center gap-1 px-2 py-0.5 rounded-sm border text-[11px] font-semibold shadow-2xs",
                  overdue
                    ? "border-red-300 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300"
                    : "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-200"
                )}
              >
                {overdue ? (
                  <AlertCircle className="w-3 h-3 text-red-600 dark:text-red-400 shrink-0" />
                ) : task.dueTime ? (
                  <Clock className="w-3 h-3 text-blue-600 dark:text-blue-400 shrink-0" />
                ) : (
                  <Calendar className="w-3 h-3 text-blue-600 dark:text-blue-400 shrink-0" />
                )}
                <span>
                  {task.dueDate}
                  {task.dueTime ? ` @ ${task.dueTime}` : ""}
                </span>
                {overdue && (
                  <span className="ml-1 pl-1 border-l border-red-300 dark:border-red-800 font-bold text-red-700 dark:text-red-300">
                    • {formatOverdueIndicator(task.dueDate, todayISO)}
                  </span>
                )}
              </span>
            )}

            {/* Recurrence Indicator */}
            {task.recurrence && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm border border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-900 dark:bg-purple-950 dark:text-purple-200 text-[11px] font-semibold capitalize shadow-2xs">
                <Repeat className="w-3 h-3 text-purple-600 dark:text-purple-400 shrink-0" />
                <span>{task.recurrence}</span>
              </span>
            )}

            {/* Attachments Count */}
            {task.attachments && task.attachments.length > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm border border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 text-[11px] font-semibold shadow-2xs">
                <Paperclip className="w-3 h-3 text-neutral-500" />
                <span>{task.attachments.length}</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right Actions: Edit & Delete (Visible on Hover) */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          onClick={() => setSelectedTaskId(task.id)}
          aria-label="Edit task details"
          className="p-1.5 rounded-sm text-neutral-400 hover:text-foreground hover:bg-neutral-200/60 dark:hover:bg-neutral-800 hover:shadow-[inset_0_1px_2px_rgba(0,0,0,0.08)] transition-all cursor-pointer"
        >
          <Edit2 className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => deleteTask(task.id)}
          aria-label="Delete task"
          className="p-1.5 rounded-sm text-neutral-400 hover:text-red-500 hover:bg-neutral-200/60 dark:hover:bg-neutral-800 hover:shadow-[inset_0_1px_2px_rgba(0,0,0,0.08)] transition-all cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
}
