"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  RotateCcw,
  ChevronDown,
  Check,
  Hash,
  Folder,
  Flag,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { Task } from "@/lib/types";
import { cn, sortByPriority } from "@/lib/utils";

export interface TaskFilterState {
  search: string;
  priority: number | "all";
  sectionOrProject: string | "all";
}

export const defaultTaskFilterState: TaskFilterState = {
  search: "",
  priority: "all",
  sectionOrProject: "all",
};

export function filterTasks(tasks: Task[], filters: TaskFilterState): Task[] {
  const filtered = tasks.filter((task) => {
    // 1. Search query
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      const matchTitle = task.title.toLowerCase().includes(q);
      const matchNotes = task.notes?.toLowerCase().includes(q) ?? false;
      if (!matchTitle && !matchNotes) return false;
    }

    // 2. Priority
    if (filters.priority !== "all") {
      if (task.priority !== filters.priority) return false;
    }

    // 3. Section or Project
    if (filters.sectionOrProject !== "all") {
      const matchSec = task.sectionId === filters.sectionOrProject;
      const matchProj = task.projectId === filters.sectionOrProject;
      if (!matchSec && !matchProj) return false;
    }

    return true;
  });

  return sortByPriority(filtered);
}

interface FilterBarProps {
  filters: TaskFilterState;
  onFilterChange: (filters: TaskFilterState) => void;
}

const PRIORITY_OPTIONS = [
  { value: "all", label: "All Priorities", color: "text-neutral-500" },
  { value: 1, label: "P1 - Urgent", color: "text-red-600 dark:text-red-400" },
  { value: 2, label: "P2 - High", color: "text-orange-600 dark:text-orange-400" },
  { value: 3, label: "P3 - Medium", color: "text-blue-600 dark:text-blue-400" },
  { value: 4, label: "P4 - Normal", color: "text-neutral-500" },
];

