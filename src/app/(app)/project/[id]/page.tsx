"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Folder, Hash, ChevronDown, ChevronRight, CheckCircle2, Plus, Trash2 } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { QuickAddInput } from "@/components/tasks/QuickAddInput";
import { TaskItem } from "@/components/tasks/TaskItem";
import { EmptyState } from "@/components/ui/EmptyState";

export default function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const tasks = useAppStore((state) => state.tasks);
  const sections = useAppStore((state) => state.sections);
  const projects = useAppStore((state) => state.projects);
  const addSection = useAppStore((state) => state.addSection);
  const deleteSection = useAppStore((state) => state.deleteSection);

  const [showCompleted, setShowCompleted] = useState(false);
  const [isAddingSection, setIsAddingSection] = useState(false);
  const [newSectionName, setNewSectionName] = useState("");

  const project = projects.find((p) => p.id === id);
  const matchedSection = sections.find((s) => s.id === id);

  const title = project?.name || matchedSection?.name || id;

  // Sections for this project
  const projectSections = project
    ? sections.filter((s) => project.sectionIds.includes(s.id))
    : matchedSection
    ? [matchedSection]
    : sections;

  // All active tasks for this project/section
  const allProjectTasks = tasks.filter(
    (t) => t.projectId === id || t.sectionId === id
  );
  const activeTasks = allProjectTasks.filter((t) => !t.completed);
  const completedTasks = allProjectTasks.filter((t) => t.completed);

  const handleAddSection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSectionName.trim()) return;
    addSection(newSectionName.trim(), id);
    setNewSectionName("");
    setIsAddingSection(false);
  };

  const handleDeleteSection = (sectionId: string, sectionName: string) => {
    if (confirm(`Delete section "${sectionName}"?`)) {
      deleteSection(sectionId);
      if (id === sectionId) {
        router.push("/inbox");
      }
    }
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-border pb-3">
        <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Folder
            className="w-5 h-5"
            style={{ color: project?.color || "#7c3aed" }}
          />
          <span>{title}</span>
        </h1>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-sm bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300 border border-primary-200 dark:border-primary-800">
            {activeTasks.length} {activeTasks.length === 1 ? "task" : "tasks"}
          </span>

          {matchedSection && (
            <button
              type="button"
              onClick={() => handleDeleteSection(matchedSection.id, matchedSection.name)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-xs font-medium border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 dark:border-red-900 dark:bg-red-950 dark:hover:bg-red-900 dark:text-red-300 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Section</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsAddingSection(true)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-xs font-medium border border-border bg-surface hover:bg-neutral-100 dark:hover:bg-neutral-800 text-foreground transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Section</span>
          </button>
        </div>
      </div>

      {/* Add Section Modal / Inline Form */}
      {isAddingSection && (
        <form
          onSubmit={handleAddSection}
          className="p-3 border border-primary-300 dark:border-primary-800 rounded-md bg-surface shadow-xs flex items-center gap-2.5"
        >
          <input
            type="text"
            value={newSectionName}
            onChange={(e) => setNewSectionName(e.target.value)}
            placeholder="Section name (e.g. Backlog, Sprint 1)..."
            autoFocus
            onBlur={() => {
              if (!newSectionName.trim()) setIsAddingSection(false);
            }}
            className="flex-1 h-8 px-2.5 rounded-sm border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
          <button
            type="submit"
            className="h-8 px-3 rounded-sm text-xs font-semibold bg-primary-600 hover:bg-primary-700 text-white transition-colors cursor-pointer"
          >
            Add
          </button>
        </form>
      )}

      {/* Quick Add Input */}
      <QuickAddInput defaultProjectId={id} />

      {/* Sections & Grouped Tasks */}
      <div className="space-y-4">
        {projectSections.length > 0 ? (
          projectSections.map((sec) => {
            const secTasks = tasks.filter(
              (t) => !t.completed && t.sectionId === sec.id
            );

            return (
              <div key={sec.id} className="space-y-2">
                {/* Section Header */}
                <div className="flex items-center justify-between border-b border-border/60 pb-1.5">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 flex items-center gap-1.5">
                    <Hash className="w-3.5 h-3.5 text-primary-500" />
                    <span>{sec.name}</span>
                  </h2>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-neutral-400 font-medium">
                      {secTasks.length} {secTasks.length === 1 ? "task" : "tasks"}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleDeleteSection(sec.id, sec.name)}
                      title="Delete section"
                      className="p-1 text-neutral-400 hover:text-red-500 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Task Items */}
                {secTasks.length > 0 ? (
                  <div className="space-y-2">
                    <AnimatePresence initial={false}>
                      {secTasks.map((task) => (
                        <TaskItem key={task.id} task={task} />
                      ))}
                    </AnimatePresence>
                  </div>
                ) : (
                  <p className="text-xs text-neutral-400 italic py-1">
                    No active tasks in this section.
                  </p>
                )}
              </div>
            );
          })
        ) : activeTasks.length > 0 ? (
          <div className="space-y-2">
            <AnimatePresence initial={false}>
              {activeTasks.map((task) => (
                <TaskItem key={task.id} task={task} />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <EmptyState
            title={`No active tasks in ${title}`}
            subtitle="Use the quick add input above to capture tasks directly into this project."
            icon={<CheckCircle2 className="w-5 h-5 text-primary-500" />}
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
