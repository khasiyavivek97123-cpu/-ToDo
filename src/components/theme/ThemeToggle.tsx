"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-8 h-8 rounded-sm bg-transparent" />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle theme"
      className="relative flex items-center justify-center w-8 h-8 rounded-sm bg-transparent text-neutral-500 hover:text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800/60 hover:shadow-[inset_0_1px_3px_rgba(0,0,0,0.05)] dark:hover:shadow-[inset_0_1px_3px_rgba(0,0,0,0.4)] transition-all focus:outline-none focus-visible:ring-1 focus-visible:ring-primary-500 cursor-pointer"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={isDark ? "dark" : "light"}
          initial={{ opacity: 0, rotate: -90, scale: 0.7 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 90, scale: 0.7 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="flex items-center justify-center"
        >
          {isDark ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-neutral-600" />
          )}
        </motion.div>
      </AnimatePresence>
    </button>
  );
}