export function FilterBar({ filters, onFilterChange }: FilterBarProps) {
  const sections = useAppStore((state) => state.sections);
  const projects = useAppStore((state) => state.projects);

  const [priorityOpen, setPriorityOpen] = useState(false);
  const [sectionOpen, setSectionOpen] = useState(false);

  const priorityRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        priorityRef.current &&
        !priorityRef.current.contains(e.target as Node)
      ) {
        setPriorityOpen(false);
      }
      if (
        sectionRef.current &&
        !sectionRef.current.contains(e.target as Node)
      ) {
        setSectionOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isFiltered =
    filters.search !== "" ||
    filters.priority !== "all" ||
    filters.sectionOrProject !== "all";

  const handleReset = () => {
    onFilterChange(defaultTaskFilterState);
    setPriorityOpen(false);
    setSectionOpen(false);
  };

  // Get active label for priority dropdown
  const selectedPriorityObj = PRIORITY_OPTIONS.find(
    (p) => p.value === filters.priority
  );

  // Get active label for section/project dropdown
  const getSectionOrProjectLabel = () => {
    if (filters.sectionOrProject === "all") return "All Sections/Projects";
    const sec = sections.find((s) => s.id === filters.sectionOrProject);
    if (sec) return sec.name;
    const proj = projects.find((p) => p.id === filters.sectionOrProject);
    if (proj) return proj.name;
    return "All Sections/Projects";
  };

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 select-none">
      {/* Search Input Box */}
      <div className="relative flex-1 flex items-center">
        <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 pointer-events-none" />
        <input
          type="text"
          value={filters.search}
          onChange={(e) =>
            onFilterChange({ ...filters, search: e.target.value })
          }
          placeholder="Filter by keyword..."
          className="w-full h-9 pl-8 pr-8 rounded-sm border border-border bg-background text-xs text-foreground placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-primary-500 shadow-none"
        />
        {filters.search && (
          <button
            type="button"
            onClick={() => onFilterChange({ ...filters, search: "" })}
            aria-label="Clear search"
            className="absolute right-2.5 text-neutral-400 hover:text-foreground cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Dropdown Action Controls */}
      <div className="flex items-center gap-2">
        {/* Custom Themed Priority Dropdown */}
        <div ref={priorityRef} className="relative">
          <button
            type="button"
            onClick={() => {
              setPriorityOpen(!priorityOpen);
              setSectionOpen(false);
            }}
            className="h-9 px-3 rounded-sm border border-border bg-background hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-medium text-foreground flex items-center justify-between gap-2 transition-all cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary-500 min-w-[130px]"
          >
            <span className="truncate">
              {selectedPriorityObj?.label || "All Priorities"}
            </span>
            <ChevronDown
              className={cn(
                "w-3.5 h-3.5 text-neutral-400 transition-transform duration-200 shrink-0",
                priorityOpen && "rotate-180 text-primary-500"
              )}
            />
          </button>

          <AnimatePresence>
            {priorityOpen && (
              <motion.div
                initial={{ opacity: 0, y: 4, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.98 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="absolute left-0 top-full mt-1.5 w-44 p-1 rounded-md border border-border bg-surface shadow-xl z-50 text-xs space-y-0.5"
              >
                {PRIORITY_OPTIONS.map((opt) => {
                  const isSelected = filters.priority === opt.value;
                  return (
                    <button
                      key={String(opt.value)}
                      type="button"
                      onClick={() => {
                        onFilterChange({
                          ...filters,
                          priority: opt.value as number | "all",
                        });
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
                        {opt.value !== "all" && (
                          <Flag className={cn("w-3 h-3 shrink-0", opt.color)} />
                        )}
                        <span>{opt.label}</span>
                      </div>
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Custom Themed Section / Project Dropdown */}
        <div ref={sectionRef} className="relative">
          <button
            type="button"
            onClick={() => {
              setSectionOpen(!sectionOpen);
              setPriorityOpen(false);
            }}
            className="h-9 px-3 rounded-sm border border-border bg-background hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-medium text-foreground flex items-center justify-between gap-2 transition-all cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary-500 min-w-[160px]"
          >
            <span className="truncate">{getSectionOrProjectLabel()}</span>
            <ChevronDown
              className={cn(
                "w-3.5 h-3.5 text-neutral-400 transition-transform duration-200 shrink-0",
                sectionOpen && "rotate-180 text-primary-500"
              )}
            />
          </button>

          <AnimatePresence>
            {sectionOpen && (
              <motion.div
                initial={{ opacity: 0, y: 4, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.98 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="absolute right-0 sm:right-auto sm:left-0 top-full mt-1.5 w-52 max-h-60 overflow-y-auto p-1 rounded-md border border-border bg-surface shadow-xl z-50 text-xs space-y-1"
              >
                {/* Option: All */}
                <button
                  type="button"
                  onClick={() => {
                    onFilterChange({ ...filters, sectionOrProject: "all" });
                    setSectionOpen(false);
                  }}
                  className={cn(
                    "w-full px-2.5 py-1.5 rounded-sm text-xs font-medium flex items-center justify-between transition-colors cursor-pointer text-left",
                    filters.sectionOrProject === "all"
                      ? "bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300 font-semibold"
                      : "text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-primary-700 dark:hover:text-primary-300"
                  )}
                >
                  <span>All Sections/Projects</span>
                  {filters.sectionOrProject === "all" && (
                    <Check className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400 shrink-0" />
                  )}
                </button>

                {/* Sections Group */}
                {sections.length > 0 && (
                  <div className="pt-1">
                    <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                      Sections
                    </div>
                    {sections.map((sec) => {
                      const isSelected = filters.sectionOrProject === sec.id;
                      return (
                        <button
                          key={sec.id}
                          type="button"
                          onClick={() => {
                            onFilterChange({
                              ...filters,
                              sectionOrProject: sec.id,
                            });
                            setSectionOpen(false);
                          }}
                          className={cn(
                            "w-full px-2.5 py-1.5 rounded-sm text-xs font-medium flex items-center justify-between transition-colors cursor-pointer text-left pl-4",
                            isSelected
                              ? "bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300 font-semibold"
                              : "text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-primary-700 dark:hover:text-primary-300"
                          )}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <Hash className="w-3 h-3 text-neutral-400 shrink-0" />
                            <span className="truncate">{sec.name}</span>
                          </div>
                          {isSelected && (
                            <Check className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Projects Group */}
                {projects.length > 0 && (
                  <div className="pt-1">
                    <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                      Projects
                    </div>
                    {projects.map((proj) => {
                      const isSelected = filters.sectionOrProject === proj.id;
                      return (
                        <button
                          key={proj.id}
                          type="button"
                          onClick={() => {
                            onFilterChange({
                              ...filters,
                              sectionOrProject: proj.id,
                            });
                            setSectionOpen(false);
                          }}
                          className={cn(
                            "w-full px-2.5 py-1.5 rounded-sm text-xs font-medium flex items-center justify-between transition-colors cursor-pointer text-left pl-4",
                            isSelected
                              ? "bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300 font-semibold"
                              : "text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-primary-700 dark:hover:text-primary-300"
                          )}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <Folder className="w-3 h-3 text-neutral-400 shrink-0" />
                            <span className="truncate">{proj.name}</span>
                          </div>
                          {isSelected && (
                            <Check className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Reset Button */}
        {isFiltered && (
          <button
            type="button"
            onClick={handleReset}
            title="Reset filters"
            className="flex items-center justify-center h-9 px-2.5 rounded-sm border border-border bg-background text-xs font-medium text-neutral-500 hover:text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors shadow-none cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
