import { addDays, format, parseISO } from "date-fns";

const DAY_INDEX_MAP: Record<string, number> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

export function getNextDueDate(
  recurrenceRule: string | null | undefined,
  baseDateInput: Date | string = new Date()
): string | null {
  if (!recurrenceRule) return null;

  let baseDate: Date;
  if (typeof baseDateInput === "string") {
    try {
      baseDate = parseISO(baseDateInput);
    } catch {
      baseDate = new Date();
    }
  } else {
    baseDate = baseDateInput;
  }

  const rule = recurrenceRule.toLowerCase().trim();

  // 1. Daily
  if (rule === "daily" || rule === "every-day") {
    return format(addDays(baseDate, 1), "yyyy-MM-dd");
  }

  // 2. Weekdays (Monday through Friday)
  if (rule === "weekdays") {
    let next = addDays(baseDate, 1);
    const day = next.getDay();
    if (day === 6) {
      // Saturday -> Monday (+2 days)
      next = addDays(next, 2);
    } else if (day === 0) {
      // Sunday -> Monday (+1 day)
      next = addDays(next, 1);
    }
    return format(next, "yyyy-MM-dd");
  }

  // 3. Weekend (Saturday & Sunday)
  if (rule === "weekend") {
    let next = addDays(baseDate, 1);
    while (next.getDay() !== 6 && next.getDay() !== 0) {
      next = addDays(next, 1);
    }
    return format(next, "yyyy-MM-dd");
  }

  // 4. Specific day of week (every-monday, every-tuesday, ...)
  if (rule.startsWith("every-")) {
    const dayName = rule.replace("every-", "").toLowerCase();
    if (dayName in DAY_INDEX_MAP) {
      const targetDay = DAY_INDEX_MAP[dayName];
      let next = addDays(baseDate, 1);
      while (next.getDay() !== targetDay) {
        next = addDays(next, 1);
      }
      return format(next, "yyyy-MM-dd");
    }
  }

  // Fallback: add 1 day
  return format(addDays(baseDate, 1), "yyyy-MM-dd");
}
