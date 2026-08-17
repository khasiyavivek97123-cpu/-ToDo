"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Trash2,
  Calendar,
  Clock,
  Flag,
  Repeat,
  Hash,
  Paperclip,
  Plus,
  FileText,
  ExternalLink,
  CheckCircle2,
  ChevronDown,
  Check,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { PriorityLevel } from "@/lib/types";
import { cn } from "@/lib/utils";

const PRIORITY_OPTIONS = [
  { value: 1, label: "P1 - Urgent", color: "text-red-600 dark:text-red-400" },
  { value: 2, label: "P2 - High", color: "text-orange-600 dark:text-orange-400" },
  { value: 3, label: "P3 - Medium", color: "text-blue-600 dark:text-blue-400" },
  { value: 4, label: "P4 - Normal", color: "text-neutral-500" },
];

const RECURRENCE_OPTIONS = [
  { value: "", label: "None (One-time Task)" },
  { value: "daily", label: "Daily (!daily)" },
  { value: "weekdays", label: "Weekdays (!weekdays)" },
  { value: "weekend", label: "Weekend (!weekend)" },
  { value: "every-monday", label: "Every Monday" },
  { value: "every-tuesday", label: "Every Tuesday" },
  { value: "every-wednesday", label: "Every Wednesday" },
  { value: "every-thursday", label: "Every Thursday" },
  { value: "every-friday", label: "Every Friday" },
  { value: "every-saturday", label: "Every Saturday" },
  { value: "every-sunday", label: "Every Sunday" },
];

