export type PriorityLevel = 1 | 2 | 3 | 4;

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
}

export interface Task {
  id: string;
  title: string;
  notes?: string;
  completed: boolean;
  dueDate?: string | null;
  dueTime?: string | null;
  priority: PriorityLevel;
  sectionId?: string | null;
  projectId?: string | null;
  recurrence?: string | null;
  attachments: Attachment[];
  createdAt: string;
  completedHistory: string[];
}

export interface Section {
  id: string;
  name: string;
  taskIds: string[];
}

export interface Project {
  id: string;
  name: string;
  color: string;
  sectionIds: string[];
}
