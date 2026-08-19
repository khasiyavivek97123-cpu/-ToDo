import { jsPDF } from "jspdf";
import { format, subDays } from "date-fns";
import { Task, Section, Project } from "./types";

export function generateInsightsPDF(
  range: "today" | "week" | "month",
  tasks: Task[],
  sections: Section[],
  projects: Project[]
) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const now = new Date();
  const dateStr = format(now, "yyyy-MM-dd HH:mm");
  const todayISO = format(now, "yyyy-MM-dd");

  let startDateISO = todayISO;
  let title = "Today's Progress & Task Report";
  let subtitle = "Comprehensive Daily Focus & Completion Report";

  if (range === "week") {
    startDateISO = format(subDays(now, 7), "yyyy-MM-dd");
    title = "Weekly Insights & Progress Report";
    subtitle = "7-Day Velocity, Priority Breakdown & Completion Ledger";
  } else if (range === "month") {
    startDateISO = format(subDays(now, 30), "yyyy-MM-dd");
    title = "Monthly Performance & Insights Report";
    subtitle = "30-Day Overview, Productivity Trends & Task Audit";
  }

  // Filter tasks completed in range
  const relevantCompletedTasks: { task: Task; completedAt: string }[] = [];
  tasks.forEach((t) => {
    t.completedHistory.forEach((ts) => {
      const tsDate = ts.slice(0, 10);
      if (tsDate >= startDateISO && tsDate <= todayISO) {
        relevantCompletedTasks.push({ task: t, completedAt: ts });
      }
    });
  });

  const totalCompletedInRange = relevantCompletedTasks.length;
  const activeTasks = tasks.filter((t) => !t.completed);
  const p1Count = tasks.filter((t) => !t.completed && t.priority === 1).length;
  const p2Count = tasks.filter((t) => !t.completed && t.priority === 2).length;
  const p3Count = tasks.filter((t) => !t.completed && t.priority === 3).length;
  const p4Count = tasks.filter((t) => !t.completed && t.priority === 4).length;

  let y = 15;

  // 1. Header Banner
  doc.setFillColor(124, 58, 237); // #7c3aed primary purple
  doc.rect(14, y, 182, 24, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("!todo", 20, y + 11);

  doc.setFontSize(14);
  doc.text(title, 45, y + 11);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(`Generated: ${dateStr}  |  Proof of Progress Report`, 45, y + 18);

  y += 32;

  // Subtitle
  doc.setTextColor(60, 60, 60);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text(subtitle, 14, y);
  y += 8;

  // 2. Summary Metric Cards Row
  const cardWidth = 42;
  const cardHeight = 20;

  // Card 1: Completed Tasks
  doc.setFillColor(245, 243, 255);
  doc.setDrawColor(221, 214, 254);
  doc.roundedRect(14, y, cardWidth, cardHeight, 2, 2, "FD");
  doc.setTextColor(109, 40, 217);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("COMPLETED (RANGE)", 18, y + 6);
  doc.setFontSize(14);
  doc.text(String(totalCompletedInRange), 18, y + 15);

  // Card 2: Active Tasks
  doc.setFillColor(239, 246, 255);
  doc.setDrawColor(191, 219, 254);
  doc.roundedRect(60, y, cardWidth, cardHeight, 2, 2, "FD");
  doc.setTextColor(29, 78, 216);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("ACTIVE TASKS", 64, y + 6);
  doc.setFontSize(14);
  doc.text(String(activeTasks.length), 64, y + 15);

  // Card 3: P1 Urgent
  doc.setFillColor(254, 242, 242);
  doc.setDrawColor(254, 202, 202);
  doc.roundedRect(106, y, cardWidth, cardHeight, 2, 2, "FD");
  doc.setTextColor(185, 28, 28);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("P1 URGENT", 110, y + 6);
  doc.setFontSize(14);
  doc.text(String(p1Count), 110, y + 15);

  // Card 4: Total Managed
  doc.setFillColor(244, 244, 245);
  doc.setDrawColor(228, 228, 231);
  doc.roundedRect(152, y, cardWidth, cardHeight, 2, 2, "FD");
  doc.setTextColor(63, 63, 70);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("TOTAL TRACKED", 156, y + 6);
  doc.setFontSize(14);
  doc.text(String(tasks.length), 156, y + 15);

  y += 28;

  // 3. Priority Breakdown Table Header
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Priority Distribution Breakdown", 14, y);
  y += 5;

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.rect(14, y, 182, 8, "FD");

  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(51, 65, 85);
  doc.text("Priority Level", 18, y + 5.5);
  doc.text("Active Count", 75, y + 5.5);
  doc.text("Workload %", 130, y + 5.5);

  y += 8;

  const prioData = [
    { label: "P1 - Urgent", count: p1Count, color: [239, 68, 68] },
    { label: "P2 - High", count: p2Count, color: [245, 158, 11] },
    { label: "P3 - Medium", count: p3Count, color: [59, 130, 246] },
    { label: "P4 - Normal", count: p4Count, color: [161, 161, 170] },
  ];

  prioData.forEach((pd) => {
    doc.setDrawColor(241, 245, 249);
    doc.line(14, y + 7, 196, y + 7);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(30, 41, 59);
    doc.text(pd.label, 18, y + 5);
    doc.text(String(pd.count), 75, y + 5);

    const pct = activeTasks.length > 0 ? Math.round((pd.count / activeTasks.length) * 100) : 0;
    doc.text(`${pct}%`, 130, y + 5);

    y += 7;
  });

  y += 10;

  // 4. Task Audit Table (Itemized Tasks)
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Itemized Task Log & Progress Audit", 14, y);
  y += 5;

  // Table Header
  doc.setFillColor(124, 58, 237);
  doc.rect(14, y, 182, 8, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("STATUS", 18, y + 5.5);
  doc.text("TASK TITLE", 40, y + 5.5);
  doc.text("PRIORITY", 105, y + 5.5);
  doc.text("SECTION / PROJECT", 130, y + 5.5);
  doc.text("DUE DATE / TIME", 168, y + 5.5);

  y += 8;

  // Audit Rows
  tasks.forEach((t, idx) => {
    if (y > 270) {
      doc.addPage();
      y = 20;

      // Page Header repeat
      doc.setFillColor(124, 58, 237);
      doc.rect(14, y, 182, 8, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.text("STATUS", 18, y + 5.5);
      doc.text("TASK TITLE", 40, y + 5.5);
      doc.text("PRIORITY", 105, y + 5.5);
      doc.text("SECTION / PROJECT", 130, y + 5.5);
      doc.text("DUE DATE / TIME", 168, y + 5.5);
      y += 8;
    }

    const isEven = idx % 2 === 0;
    if (isEven) {
      doc.setFillColor(248, 250, 252);
      doc.rect(14, y, 182, 8, "F");
    }

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);

    // Status
    if (t.completed) {
      doc.setTextColor(16, 185, 129);
      doc.text("Completed", 18, y + 5.5);
    } else {
      doc.setTextColor(100, 116, 139);
      doc.text("Pending", 18, y + 5.5);
    }

    // Title (Truncate if too long)
    doc.setTextColor(15, 23, 42);
    const truncTitle = t.title.length > 34 ? t.title.slice(0, 32) + "..." : t.title;
    doc.text(truncTitle, 40, y + 5.5);

    // Priority
    doc.setTextColor(71, 85, 105);
    doc.text(`P${t.priority}`, 105, y + 5.5);

    // Section/Project
    const matchedSec = sections.find((s) => s.id === t.sectionId);
    const matchedProj = projects.find((p) => p.id === t.projectId);
    const secLabel = matchedSec?.name || matchedProj?.name || "-";
    const truncSec = secLabel.length > 20 ? secLabel.slice(0, 18) + "..." : secLabel;
    doc.text(truncSec, 130, y + 5.5);

    // Due Date
    const dueStr = t.dueDate ? `${t.dueDate}${t.dueTime ? ` @ ${t.dueTime}` : ""}` : "No Due Date";
    doc.text(dueStr, 168, y + 5.5);

    y += 8;
  });

  // Footer / Page Number
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(148, 163, 184);
    doc.text(`!todo Progress Engine  |  Page ${p} of ${totalPages}`, 14, 287);
  }

  // Save PDF
  doc.save(`todo-insights-${range}-${todayISO}.pdf`);
}
