"use client";

import { usePathname } from "next/navigation";
import { Search, User } from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

function getPageTitle(pathname: string): string {
  if (pathname === "/inbox") return "Inbox";
  if (pathname === "/today") return "Today";
  if (pathname === "/upcoming") return "Upcoming";
  if (pathname === "/backlog") return "Backlog";
  if (pathname === "/dashboard") return "Dashboard";
  if (pathname.startsWith("/project/")) {
    const id = pathname.split("/project/")[1];
    return `Project: ${id ? id.charAt(0).toUpperCase() + id.slice(1) : "Overview"}`;
  }
  return "Workspace";
}

export function Topbar() {
  const pathname = usePathname();
  const title = getPageTitle(pathname);

  return (
    <header className="sticky top-0 z-30 h-14 border-b border-border bg-background px-4 sm:px-6 flex items-center justify-between">
      {/* Dynamic Page Title */}
      <h1 className="text-lg font-bold tracking-tight text-foreground truncate">
        {title}
      </h1>

      {/* Right Action Controls */}
      <div className="flex items-center gap-1.5">
        {/* Search Input Button */}
        <button
          type="button"
          aria-label="Search"
          className="flex items-center gap-2 h-8 px-2.5 rounded-sm border border-border bg-transparent text-neutral-500 hover:text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800/60 hover:shadow-[inset_0_1px_3px_rgba(0,0,0,0.05)] dark:hover:shadow-[inset_0_1px_3px_rgba(0,0,0,0.4)] transition-all text-xs font-medium cursor-pointer"
        >
          <Search className="w-3.5 h-3.5 text-neutral-400" />
          <span className="hidden sm:inline">Search...</span>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 rounded-sm">
            ⌘K
          </kbd>
        </button>

        {/* Theme Toggle Button */}
        <ThemeToggle />

        {/* User Avatar */}
        <button
          type="button"
          aria-label="User Profile"
          className="w-8 h-8 rounded-full bg-primary-600 hover:bg-primary-700 text-white font-medium text-xs flex items-center justify-center ring-2 ring-background hover:ring-primary-500 hover:shadow-[inset_0_1px_3px_rgba(0,0,0,0.2)] transition-all cursor-pointer"
        >
          <User className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
}
