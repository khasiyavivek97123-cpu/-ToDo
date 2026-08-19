import { addDays, format } from "date-fns";
import { Task } from "./types";
import { getTodayISO, sortByPriority } from "./utils";

export interface DateGroup {
  key: string;
  label: string;
  order: number;
  dateStr: string;
  tasks: Task[];
}

export function groupTasksByDate(tasks: Task[]): DateGroup[] {
  const todayObj = new Date();
  const todayISO = getTodayISO();
  const tomorrowISO = format(addDays(todayObj, 1), "yyyy-MM-dd");

  const groupsMap = new Map<string, { label: string; order: number; dateStr: string; tasks: Task[] }>();

  tasks.forEach((task) => {
    let key = "no-date";
    let label = "No Due Date";
    let order = 999999;
    let dateStr = "9999-99-99";

    if (task.dueDate) {
      if (task.dueDate < todayISO) {
        key = "overdue";
        label = "Overdue";
        order = -1;
        dateStr = task.dueDate;
      } else if (task.dueDate === todayISO) {
        key = "today";
        label = "Today";
        order = 0;
        dateStr = todayISO;
      } else if (task.dueDate === tomorrowISO) {
        key = "tomorrow";
        label = "Tomorrow";
        order = 1;
        dateStr = tomorrowISO;
      } else {
        // Format as dd/MM/yyyy
        const [yyyy, mm, dd] = task.dueDate.split("-");
        const formattedDate = `${dd}/${mm}/${yyyy}`;
        key = `date-${task.dueDate}`;
        label = formattedDate;
        // Parse date number for sorting order
        order = parseInt(task.dueDate.replace(/-/g, ""), 10);
        dateStr = task.dueDate;
      }
    }

    if (!groupsMap.has(key)) {
      groupsMap.set(key, { label, order, dateStr, tasks: [] });
    }
    groupsMap.get(key)!.tasks.push(task);
  });

  const sortedGroups = Array.from(groupsMap.values()).sort((a, b) => a.order - b.order);

  // Sort tasks within each group by priority
  sortedGroups.forEach((g) => {
    g.tasks = sortByPriority(g.tasks);
  });

  return sortedGroups.map((g) => ({
    key: g.dateStr,
    label: g.label,
    order: g.order,
    dateStr: g.dateStr,
    tasks: g.tasks,
  }));
}
