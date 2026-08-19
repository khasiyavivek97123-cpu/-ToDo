"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Flame,
  Clock,
  TrendingUp,
  BarChart2,
  Award,
  History,
  Check,
  PieChart,
  FileText,
  ChevronDown,
  Download,
  Calendar,
} from "lucide-react";
import { subDays, format } from "date-fns";
import { useAppStore } from "@/lib/store";
import { generateInsightsPDF } from "@/lib/pdfExporter";
import { cn } from "@/lib/utils";

function PriorityDonutChart({
  p1,
  p2,
  p3,
  p4,
  total,
}: {
  p1: number;
  p2: number;
  p3: number;
  p4: number;
  total: number;
}) {
  const safeTotal = total || 1;
  const radius = 34;
  const circumference = 2 * Math.PI * radius;

  // Segment percentages
  const p1Pct = p1 / safeTotal;
  const p2Pct = p2 / safeTotal;
  const p3Pct = p3 / safeTotal;
  const p4Pct = p4 / safeTotal;

  // Dash lengths
  const p1Length = p1Pct * circumference;
  const p2Length = p2Pct * circumference;
  const p3Length = p3Pct * circumference;
  const p4Length = p4Pct * circumference;

  let currentOffset = 0;
  const p1Offset = currentOffset;
  currentOffset += p1Length;
  const p2Offset = currentOffset;
  currentOffset += p2Length;
  const p3Offset = currentOffset;
  currentOffset += p3Length;
  const p4Offset = currentOffset;

  return (
    <div className="flex items-center gap-3">
      {/* SVG Donut Ring */}
      <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            className="stroke-neutral-200 dark:stroke-neutral-800"
            strokeWidth="11"
            fill="none"
          />
          {total > 0 ? (
            <>
              {/* P1 Segment (Red) */}
              {p1 > 0 && (
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  stroke="#ef4444"
                  strokeWidth="11"
                  fill="none"
                  strokeDasharray={`${p1Length} ${circumference - p1Length}`}
                  strokeDashoffset={-p1Offset}
                />
              )}
              {/* P2 Segment (Amber) */}
              {p2 > 0 && (
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  stroke="#f59e0b"
                  strokeWidth="11"
                  fill="none"
                  strokeDasharray={`${p2Length} ${circumference - p2Length}`}
                  strokeDashoffset={-p2Offset}
                />
              )}
              {/* P3 Segment (Blue) */}
              {p3 > 0 && (
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  stroke="#3b82f6"
                  strokeWidth="11"
                  fill="none"
                  strokeDasharray={`${p3Length} ${circumference - p3Length}`}
                  strokeDashoffset={-p3Offset}
                />
              )}
              {/* P4 Segment (Neutral) */}
              {p4 > 0 && (
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  stroke="#a1a1aa"
                  strokeWidth="11"
                  fill="none"
                  strokeDasharray={`${p4Length} ${circumference - p4Length}`}
                  strokeDashoffset={-p4Offset}
                />
              )}
            </>
          ) : (
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke="#7c3aed"
              strokeWidth="11"
              fill="none"
            />
          )}
        </svg>
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-sm font-bold text-foreground leading-none">
            {total}
          </span>
          <span className="text-[9px] font-medium text-neutral-400">Total</span>
        </div>
      </div>

      {/* Legend list */}
      <div className="space-y-0.5 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-xs bg-red-500 shrink-0" />
          <span className="text-[10px] font-semibold text-neutral-600 dark:text-neutral-300">P1: {p1}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-xs bg-amber-500 shrink-0" />
          <span className="text-[10px] font-semibold text-neutral-600 dark:text-neutral-300">P2: {p2}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-xs bg-blue-500 shrink-0" />
          <span className="text-[10px] font-semibold text-neutral-600 dark:text-neutral-300">P3: {p3}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-xs bg-neutral-400 shrink-0" />
          <span className="text-[10px] font-semibold text-neutral-600 dark:text-neutral-300">P4: {p4}</span>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const tasks = useAppStore((state) => state.tasks);
  const sections = useAppStore((state) => state.sections);
  const projects = useAppStore((state) => state.projects);

  const [pdfMenuOpen, setPdfMenuOpen] = useState(false);
  const pdfRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (pdfRef.current && !pdfRef.current.contains(e.target as Node)) {
        setPdfMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const now = new Date();
  const todayISO = format(now, "yyyy-MM-dd");

  // 1. Tasks Completed Today
  let completedTodayCount = 0;
  tasks.forEach((task) => {
    task.completedHistory.forEach((timestamp) => {
      if (timestamp.startsWith(todayISO)) {
        completedTodayCount++;
      }
    });
  });

  // 2. Total Active Tasks
  const totalActiveTasks = tasks.filter((t) => !t.completed).length;

  // 3. Last 7 Days Completion Data
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = subDays(now, 6 - i);
    const dateISO = format(d, "yyyy-MM-dd");
    const dayLabel = format(d, "EEE");
    const fullDateLabel = format(d, "MMM d");

    let count = 0;
    tasks.forEach((task) => {
      task.completedHistory.forEach((timestamp) => {
        if (timestamp.startsWith(dateISO)) {
          count++;
        }
      });
    });

    return { dateObj: d, dateISO, dayLabel, fullDateLabel, count };
  });

  // 4. Calculate Current Streak
  let streak = 0;
  let checkDate = now;
  for (let i = 0; i < 30; i++) {
    const dateISO = format(checkDate, "yyyy-MM-dd");
    let hasCompletion = false;

    for (const task of tasks) {
      if (task.completedHistory.some((ts) => ts.startsWith(dateISO))) {
        hasCompletion = true;
        break;
      }
    }

    if (hasCompletion) {
      streak++;
      checkDate = subDays(checkDate, 1);
    } else if (i === 0) {
      // If no completions today yet, check yesterday before breaking streak
      checkDate = subDays(checkDate, 1);
    } else {
      break;
    }
  }

  // Priority Distribution
  const p1Count = tasks.filter((t) => !t.completed && t.priority === 1).length;
  const p2Count = tasks.filter((t) => !t.completed && t.priority === 2).length;
  const p3Count = tasks.filter((t) => !t.completed && t.priority === 3).length;
  const p4Count = tasks.filter((t) => !t.completed && t.priority === 4).length;

  const maxCountInChart = Math.max(...last7Days.map((d) => d.count), 5);

  // Recent Completed Feed Log
  const completedHistoryFeed: { title: string; timestamp: string }[] = [];
  tasks.forEach((t) => {
    t.completedHistory.forEach((ts) => {
      completedHistoryFeed.push({ title: t.title, timestamp: ts });
    });
  });
  completedHistoryFeed.sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));

  const handleExportPDF = (range: "today" | "week" | "month") => {
    setPdfMenuOpen(false);
    generateInsightsPDF(range, tasks, sections, projects);
  };

  return (
    <div className="h-full flex flex-col space-y-3 max-w-5xl mx-auto overflow-hidden min-h-0 select-none">
      {/* Top Header Card (Solid Theme Colors + PDF Export Control) */}
      <div className="flex items-center justify-between px-4 py-2.5 rounded-md border border-border bg-surface shadow-xs shrink-0">
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-sm bg-primary-100 text-primary-800 border border-primary-200 dark:bg-primary-950 dark:text-primary-200 dark:border-primary-800 text-[11px] font-semibold">
            <Award className="w-3 h-3" />
            <span>Productivity Analytics</span>
          </div>
          <h1 className="text-lg font-bold tracking-tight text-foreground">
            Dashboard & Insights
          </h1>
        </div>

        {/* Right Header Actions: Export PDF Dropdown */}
        <div className="flex items-center gap-3">
          <div ref={pdfRef} className="relative">
            <button
              type="button"
              onClick={() => setPdfMenuOpen(!pdfMenuOpen)}
              className="inline-flex items-center gap-1.5 h-8 px-3 rounded-sm border border-border bg-background hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-semibold text-foreground transition-all cursor-pointer shadow-none focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              <FileText className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
              <span>Export PDF Report</span>
              <ChevronDown
                className={cn(
                  "w-3.5 h-3.5 text-neutral-400 transition-transform duration-200",
                  pdfMenuOpen && "rotate-180 text-primary-500"
                )}
              />
            </button>

            <AnimatePresence>
              {pdfMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 4, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.98 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute right-0 top-full mt-1.5 w-56 p-1.5 rounded-md border border-border bg-surface shadow-xl z-50 text-xs space-y-1"
                >
                  <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-neutral-400 border-b border-border mb-1">
                    Proof of Progress Export
                  </div>

                  <button
                    type="button"
                    onClick={() => handleExportPDF("today")}
                    className="w-full px-2.5 py-1.5 rounded-sm text-xs font-medium flex items-center justify-between text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-primary-700 dark:hover:text-primary-300 transition-colors text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-blue-500" />
                      <span>Today&apos;s Progress</span>
                    </div>
                    <Download className="w-3 h-3 text-neutral-400" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleExportPDF("week")}
                    className="w-full px-2.5 py-1.5 rounded-sm text-xs font-medium flex items-center justify-between text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-primary-700 dark:hover:text-primary-300 transition-colors text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-3.5 h-3.5 text-primary-500" />
                      <span>Last 7 Days (Weekly)</span>
                    </div>
                    <Download className="w-3 h-3 text-neutral-400" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleExportPDF("month")}
                    className="w-full px-2.5 py-1.5 rounded-sm text-xs font-medium flex items-center justify-between text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-primary-700 dark:hover:text-primary-300 transition-colors text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Award className="w-3.5 h-3.5 text-amber-500" />
                      <span>Last 30 Days (Monthly)</span>
                    </div>
                    <Download className="w-3 h-3 text-neutral-400" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="relative w-10 h-10 shrink-0 hidden sm:block">
            <Image
              src="/assets/images/dashboard-illustration.png"
              alt="Dashboard metrics illustration"
              width={40}
              height={40}
              priority
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>

      {/* Main Column + Row Mix Viewport Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-3 min-h-0 overflow-hidden">
        {/* Left / Main Column (Stats Row + Velocity Chart + Donut Pie Visualization) */}
        <div className="lg:col-span-2 flex flex-col space-y-3 min-h-0 overflow-hidden">
          {/* Stats Cards Row (Solid Colors) */}
          <div className="grid grid-cols-3 gap-2.5 shrink-0">
            {/* Completed Today */}
            <div className="p-3 rounded-md border border-border bg-surface shadow-2xs flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-sm bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex items-center justify-center shrink-0 border border-purple-200 dark:border-purple-800">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider block truncate">
                  Completed Today
                </span>
                <div className="text-lg font-bold text-foreground leading-tight">
                  {completedTodayCount}
                </div>
              </div>
            </div>

            {/* Current Streak */}
            <div className="p-3 rounded-md border border-border bg-surface shadow-2xs flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-sm bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0 border border-amber-200 dark:border-amber-800">
                <Flame className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider block truncate">
                  Current Streak
                </span>
                <div className="text-lg font-bold text-foreground leading-tight truncate">
                  {streak} {streak === 1 ? "day" : "days"} 🔥
                </div>
              </div>
            </div>

            {/* Total Active Tasks */}
            <div className="p-3 rounded-md border border-border bg-surface shadow-2xs flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-sm bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center shrink-0 border border-blue-200 dark:border-blue-800">
                <Clock className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider block truncate">
                  Active Tasks
                </span>
                <div className="text-lg font-bold text-foreground leading-tight">
                  {totalActiveTasks}
                </div>
              </div>
            </div>
          </div>

          {/* 7-Day Completion Velocity Bar Chart + Donut Ring Visualization Card */}
          <div className="flex-1 flex flex-col p-3.5 rounded-md border border-border bg-surface shadow-xs min-h-0 overflow-hidden space-y-2">
            <div className="flex items-center justify-between shrink-0">
              <h2 className="text-sm font-bold tracking-tight text-foreground flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                <span>Completion Velocity & Workload Distribution</span>
              </h2>
            </div>

            {/* Split Chart Container: Left Bar Chart + Right Donut Pie Chart */}
            <div className="flex-1 pt-2 pb-1 px-1 border-t border-border grid grid-cols-1 sm:grid-cols-3 gap-4 items-center min-h-0 overflow-hidden">
              {/* Left Side: Slim Bars Completion Velocity (col-span-2) */}
              <div className="sm:col-span-2 h-full flex flex-col justify-end min-h-0">
                <div className="h-full flex items-end justify-around gap-1.5">
                  {last7Days.map((day) => {
                    const heightPercent = Math.round(
                      (day.count / maxCountInChart) * 100
                    );

                    return (
                      <div
                        key={day.dateISO}
                        className="flex-1 max-w-[36px] h-full flex flex-col items-center justify-end gap-1 group cursor-pointer"
                      >
                        {/* Count Badge */}
                        <span className="text-[10px] font-bold text-primary-600 dark:text-primary-400 group-hover:scale-110 transition-transform">
                          {day.count}
                        </span>

                        {/* Reduced Width Bar Track */}
                        <div className="w-full max-w-[20px] bg-neutral-100 dark:bg-neutral-800 rounded-t-xs flex-1 max-h-[130px] flex items-end p-0.5">
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${Math.max(heightPercent, 8)}%` }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className="w-full bg-primary-600 hover:bg-primary-700 rounded-t-xs transition-colors"
                          />
                        </div>

                        {/* Day Label */}
                        <div className="text-center shrink-0">
                          <span className="text-[10px] font-semibold text-foreground block leading-none">
                            {day.dayLabel}
                          </span>
                          <span className="text-[8px] text-neutral-400 block leading-tight">
                            {day.fullDateLabel}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Side: Donut Pie Chart Visualization (col-span-1) */}
              <div className="sm:col-span-1 border-l border-border pl-4 h-full flex flex-col justify-center space-y-2 shrink-0">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500 flex items-center gap-1">
                  <PieChart className="w-3 h-3 text-primary-500" />
                  <span>Workload Donut</span>
                </div>
                <PriorityDonutChart
                  p1={p1Count}
                  p2={p2Count}
                  p3={p3Count}
                  p4={p4Count}
                  total={totalActiveTasks}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Priority Breakdown + Recent Completion Feed) */}
        <div className="lg:col-span-1 flex flex-col space-y-3 min-h-0 overflow-hidden">
          {/* Priority Breakdown Box (Solid Colors) */}
          <div className="p-3.5 rounded-md border border-border bg-surface shadow-xs space-y-2.5 shrink-0">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
              <BarChart2 className="w-3.5 h-3.5 text-primary-500" />
              <span>Priority Breakdown</span>
            </h3>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded-sm border border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950 flex items-center justify-between">
                <span className="font-semibold text-red-700 dark:text-red-300 text-[11px]">P1 Urgent</span>
                <span className="font-bold text-xs text-red-800 dark:text-red-200">{p1Count}</span>
              </div>

              <div className="p-2 rounded-sm border border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950 flex items-center justify-between">
                <span className="font-semibold text-orange-700 dark:text-orange-300 text-[11px]">P2 High</span>
                <span className="font-bold text-xs text-orange-800 dark:text-orange-200">{p2Count}</span>
              </div>

              <div className="p-2 rounded-sm border border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950 flex items-center justify-between">
                <span className="font-semibold text-blue-700 dark:text-blue-300 text-[11px]">P3 Medium</span>
                <span className="font-bold text-xs text-blue-800 dark:text-blue-200">{p3Count}</span>
              </div>

              <div className="p-2 rounded-sm border border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900 flex items-center justify-between">
                <span className="font-semibold text-neutral-600 dark:text-neutral-400 text-[11px]">P4 Normal</span>
                <span className="font-bold text-xs text-neutral-800 dark:text-neutral-200">{p4Count}</span>
              </div>
            </div>
          </div>

          {/* Recent Completion Activity (Internal Scroll Container) */}
          <div className="flex-1 flex flex-col p-3.5 rounded-md border border-border bg-surface shadow-xs min-h-0 overflow-hidden space-y-2 max-h-[380px]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5 shrink-0">
              <History className="w-3.5 h-3.5 text-primary-500" />
              <span>Completion Log ({completedHistoryFeed.length})</span>
            </h3>

            {/* Internal Scroll Container */}
            <div className="flex-1 overflow-y-auto max-h-[350px] space-y-1.5 pr-1 min-h-0 border-t border-border pt-2">
              {completedHistoryFeed.length > 0 ? (
                completedHistoryFeed.map((item, idx) => (
                  <div
                    key={`${item.title}-${item.timestamp}-${idx}`}
                    className="p-2 rounded-sm border border-border bg-background flex items-center justify-between gap-2 text-xs"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-4 h-4 rounded-full bg-primary-600 text-white flex items-center justify-center shrink-0 text-[9px]">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                      <span className="font-medium text-foreground truncate">
                        {item.title}
                      </span>
                    </div>
                    <span className="text-[10px] text-neutral-400 shrink-0 font-mono">
                      {item.timestamp.slice(0, 10)}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-neutral-400 italic py-2">
                  No completed tasks logged yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
