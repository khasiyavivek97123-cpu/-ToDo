import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO, differenceInCalendarDays } from "date-fns";
import { Task } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getTodayISO(): string {
  return format(new Date(), "yyyy-MM-dd");
}

export function isTaskOverdue(task: Task, todayISO?: string): boolean {
  if (task.completed || !task.dueDate) return false;
  const current = todayISO || getTodayISO();
  return task.dueDate < current;
}

export function getOverdueDays(dueDate: string, todayISO?: string): number {
  const currentISO = todayISO || getTodayISO();
  const todayDate = parseISO(currentISO);
  const due = parseISO(dueDate);
  return Math.max(0, differenceInCalendarDays(todayDate, due));
}

export function formatOverdueIndicator(dueDate: string, todayISO?: string): string {
  const diffDays = getOverdueDays(dueDate, todayISO);
  if (diffDays === 0) return "Overdue today";
  if (diffDays === 1) return "1 day overdue";
  return `${diffDays} days overdue`;
}

