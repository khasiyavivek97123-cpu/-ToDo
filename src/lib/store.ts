import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { format, subDays } from "date-fns";
import { Task, Section, Project, Attachment, PriorityLevel } from "./types";
import { getNextDueDate } from "./recurrence";

interface AppState {
  tasks: Task[];
  sections: Section[];
  projects: Project[];
  selectedTaskId: string | null;

  // Actions
  addTask: (taskData: {
    title: string;
    notes?: string;
    priority?: PriorityLevel;
    dueDate?: string | null;
    dueTime?: string | null;
    sectionId?: string | null;
    projectId?: string | null;
    recurrence?: string | null;
  }) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleComplete: (id: string) => void;
  addSection: (name: string, projectId?: string | null) => Section;
  deleteSection: (id: string) => void;
  addProject: (name: string, color?: string) => Project;
  addAttachmentToTask: (
    taskId: string,
    attachmentData: Omit<Attachment, "id">
  ) => void;
  setSelectedTaskId: (id: string | null) => void;
}

const defaultProjects: Project[] = [
  { id: "work", name: "Work", color: "#7c3aed", sectionIds: ["sec-work-1"] },
  { id: "personal", name: "Personal", color: "#2563eb", sectionIds: ["sec-pers-1"] },
  { id: "ideas", name: "Ideas", color: "#d97706", sectionIds: [] },
];

const defaultSections: Section[] = [
  { id: "sec-work-1", name: "Q3 Deliverables", taskIds: ["task-1", "task-2", "task-4"] },
  { id: "sec-pers-1", name: "Weekly Habits", taskIds: ["task-3"] },
];

const getTodayISO = () => format(new Date(), "yyyy-MM-dd");

const createDefaultTasks = (): Task[] => {
  const todayISO = getTodayISO();
  const overdueISO = format(subDays(new Date(), 4), "yyyy-MM-dd");

  return [
    {
      id: "task-1",
      title: "Finalize !todo component architecture",
      notes: "Review Next.js App Router layout structure and state management.",
      completed: false,
      dueDate: todayISO,
      dueTime: "17:00",
      priority: 1,
      sectionId: "sec-work-1",
      projectId: "work",
      recurrence: null,
      attachments: [],
      createdAt: new Date().toISOString(),
      completedHistory: [],
    },
    {
      id: "task-2",
      title: "Implement smart shortcut parser for inline tags",
      notes: "Support p1-p4, dates (today, tomorrow), and section tags.",
      completed: false,
      dueDate: todayISO,
      dueTime: null,
      priority: 2,
      sectionId: "sec-work-1",
      projectId: "work",
      recurrence: null,
      attachments: [],
      createdAt: new Date().toISOString(),
      completedHistory: [],
    },
    {
      id: "task-3",
      title: "Morning workout & hydration",
      notes: "30 mins daily routine.",
      completed: false,
      dueDate: todayISO,
      dueTime: "08:00",
      priority: 3,
      sectionId: "sec-pers-1",
      projectId: "personal",
      recurrence: "daily",
      attachments: [],
      createdAt: new Date().toISOString(),
      completedHistory: [],
    },
    {
      id: "task-4",
      title: "Review Q2 financial roadmap & budget allocation",
      notes: "Missed deadline - automatically moved to Backlog.",
      completed: false,
      dueDate: overdueISO,
      dueTime: "14:00",
      priority: 1,
      sectionId: "sec-work-1",
      projectId: "work",
      recurrence: null,
      attachments: [],
      createdAt: subDays(new Date(), 5).toISOString(),
      completedHistory: [],
    },
  ];
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      tasks: createDefaultTasks(),
      sections: defaultSections,
      projects: defaultProjects,
      selectedTaskId: null,

      addTask: (taskData) => {
        const newTask: Task = {
          id: `task-${Date.now()}`,
          title: taskData.title,
          notes: taskData.notes || "",
          completed: false,
          dueDate: taskData.dueDate || null,
          dueTime: taskData.dueTime || null,
          priority: taskData.priority || 4,
          sectionId: taskData.sectionId || null,
          projectId: taskData.projectId || null,
          recurrence: taskData.recurrence || null,
          attachments: [],
          createdAt: new Date().toISOString(),
          completedHistory: [],
        };

        set((state) => ({
          tasks: [newTask, ...state.tasks],
        }));

        if (newTask.sectionId) {
          set((state) => ({
            sections: state.sections.map((sec) =>
              sec.id === newTask.sectionId
                ? { ...sec, taskIds: [...sec.taskIds, newTask.id] }
                : sec
            ),
          }));
        }

        return newTask;
      },

      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, ...updates } : task
          ),
        }));
      },

      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
          sections: state.sections.map((sec) => ({
            ...sec,
            taskIds: sec.taskIds.filter((tId) => tId !== id),
          })),
          selectedTaskId: state.selectedTaskId === id ? null : state.selectedTaskId,
        }));
      },

      toggleComplete: (id) => {
        const task = get().tasks.find((t) => t.id === id);
        if (!task) return;

        const now = new Date().toISOString();

        if (!task.completed) {
          const history = [...task.completedHistory, now];

          if (task.recurrence) {
            // Recurring task: log completedAt and compute next occurrence date!
            const nextDate = getNextDueDate(task.recurrence, task.dueDate || now);
            set((state) => ({
              tasks: state.tasks.map((t) =>
                t.id === id
                  ? {
                      ...t,
                      completed: false, // Stays active for next recurring occurrence
                      dueDate: nextDate,
                      completedHistory: history,
                    }
                  : t
              ),
            }));
          } else {
            // Standard non-recurring task
            set((state) => ({
              tasks: state.tasks.map((t) =>
                t.id === id
                  ? {
                      ...t,
                      completed: true,
                      completedHistory: history,
                    }
                  : t
              ),
            }));
          }
        } else {
          // Unmarking complete
          set((state) => ({
            tasks: state.tasks.map((t) =>
              t.id === id
                ? {
                    ...t,
                    completed: false,
                  }
                : t
            ),
          }));
        }
      },

      addSection: (name, projectId = null) => {
        const newSection: Section = {
          id: `sec-${Date.now()}`,
          name,
          taskIds: [],
        };

        set((state) => ({
          sections: [...state.sections, newSection],
        }));

        if (projectId) {
          set((state) => ({
            projects: state.projects.map((proj) =>
              proj.id === projectId
                ? { ...proj, sectionIds: [...proj.sectionIds, newSection.id] }
                : proj
            ),
          }));
        }

        return newSection;
      },

      deleteSection: (id) => {
        set((state) => ({
          sections: state.sections.filter((sec) => sec.id !== id),
          projects: state.projects.map((proj) => ({
            ...proj,
            sectionIds: proj.sectionIds.filter((sId) => sId !== id),
          })),
          tasks: state.tasks.map((task) =>
            task.sectionId === id ? { ...task, sectionId: null } : task
          ),
        }));
      },

      addProject: (name, color = "#7c3aed") => {
        const newProject: Project = {
          id: `proj-${Date.now()}`,
          name,
          color,
          sectionIds: [],
        };

        set((state) => ({
          projects: [...state.projects, newProject],
        }));

        return newProject;
      },

      addAttachmentToTask: (taskId, attachmentData) => {
        const newAttachment: Attachment = {
          id: `att-${Date.now()}`,
          ...attachmentData,
        };

        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  attachments: [...task.attachments, newAttachment],
                }
              : task
          ),
        }));
      },

      setSelectedTaskId: (id) => {
        set({ selectedTaskId: id });
      },
    }),
    {
      name: "todo-app-storage-v2",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