export function TaskDetailPanel() {
  const selectedTaskId = useAppStore((state) => state.selectedTaskId);
  const setSelectedTaskId = useAppStore((state) => state.setSelectedTaskId);
  const tasks = useAppStore((state) => state.tasks);
  const sections = useAppStore((state) => state.sections);
  const updateTask = useAppStore((state) => state.updateTask);
  const deleteTask = useAppStore((state) => state.deleteTask);
  const toggleComplete = useAppStore((state) => state.toggleComplete);
  const addAttachmentToTask = useAppStore((state) => state.addAttachmentToTask);

  const [newAttName, setNewAttName] = useState("");
  const [newAttUrl, setNewAttUrl] = useState("");
  const [showAddAtt, setShowAddAtt] = useState(false);

  // Custom Dropdown Open States
  const [priorityOpen, setPriorityOpen] = useState(false);
  const [sectionOpen, setSectionOpen] = useState(false);
  const [recurrenceOpen, setRecurrenceOpen] = useState(false);

  const priorityRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const recurrenceRef = useRef<HTMLDivElement>(null);

  const panelRef = useRef<HTMLDivElement>(null);

  const task = tasks.find((t) => t.id === selectedTaskId);

  // Outside click handler for dropdowns
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (priorityRef.current && !priorityRef.current.contains(e.target as Node)) {
        setPriorityOpen(false);
      }
      if (sectionRef.current && !sectionRef.current.contains(e.target as Node)) {
        setSectionOpen(false);
      }
      if (recurrenceRef.current && !recurrenceRef.current.contains(e.target as Node)) {
        setRecurrenceOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close panel on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setSelectedTaskId(null);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setSelectedTaskId]);

  const handleAddAttachment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!task || !newAttName.trim() || !newAttUrl.trim()) return;

    addAttachmentToTask(task.id, {
      name: newAttName.trim(),
      url: newAttUrl.trim().startsWith("http")
        ? newAttUrl.trim()
        : `https://${newAttUrl.trim()}`,
      type: "link",
    });

    setNewAttName("");
    setNewAttUrl("");
    setShowAddAtt(false);
  };

  const selectedPriorityObj = PRIORITY_OPTIONS.find((p) => p.value === task?.priority);
  const selectedSectionObj = sections.find((s) => s.id === task?.sectionId);
  const selectedRecurrenceObj = RECURRENCE_OPTIONS.find((r) => r.value === (task?.recurrence || ""));

  return (
    <AnimatePresence>
      {selectedTaskId && task && (
        <>
          {/* Flat Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedTaskId(null)}
            className="fixed inset-0 z-40 bg-black/40"
          />

          {/* Slide-over Panel Container */}
          <motion.div
            ref={panelRef}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full sm:w-[420px] bg-background border-l border-border shadow-2xl flex flex-col font-sans overflow-hidden select-none"
          >
            {/* Panel Header */}
            <div className="h-14 px-6 border-b border-border flex items-center justify-between bg-surface shrink-0">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleComplete(task.id)}
                  aria-label={task.completed ? "Mark incomplete" : "Mark complete"}
                  className={cn(
                    "w-5 h-5 rounded-full border flex items-center justify-center transition-colors cursor-pointer",
                    task.completed
                      ? "bg-primary-600 border-primary-600 text-white"
                      : "border-neutral-300 dark:border-neutral-600 hover:border-primary-500"
                  )}
                >
                  {task.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                </button>
                <span className="text-xs font-medium text-neutral-500">
                  {task.completed ? "Completed Task" : "Active Task"}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    deleteTask(task.id);
                    setSelectedTaskId(null);
                  }}
                  aria-label="Delete task"
                  className="p-2 rounded-sm text-neutral-400 hover:text-red-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedTaskId(null)}
                  aria-label="Close panel"
                  className="p-2 rounded-sm text-neutral-400 hover:text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Form Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Editable Title */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                  Task Title
                </label>
                <input
                  type="text"
                  value={task.title}
                  onChange={(e) => updateTask(task.id, { title: e.target.value })}
                  className="w-full text-lg font-bold text-foreground bg-transparent border-b border-transparent focus:border-primary-500 focus:outline-none py-1"
                />
              </div>

              {/* Editable Notes Textarea */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                  Notes & Details
                </label>
                <textarea
                  rows={4}
                  value={task.notes || ""}
                  onChange={(e) => updateTask(task.id, { notes: e.target.value })}
                  placeholder="Add notes, sub-tasks, or details..."
                  className="w-full p-3 rounded-sm border border-border bg-background text-sm text-foreground placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-primary-500 resize-y"
                />
              </div>

              {/* Metadata Grid */}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
                {/* Due Date Picker */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-neutral-500 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-primary-500" />
                    <span>Due Date</span>
                  </label>
                  <input
                    type="date"
                    value={task.dueDate || ""}
                    onChange={(e) =>
                      updateTask(task.id, { dueDate: e.target.value || null })
                    }
                    className="w-full h-9 px-2.5 rounded-sm border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>

                {/* Due Time / Deadline Picker */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-neutral-500 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-primary-500" />
                    <span>Due Time</span>
                  </label>
                  <input
                    type="time"
                    value={task.dueTime || ""}
                    onChange={(e) =>
                      updateTask(task.id, { dueTime: e.target.value || null })
                    }
                    className="w-full h-9 px-2.5 rounded-sm border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>

                {/* Priority Custom Dropdown */}
                <div ref={priorityRef} className="space-y-1.5 relative">
                  <label className="text-xs font-medium text-neutral-500 flex items-center gap-1.5">
                    <Flag className="w-3.5 h-3.5 text-primary-500" />
                    <span>Priority</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setPriorityOpen(!priorityOpen);
                      setSectionOpen(false);
                      setRecurrenceOpen(false);
                    }}
                    className="w-full h-9 px-2.5 rounded-sm border border-border bg-background hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-medium text-foreground flex items-center justify-between gap-2 cursor-pointer focus:ring-1 focus:ring-primary-500"
                  >
                    <span className="truncate">{selectedPriorityObj?.label || "P4 - Normal"}</span>
                    <ChevronDown className={cn("w-3.5 h-3.5 text-neutral-400 transition-transform duration-200", priorityOpen && "rotate-180 text-primary-500")} />
                  </button>

                  <AnimatePresence>
                    {priorityOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 4, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 4, scale: 0.98 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="absolute left-0 top-full mt-1 w-full p-1 rounded-md border border-border bg-surface shadow-xl z-50 text-xs space-y-0.5"
                      >
                        {PRIORITY_OPTIONS.map((opt) => {
                          const isSelected = task.priority === opt.value;
                          return (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => {
                                updateTask(task.id, { priority: opt.value as PriorityLevel });
                                setPriorityOpen(false);
                              }}
                              className={cn(
                                "w-full px-2.5 py-1.5 rounded-sm text-xs font-medium flex items-center justify-between transition-colors cursor-pointer text-left",
                                isSelected
                                  ? "bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300 font-semibold"
                                  : "text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-primary-700 dark:hover:text-primary-300"
                              )}
                            >
                              <div className="flex items-center gap-2 truncate">
                                <Flag className={cn("w-3 h-3 shrink-0", opt.color)} />
                                <span>{opt.label}</span>
                              </div>
                              {isSelected && <Check className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400 shrink-0" />}
                            </button>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Section Custom Dropdown */}
                <div ref={sectionRef} className="space-y-1.5 relative">
                  <label className="text-xs font-medium text-neutral-500 flex items-center gap-1.5">
                    <Hash className="w-3.5 h-3.5 text-primary-500" />
                    <span>Section</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setSectionOpen(!sectionOpen);
                      setPriorityOpen(false);
                      setRecurrenceOpen(false);
                    }}
                    className="w-full h-9 px-2.5 rounded-sm border border-border bg-background hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-medium text-foreground flex items-center justify-between gap-2 cursor-pointer focus:ring-1 focus:ring-primary-500"
                  >
                    <span className="truncate">{selectedSectionObj?.name || "No Section"}</span>
                    <ChevronDown className={cn("w-3.5 h-3.5 text-neutral-400 transition-transform duration-200", sectionOpen && "rotate-180 text-primary-500")} />
                  </button>

                  <AnimatePresence>
                    {sectionOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 4, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 4, scale: 0.98 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="absolute left-0 top-full mt-1 w-full max-h-48 overflow-y-auto p-1 rounded-md border border-border bg-surface shadow-xl z-50 text-xs space-y-0.5"
                      >
                        <button
                          type="button"
                          onClick={() => {
                            updateTask(task.id, { sectionId: null });
                            setSectionOpen(false);
                          }}
                          className={cn(
                            "w-full px-2.5 py-1.5 rounded-sm text-xs font-medium flex items-center justify-between transition-colors cursor-pointer text-left",
                            !task.sectionId
                              ? "bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300 font-semibold"
                              : "text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-primary-700 dark:hover:text-primary-300"
                          )}
                        >
                          <span>No Section</span>
                          {!task.sectionId && <Check className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400 shrink-0" />}
                        </button>

                        {sections.map((sec) => {
                          const isSelected = task.sectionId === sec.id;
                          return (
                            <button
                              key={sec.id}
                              type="button"
                              onClick={() => {
                                updateTask(task.id, { sectionId: sec.id });
                                setSectionOpen(false);
                              }}
                              className={cn(
                                "w-full px-2.5 py-1.5 rounded-sm text-xs font-medium flex items-center justify-between transition-colors cursor-pointer text-left",
                                isSelected
                                  ? "bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300 font-semibold"
                                  : "text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-primary-700 dark:hover:text-primary-300"
                              )}
                            >
                              <div className="flex items-center gap-2 truncate">
                                <Hash className="w-3 h-3 text-neutral-400 shrink-0" />
                                <span className="truncate">{sec.name}</span>
                              </div>
                              {isSelected && <Check className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400 shrink-0" />}
                            </button>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Recurrence Custom Dropdown */}
                <div ref={recurrenceRef} className="space-y-1.5 col-span-2 relative">
                  <label className="text-xs font-medium text-neutral-500 flex items-center gap-1.5">
                    <Repeat className="w-3.5 h-3.5 text-primary-500" />
                    <span>Recurrence Pattern</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setRecurrenceOpen(!recurrenceOpen);
                      setPriorityOpen(false);
                      setSectionOpen(false);
                    }}
                    className="w-full h-9 px-2.5 rounded-sm border border-border bg-background hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-medium text-foreground flex items-center justify-between gap-2 cursor-pointer focus:ring-1 focus:ring-primary-500"
                  >
                    <span className="truncate">{selectedRecurrenceObj?.label || "None (One-time Task)"}</span>
                    <ChevronDown className={cn("w-3.5 h-3.5 text-neutral-400 transition-transform duration-200", recurrenceOpen && "rotate-180 text-primary-500")} />
                  </button>

                  <AnimatePresence>
                    {recurrenceOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 4, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 4, scale: 0.98 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="absolute left-0 top-full mt-1 w-full max-h-56 overflow-y-auto p-1 rounded-md border border-border bg-surface shadow-xl z-50 text-xs space-y-0.5"
                      >
                        {RECURRENCE_OPTIONS.map((opt) => {
                          const isSelected = (task.recurrence || "") === opt.value;
                          return (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => {
                                updateTask(task.id, { recurrence: opt.value || null });
                                setRecurrenceOpen(false);
                              }}
                              className={cn(
                                "w-full px-2.5 py-1.5 rounded-sm text-xs font-medium flex items-center justify-between transition-colors cursor-pointer text-left",
                                isSelected
                                  ? "bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300 font-semibold"
                                  : "text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-primary-700 dark:hover:text-primary-300"
                              )}
                            >
                              <div className="flex items-center gap-2 truncate">
                                <Repeat className="w-3 h-3 text-neutral-400 shrink-0" />
                                <span>{opt.label}</span>
                              </div>
                              {isSelected && <Check className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400 shrink-0" />}
                            </button>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Attachments Section */}
              <div className="space-y-3 pt-2 border-t border-border">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                    <Paperclip className="w-3.5 h-3.5 text-primary-500" />
                    <span>Attachments ({task.attachments.length})</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => setShowAddAtt(!showAddAtt)}
                    className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Link</span>
                  </button>
                </div>

                {/* Inline Attachment Add Form */}
                {showAddAtt && (
                  <form
                    onSubmit={handleAddAttachment}
                    className="p-3 rounded-md border border-border bg-surface space-y-2 text-xs"
                  >
                    <input
                      type="text"
                      placeholder="Link Title (e.g. Figma Specs)"
                      value={newAttName}
                      onChange={(e) => setNewAttName(e.target.value)}
                      className="w-full h-8 px-2.5 rounded-sm border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                    <input
                      type="text"
                      placeholder="URL (e.g. https://figma.com/...)"
                      value={newAttUrl}
                      onChange={(e) => setNewAttUrl(e.target.value)}
                      className="w-full h-8 px-2.5 rounded-sm border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setShowAddAtt(false)}
                        className="px-2.5 py-1 rounded-sm text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={!newAttName.trim() || !newAttUrl.trim()}
                        className="px-3 py-1 rounded-sm bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50"
                      >
                        Add
                      </button>
                    </div>
                  </form>
                )}

                {/* Attachment List */}
                <div className="space-y-1.5">
                  {task.attachments.length > 0 ? (
                    task.attachments.map((att) => (
                      <a
                        key={att.id}
                        href={att.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-2 rounded-sm border border-border bg-surface hover:bg-neutral-100 dark:hover:bg-neutral-800/60 transition-colors text-xs group"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <FileText className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                          <span className="font-medium text-foreground truncate">
                            {att.name}
                          </span>
                        </div>
                        <ExternalLink className="w-3 h-3 text-neutral-400 group-hover:text-primary-500 shrink-0" />
                      </a>
                    ))
                  ) : (
                    <p className="text-xs text-neutral-400 italic">
                      No attachments added yet.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
