"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Inbox, Calendar, CalendarDays, Layers, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Modal } from "@/components/ui/Modal";
import { QuickAddInput } from "@/components/tasks/QuickAddInput";

export function MobileNav() {
  const pathname = usePathname();
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-16 border-t border-border bg-background flex items-center justify-around px-3 select-none">
        {/* Left Item 1: Inbox */}
        <Link
          href="/inbox"
          className={cn(
            "flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-sm text-[10px] font-medium transition-colors",
            pathname === "/inbox"
              ? "text-primary-600 dark:text-primary-400 font-semibold"
              : "text-neutral-500 hover:text-foreground"
          )}
        >
          <Inbox className="w-5 h-5 shrink-0" />
          <span>Inbox</span>
        </Link>

        {/* Left Item 2: Today */}
        <Link
          href="/today"
          className={cn(
            "flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-sm text-[10px] font-medium transition-colors",
            pathname === "/today"
              ? "text-primary-600 dark:text-primary-400 font-semibold"
              : "text-neutral-500 hover:text-foreground"
          )}
        >
          <Calendar className="w-5 h-5 shrink-0" />
          <span>Today</span>
        </Link>

        {/* Center Elevated Quick Add Button */}
        <button
          type="button"
          onClick={() => setIsQuickAddOpen(true)}
          aria-label="Quick Add Task"
          className="relative -top-3 w-11 h-11 rounded-md bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white flex items-center justify-center shadow-lg shadow-primary-600/30 ring-4 ring-background transition-transform active:scale-95 shrink-0 cursor-pointer"
        >
          <Plus className="w-5 h-5" />
        </button>

        {/* Right Item 1: Upcoming */}
        <Link
          href="/upcoming"
          className={cn(
            "flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-sm text-[10px] font-medium transition-colors",
            pathname === "/upcoming"
              ? "text-primary-600 dark:text-primary-400 font-semibold"
              : "text-neutral-500 hover:text-foreground"
          )}
        >
          <CalendarDays className="w-5 h-5 shrink-0" />
          <span>Upcoming</span>
        </Link>

        {/* Right Item 2: Backlog */}
        <Link
          href="/backlog"
          className={cn(
            "flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-sm text-[10px] font-medium transition-colors",
            pathname === "/backlog"
              ? "text-primary-600 dark:text-primary-400 font-semibold"
              : "text-neutral-500 hover:text-foreground"
          )}
        >
          <Layers className="w-5 h-5 shrink-0" />
          <span>Backlog</span>
        </Link>
      </nav>

      {/* Quick Add Modal */}
      <Modal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        title="Create New Task"
      >
        <QuickAddInput onSubmitted={() => setIsQuickAddOpen(false)} />
      </Modal>
    </>
  );
}
