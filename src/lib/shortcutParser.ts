import { addDays, subDays, format } from "date-fns";
import { PriorityLevel } from "./types";

export interface ParsedTaskInput {
  cleanTitle: string;
  dueDate: string | null;
  recurrence: string | null;
  priority: PriorityLevel;
}

const DAY_INDEX_MAP: Record<string, number> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

function getNextDayOfWeek(targetDay: number, baseDate = new Date()): Date {
  const currentDay = baseDate.getDay();
  let distance = targetDay - currentDay;
  if (distance < 0) {
    distance += 7;
  }
  return addDays(baseDate, distance);
}

export function parseTaskInput(text: string): ParsedTaskInput {
  if (!text) {
    return {
      cleanTitle: "",
      dueDate: null,
      recurrence: null,
      priority: 4,
    };
  }

  let cleanTitle = text;
  let dueDate: string | null = null;
  let recurrence: string | null = null;
  let priority: PriorityLevel = 4;
  const now = new Date();

  // 1. Priority parsing (!p1, !p2, !p3, !p4)
  const priorityMatch = cleanTitle.match(/(?:^|\s)!p([1-4])(?:\s|$)/i);
  if (priorityMatch) {
    priority = parseInt(priorityMatch[1], 10) as PriorityLevel;
    cleanTitle = cleanTitle.replace(priorityMatch[0], " ");
  }

  // 2. Date & Recurrence parsing
  // !today
  if (/(?:^|\s)!today(?:\s|$)/i.test(cleanTitle)) {
    dueDate = format(now, "yyyy-MM-dd");
    cleanTitle = cleanTitle.replace(/(?:^|\s)!today(?:\s|$)/gi, " ");
  }
  // !tomorrow
  else if (/(?:^|\s)!tomorrow(?:\s|$)/i.test(cleanTitle)) {
    dueDate = format(addDays(now, 1), "yyyy-MM-dd");
    cleanTitle = cleanTitle.replace(/(?:^|\s)!tomorrow(?:\s|$)/gi, " ");
  }
  // !yesterday
  else if (/(?:^|\s)!yesterday(?:\s|$)/i.test(cleanTitle)) {
    dueDate = format(subDays(now, 1), "yyyy-MM-dd");
    cleanTitle = cleanTitle.replace(/(?:^|\s)!yesterday(?:\s|$)/gi, " ");
  }
  // !weekdays
  else if (/(?:^|\s)!weekdays(?:\s|$)/i.test(cleanTitle)) {
    dueDate = format(now, "yyyy-MM-dd");
    recurrence = "weekdays";
    cleanTitle = cleanTitle.replace(/(?:^|\s)!weekdays(?:\s|$)/gi, " ");
  }
  // !weekend
  else if (/(?:^|\s)!weekend(?:\s|$)/i.test(cleanTitle)) {
    const nextSat = getNextDayOfWeek(6, now);
    dueDate = format(nextSat, "yyyy-MM-dd");
    recurrence = "weekend";
    cleanTitle = cleanTitle.replace(/(?:^|\s)!weekend(?:\s|$)/gi, " ");
  }
  // !every-day or !daily
  else if (/(?:^|\s)!(every-day|daily)(?:\s|$)/i.test(cleanTitle)) {
    dueDate = format(now, "yyyy-MM-dd");
    recurrence = "daily";
    cleanTitle = cleanTitle.replace(/(?:^|\s)!(every-day|daily)(?:\s|$)/gi, " ");
  }
  // !every-[dayofweek] (e.g. !every-monday, !every-tuesday, ...)
  else {
    const everyDayMatch = cleanTitle.match(
      /(?:^|\s)!every-(monday|tuesday|wednesday|thursday|friday|saturday|sunday)(?:\s|$)/i
    );
    if (everyDayMatch) {
      const dayName = everyDayMatch[1].toLowerCase();
      const targetDayIndex = DAY_INDEX_MAP[dayName];
      const targetDate = getNextDayOfWeek(targetDayIndex, now);
      dueDate = format(targetDate, "yyyy-MM-dd");
      recurrence = `every-${dayName}`;
      cleanTitle = cleanTitle.replace(everyDayMatch[0], " ");
    }
  }

  return {
    cleanTitle: cleanTitle.replace(/\s+/g, " ").trim(),
    dueDate,
    recurrence,
    priority,
  };
}
