"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Download, X, Award } from "lucide-react";
import confetti from "canvas-confetti";
import { toPng } from "html-to-image";
import { playWooHooSound } from "@/lib/sound";
import { useAppStore } from "@/lib/store";
import { format } from "date-fns";

export function CelebrationModal() {
  const tasks = useAppStore((state) => state.tasks);
  const [isOpen, setIsOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const todayISO = format(new Date(), "yyyy-MM-dd");

  // Calculate tasks completed today
  let completedTodayCount = 0;
  tasks.forEach((task) => {
    task.completedHistory.forEach((ts) => {
      if (ts.startsWith(todayISO)) {
        completedTodayCount++;
      }
    });
  });

  useEffect(() => {
    if (completedTodayCount >= 7) {
      const celebratedDate = localStorage.getItem("celebrated_date_7tasks");
      if (celebratedDate !== todayISO) {
        setIsOpen(true);
        localStorage.setItem("celebrated_date_7tasks", todayISO);

        // Play woohoo chime
        playWooHooSound();

        // Fire celebration confetti fireworks
        try {
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 },
            colors: ["#7c3aed", "#3b82f6", "#ef4444", "#f59e0b", "#10b981"],
          });
        } catch (e) {
          // ignore
        }
      }
    }
  }, [completedTodayCount, todayISO]);

  const handleDownloadPhoto = async () => {
    if (!cardRef.current) return;
    try {
      setIsExporting(true);
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 2,
        cacheBust: true,
      });
      const link = document.createElement("a");
      link.download = `todo-celebration-${todayISO}.png`;
      link.href = dataUrl;
      link.click();
    } catch (e) {
      console.error("Failed to capture celebration card photo:", e);
    } finally {
      setIsExporting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 22, stiffness: 260 }}
          className="relative z-10 w-full max-w-md bg-background border border-border rounded-lg shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Close Trigger */}
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="absolute top-3 right-3 p-1.5 rounded-sm text-neutral-400 hover:text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors z-20 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Exportable Card Target Area */}
          <div
            ref={cardRef}
            className="p-6 bg-background flex flex-col items-center text-center space-y-4 border-b border-border"
          >
            {/* App Brand Header */}
            <div className="flex items-center gap-2">
              <Image
                src="/assets/images/logo-mark.png"
                alt="!todo logo"
                width={24}
                height={24}
                className="w-6 h-6 object-contain"
              />
              <span className="font-bold text-base tracking-tight text-foreground">
                !todo
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-sm bg-primary-100 text-primary-800 border border-primary-200 dark:bg-primary-950 dark:text-primary-200 uppercase tracking-wider">
                Milestone Reached 🎉
              </span>
            </div>

            {/* Custom Congratulation Image / Fallback */}
            <div className="relative w-48 h-36 flex items-center justify-center my-1">
              {!imgError ? (
                <Image
                  src="/assets/images/congrats.png"
                  alt="7 Tasks Completed Congratulations"
                  width={200}
                  height={150}
                  priority
                  onError={() => setImgError(true)}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full rounded-md bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 flex flex-col items-center justify-center p-3 text-purple-600 dark:text-purple-300 space-y-1">
                  <Award className="w-10 h-10 text-primary-600 dark:text-primary-400" />
                  <span className="font-bold text-xs uppercase tracking-wider">
                    7 Tasks Milestone
                  </span>
                </div>
              )}
            </div>

            {/* Title & Subtitle */}
            <div className="space-y-1">
              <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center justify-center gap-1.5">
                <span>7 Tasks Completed Today!</span>
                <Sparkles className="w-5 h-5 text-amber-500" />
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-xs leading-relaxed">
                Outstanding focus & momentum! You&apos;ve accomplished 7 tasks today. Keep up the amazing work!
              </p>
            </div>

            {/* Metric Summary Grid */}
            <div className="w-full grid grid-cols-2 gap-2 pt-2 text-xs">
              <div className="p-2.5 rounded-sm border border-border bg-surface flex flex-col items-center">
                <span className="text-[10px] text-neutral-400 uppercase font-semibold">
                  Today&apos;s Score
                </span>
                <span className="text-base font-bold text-primary-600 dark:text-primary-400">
                  {completedTodayCount} Completed
                </span>
              </div>
              <div className="p-2.5 rounded-sm border border-border bg-surface flex flex-col items-center">
                <span className="text-[10px] text-neutral-400 uppercase font-semibold">
                  Productivity Rank
                </span>
                <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                  Top 1% 🔥
                </span>
              </div>
            </div>

            <div className="text-[10px] text-neutral-400 pt-1 font-mono">
              Proof of Progress • Powered by !todo task engine
            </div>
          </div>

          {/* Modal Footer Controls */}
          <div className="p-4 bg-surface flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleDownloadPhoto}
              disabled={isExporting}
              className="flex-1 inline-flex items-center justify-center gap-2 h-9 px-3 rounded-sm text-xs font-semibold bg-primary-600 hover:bg-primary-700 active:bg-primary-800 disabled:opacity-50 text-white transition-colors cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isExporting ? "Generating Photo..." : "Share Card as Photo"}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="h-9 px-4 rounded-sm text-xs font-medium border border-border bg-background hover:bg-neutral-100 dark:hover:bg-neutral-800 text-foreground transition-colors cursor-pointer"
            >
              Continue
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
