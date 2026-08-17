"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Calendar,
  Flag,
  Repeat,
  CornerDownLeft,
  Sparkles,
  HelpCircle,
  X,
  SlidersHorizontal,
} from "lucide-react";
import { parseTaskInput } from "@/lib/shortcutParser";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

interface QuickAddInputProps {
  onSubmitted?: () => void;
  defaultSectionId?: string;
  defaultProjectId?: string;
  defaultDueDate?: string | null;
}

export function QuickAddInput({
  onSubmitted,
  defaultSectionId,
  defaultProjectId,
  defaultDueDate,
}: QuickAddInputProps) {
  const [text, setText] = useState("");
  const [clearedDefaultDueDate, setClearedDefaultDueDate] = useState(false);
  const addTask = useAppStore((state) => state.addTask);
  const setSelectedTaskId = useAppStore((state) => state.setSelectedTaskId);

  // Reset cleared default date if input is reset or changed empty
  useEffect(() => {
    if (!text.trim()) {
      setClearedDefaultDueDate(false);
    }
  }, [text]);

  const parsed = useMemo(() => {
    return parseTaskInput(text);
  }, [text]);

  const effectiveDueDate = clearedDefaultDueDate
    ? parsed.dueDate
    : parsed.dueDate || defaultDueDate || null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!parsed.cleanTitle.trim()) return;

    addTask({
      title: parsed.cleanTitle,
      dueDate: effectiveDueDate,
      priority: parsed.priority,
      recurrence: parsed.recurrence,
      sectionId: defaultSectionId || null,
      projectId: defaultProjectId || null,
    });

    setText("");
    setClearedDefaultDueDate(false);
    onSubmitted?.();
  };

  const handleOpenDetails = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!parsed.cleanTitle.trim()) return;

    const newTask = addTask({
      title: parsed.cleanTitle,
      dueDate: effectiveDueDate,
      priority: parsed.priority,
      recurrence: parsed.recurrence,
      sectionId: defaultSectionId || null,
      projectId: defaultProjectId || null,
    });

    setText("");
    setClearedDefaultDueDate(false);
    onSubmitted?.();

    // Immediately open detail panel sidebar for full manual editing
    setSelectedTaskId(newTask.id);
  };

  // Find typed !commands inside text
  const matchedCommands = useMemo(() => {
    const matches: string[] = [];
    const commandRegex = /(?:^|\s)(!(?:p[1-4]|today|tomorrow|yesterday|every-[a-z]+|daily|weekdays|weekend))(?:\s|$)/gi;
    let match;
    while ((match = commandRegex.exec(text)) !== null) {
      if (match[1] && !matches.includes(match[1].toLowerCase())) {
        matches.push(match[1].toLowerCase());
      }
    }
    return matches;
  }, [text]);

  // Command Chip Removal Handlers
  const handleRemoveDateChip = () => {
    setText((prev) =>
      prev
        .replace(/(?:^|\s)!(today|tomorrow|yesterday)(?:\s|$)/gi, " ")
        .replace(/\s+/g, " ")
        .trim()
    );
    if (defaultDueDate) {
      setClearedDefaultDueDate(true);
    }
  };

  const handleRemovePriorityChip = () => {
    setText((prev) =>
      prev
        .replace(/(?:^|\s)!p[1-4](?:\s|$)/gi, " ")
        .replace(/\s+/g, " ")
        .trim()
    );
  };

  const handleRemoveRecurrenceChip = () => {
    setText((prev) =>
      prev
        .replace(
          /(?:^|\s)!(every-day|daily|weekdays|weekend|every-monday|every-tuesday|every-wednesday|every-thursday|every-friday|every-saturday|every-sunday)(?:\s|$)/gi,
          " "
        )
        .replace(/\s+/g, " ")
        .trim()
    );
  };

  const handleRemoveSingleCommand = (commandStr: string) => {
    const escaped = commandStr.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
    const reg = new RegExp(`(?:^|\\s)${escaped}(?:\\s|$)`, "gi");
    setText((prev) => prev.replace(reg, " ").replace(/\s+/g, " ").trim());
  };

  const hasDetectedShortcuts =
    effectiveDueDate !== null ||
    parsed.priority < 4 ||
    parsed.recurrence !== null;

  // Helper for typed command badge style
  const getCommandBadgeStyle = (cmd: string) => {
    if (cmd.startsWith("!p1")) {
      return "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-200";
    }
    if (cmd.startsWith("!p2")) {
      return "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200";
    }
    if (cmd.startsWith("!p3")) {
      return "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-800 dark:bg-sky-950 dark:text-sky-200";
    }
    if (cmd.startsWith("!today") || cmd.startsWith("!tomorrow") || cmd.startsWith("!yesterday")) {
      return "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-200";
    }
    return "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-800 dark:bg-purple-950 dark:text-purple-200";
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-2 select-none">
      <div className="relative flex flex-col">
        <div className="relative flex items-center">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add task... (e.g. Finish report !today !p1)"
            autoFocus
            className="w-full h-11 pl-4 pr-24 rounded-sm border border-border bg-background text-sm text-foreground placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-primary-500 shadow-none"
          />

          {/* Action Group inside Input: Tooltip Help '?' + Edit Details Button + Submit Button */}
          <div className="absolute right-1.5 flex items-center gap-1">
            {/* Shortcut Help Popover Trigger */}
            <div className="relative group">
              <button
                type="button"
                aria-label="Shortcut help"
                className="w-7 h-7 rounded-sm bg-transparent text-neutral-400 hover:text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center justify-center cursor-pointer text-xs font-semibold"
              >
                <HelpCircle className="w-3.5 h-3.5" />
              </button>

              {/* Hover Popover Tooltip */}
              <div className="absolute right-0 top-full mt-2 w-64 p-3 rounded-md border border-border bg-surface shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-150 z-50 text-xs space-y-2">
                <div className="font-semibold text-foreground border-b border-border pb-1">
                  Shortcut Cheat Sheet
                </div>
                <div className="space-y-1.5 text-neutral-600 dark:text-neutral-300">
                  <div className="flex justify-between items-center">
                    <code className="font-mono text-primary-600 dark:text-primary-400 font-bold">
                      !today / !tomorrow
                    </code>
                    <span className="text-[11px] text-neutral-400">Due Date</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <code className="font-mono text-primary-600 dark:text-primary-400 font-bold">
                      !p1 .. !p4
                    </code>
                    <span className="text-[11px] text-neutral-400">Priority</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <code className="font-mono text-primary-600 dark:text-primary-400 font-bold">
                      !every-monday
                    </code>
                    <span className="text-[11px] text-neutral-400">Recurrence</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <code className="font-mono text-primary-600 dark:text-primary-400 font-bold">
                      !daily / !weekdays
                    </code>
                    <span className="text-[11px] text-neutral-400">Recurrence</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Manual Edit & Details Button (Opens Slide-over Sidebar) */}
            <button
              type="button"
              onClick={handleOpenDetails}
              disabled={!parsed.cleanTitle.trim()}
              aria-label="Edit task details & deadline"
              title="Create task and open full edit panel"
              className="w-7 h-7 rounded-sm bg-transparent text-neutral-400 hover:text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-40 transition-colors flex items-center justify-center cursor-pointer text-xs font-semibold"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </button>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!parsed.cleanTitle.trim()}
              aria-label="Add task"
              className="w-7 h-7 rounded-sm bg-primary-600 hover:bg-primary-700 active:bg-primary-800 disabled:opacity-40 text-white flex items-center justify-center transition-colors shadow-none cursor-pointer"
            >
              <CornerDownLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Typed !Commands Solid Colored Box Badges Bar */}
        {matchedCommands.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 mt-1.5 px-1">
            <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
              Typed Commands:
            </span>
            {matchedCommands.map((cmd) => (
              <span
                key={cmd}
                className={cn(
                  "inline-flex items-center gap-1 px-2 py-0.5 rounded-sm border font-mono text-xs font-bold shadow-2xs",
                  getCommandBadgeStyle(cmd)
                )}
              >
                <span>{cmd}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSingleCommand(cmd)}
                  aria-label={`Remove ${cmd}`}
                  className="p-0.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Live Interactive Detected Shortcuts Solid Color Chips */}
      {hasDetectedShortcuts && (
        <div className="flex flex-wrap items-center gap-2 text-xs pt-0.5">
          <span className="text-neutral-400 font-medium flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-primary-500" />
            Detected:
          </span>

          {/* Due Date Chip (Solid Blue/Indigo) */}
          {effectiveDueDate && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-sm border border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-200 font-semibold shadow-2xs">
              <Calendar className="w-3 h-3 text-blue-600 dark:text-blue-400" />
              <span>Due {effectiveDueDate}</span>
              <button
                type="button"
                onClick={handleRemoveDateChip}
                aria-label="Remove due date"
                className="p-0.5 rounded-full hover:bg-blue-200 dark:hover:bg-blue-900 text-blue-700 dark:text-blue-300 transition-colors cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {/* Priority Chip (Solid Red/Amber/Sky/Neutral) */}
          {parsed.priority < 4 && (
            <span
              className={cn(
                "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-sm border font-semibold shadow-2xs",
                parsed.priority === 1
                  ? "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-200"
                  : parsed.priority === 2
                  ? "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200"
                  : "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900 dark:bg-sky-950 dark:text-sky-200"
              )}
            >
              <Flag className="w-3 h-3" />
              <span>P{parsed.priority}</span>
              <button
                type="button"
                onClick={handleRemovePriorityChip}
                aria-label="Remove priority"
                className="p-0.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {/* Recurrence Chip (Solid Purple) */}
          {parsed.recurrence && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-sm border border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-900 dark:bg-purple-950 dark:text-purple-200 font-semibold shadow-2xs">
              <Repeat className="w-3 h-3 text-purple-600 dark:text-purple-400" />
              <span className="capitalize">{parsed.recurrence}</span>
              <button
                type="button"
                onClick={handleRemoveRecurrenceChip}
                aria-label="Remove recurrence"
                className="p-0.5 rounded-full hover:bg-purple-200 dark:hover:bg-purple-900 text-purple-700 dark:text-purple-300 transition-colors cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </form>
  );
}
