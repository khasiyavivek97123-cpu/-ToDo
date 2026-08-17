"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Inbox,
  Calendar,
  CalendarDays,
  Layers,
  LayoutDashboard,
  Plus,
  Hash,
  Trash2,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const mainNavItems = [
  { name: "Inbox", href: "/inbox", icon: Inbox },
  { name: "Today", href: "/today", icon: Calendar },
  { name: "Upcoming", href: "/upcoming", icon: CalendarDays },
  { name: "Backlog", href: "/backlog", icon: Layers },
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const sections = useAppStore((state) => state.sections);
  const addSection = useAppStore((state) => state.addSection);
  const deleteSection = useAppStore((state) => state.deleteSection);

  const [isAddingSection, setIsAddingSection] = useState(false);
  const [newSectionName, setNewSectionName] = useState("");

  const handleAddSection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSectionName.trim()) return;

    const createdSection = addSection(newSectionName.trim());
    setNewSectionName("");
    setIsAddingSection(false);

    router.push(`/project/${createdSection.id}`);
  };

  const handleDeleteSection = (e: React.MouseEvent, sectionId: string, sectionName: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm(`Delete section "${sectionName}"?`)) {
      deleteSection(sectionId);
      if (pathname === `/project/${sectionId}`) {
        router.push("/inbox");
      }
    }
  };

  return (
    <aside className="hidden md:flex md:w-[240px] flex-col h-full border-r border-border bg-surface shrink-0 select-none overflow-hidden">
      {/* Logo Header */}
      <div className="h-14 px-4 flex items-center border-b border-border shrink-0">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg tracking-tight group">
          <Image
            src="/assets/images/logo-mark.png"
            alt="!todo logo mark"
            width={24}
            height={24}
            className="w-6 h-6 object-contain transition-transform group-hover:scale-105"
          />
          <span className="text-foreground">todo</span>
        </Link>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4">
        <nav className="space-y-1">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <motion.div
                key={item.href}
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
              >
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2.5 px-2.5 py-1.5 rounded-sm text-xs font-medium transition-all duration-150",
                    isActive
                      ? "bg-primary-600 text-white font-semibold shadow-[inset_0_1px_3px_rgba(0,0,0,0.2)] dark:bg-primary-950 dark:text-primary-300"
                      : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800/60 hover:shadow-[inset_0_1px_3px_rgba(0,0,0,0.05)] dark:hover:shadow-[inset_0_1px_3px_rgba(0,0,0,0.4)] hover:text-primary-700 dark:hover:text-primary-300"
                  )}
                >
                  <Icon
                    className={cn(
                      "w-4 h-4 shrink-0 transition-colors",
                      isActive
                        ? "text-white dark:text-primary-400"
                        : "text-neutral-500 dark:text-neutral-400 group-hover:text-primary-700"
                    )}
                  />
                  <span>{item.name}</span>
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* Sections Area */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-2.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
              Sections
            </span>
          </div>

          <div className="space-y-1">
            {sections.map((section) => {
              const sectionHref = `/project/${section.id}`;
              const isActive = pathname === sectionHref;
              return (
                <motion.div
                  key={section.id}
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="group relative"
                >
                  <Link
                    href={sectionHref}
                    className={cn(
                      "flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-sm text-xs font-medium transition-all duration-150",
                      isActive
                        ? "bg-primary-600 text-white font-semibold shadow-[inset_0_1px_3px_rgba(0,0,0,0.2)] dark:bg-primary-950 dark:text-primary-300"
                        : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800/60 hover:shadow-[inset_0_1px_3px_rgba(0,0,0,0.05)] dark:hover:shadow-[inset_0_1px_3px_rgba(0,0,0,0.4)] hover:text-primary-700 dark:hover:text-primary-300"
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <Hash className={cn(
                        "w-3.5 h-3.5 shrink-0 transition-colors",
                        isActive ? "text-white" : "text-neutral-400 group-hover:text-primary-600"
                      )} />
                      <span className="truncate">{section.name}</span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handleDeleteSection(e, section.id, section.name)}
                      title="Delete section"
                      className={cn(
                        "p-0.5 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shrink-0",
                        isActive ? "text-white/80 hover:text-white" : "text-neutral-400 hover:text-red-500"
                      )}
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Inline Add Section Form */}
          {isAddingSection ? (
            <form onSubmit={handleAddSection} className="px-2.5 pt-1">
              <input
                type="text"
                value={newSectionName}
                onChange={(e) => setNewSectionName(e.target.value)}
                placeholder="Section name..."
                autoFocus
                onBlur={() => {
                  if (!newSectionName.trim()) setIsAddingSection(false);
                }}
                className="w-full h-8 px-2 rounded-sm border border-primary-400 bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary-500 shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)]"
              />
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setIsAddingSection(true)}
              className="flex items-center gap-2 px-2.5 py-1.5 w-full rounded-sm text-xs font-medium text-neutral-500 hover:text-primary-700 dark:hover:text-primary-300 hover:bg-neutral-100 dark:hover:bg-neutral-800/60 hover:shadow-[inset_0_1px_3px_rgba(0,0,0,0.05)] transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Section</span>
            </button>
          )}
        </div>
      </div>

      {/* Footer / Theme Toggle */}
      <div className="p-3 border-t border-border flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300 font-medium text-[10px] flex items-center justify-center">
            ME
          </div>
          <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
            My Workspace
          </span>
        </div>
        <ThemeToggle />
      </div>
    </aside>
  );
}
