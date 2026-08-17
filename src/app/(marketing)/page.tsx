"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Footer } from "@/components/layout/Footer";

export default function MarketingPage() {
  return (
    <div className="h-screen w-screen overflow-y-auto bg-background text-foreground flex flex-col font-sans">
      {/* Header Navigation */}
      <header className="sticky top-0 z-50 border-b border-border bg-background shrink-0">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
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

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/inbox"
              className="inline-flex items-center justify-center h-8 px-3.5 rounded-sm text-xs font-semibold bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-white transition-colors shadow-xs cursor-pointer"
            >
              Open App
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center">
        {/* Hero Section */}
        <section className="w-full max-w-7xl mx-auto px-6 py-6 lg:py-10 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <div className="flex flex-col items-start space-y-4">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-[1.15]">
              Organize everything with{" "}
              <span className="text-primary-600 dark:text-primary-400 font-mono">
                !todo
              </span>
            </h1>

            <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-lg font-normal leading-relaxed">
              The minimalist, keyboard-first task manager designed for deep work.
              Capture ideas instantly with smart shortcuts, organize projects effortlessly,
              and focus on what truly matters.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto pt-1">
              <Link
                href="/inbox"
                className="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-sm text-xs font-semibold text-white bg-primary-600 hover:bg-primary-700 active:bg-primary-800 transition-colors shadow-xs cursor-pointer"
              >
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <a
                href="#features"
                className="inline-flex items-center justify-center h-10 px-5 rounded-sm text-xs font-medium border border-border bg-surface hover:bg-neutral-100 dark:hover:bg-neutral-800 text-foreground transition-colors cursor-pointer"
              >
                Learn More
              </a>
            </div>

            {/* Bullet Highlights */}
            <div className="grid sm:grid-cols-3 gap-3 pt-4 border-t border-border w-full text-xs text-neutral-500 dark:text-neutral-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary-500 shrink-0" />
                <span>Keyboard First</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary-500 shrink-0" />
                <span>Zero Clutter</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary-500 shrink-0" />
                <span>Instant Filtering</span>
              </div>
            </div>
          </div>

          {/* Right Hero Image */}
          <div className="flex justify-center lg:justify-end">
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative w-full max-w-md lg:max-w-lg"
            >
              <Image
                src="/assets/images/hero-isometric.png"
                alt="!todo application illustration"
                width={540}
                height={450}
                priority
                className="w-full h-auto object-contain rounded-md drop-shadow-xl"
              />
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full max-w-7xl mx-auto px-6 py-10 lg:py-14 border-t border-border">
          <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Engineered for clarity and speed
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
              Everything you need to manage your personal work and projects without getting overwhelmed.
            </p>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.15,
                },
              },
            }}
            className="grid md:grid-cols-3 gap-6"
          >
            {/* Feature 1 */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
              }}
              className="flex flex-col rounded-md border border-border bg-surface p-5 shadow-xs hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
            >
              <div className="relative w-full h-40 mb-4 rounded-md bg-neutral-100 dark:bg-neutral-900 overflow-hidden flex items-center justify-center p-3">
                <Image
                  src="/assets/images/feature-organize.png"
                  alt="Organize with Sections"
                  width={320}
                  height={200}
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-1">
                Organize with Sections
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Group tasks into custom sections, projects, and priority buckets effortlessly.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
              }}
              className="flex flex-col rounded-md border border-border bg-surface p-5 shadow-xs hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
            >
              <div className="relative w-full h-40 mb-4 rounded-md bg-neutral-100 dark:bg-neutral-900 overflow-hidden flex items-center justify-center p-3">
                <Image
                  src="/assets/images/feature-shortcuts.png"
                  alt="Smart Shortcuts"
                  width={320}
                  height={200}
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-1">
                Smart Shortcuts
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Type dates, priorities, and tags inline using intuitive natural language syntax.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
              }}
              className="flex flex-col rounded-md border border-border bg-surface p-5 shadow-xs hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
            >
              <div className="relative w-full h-40 mb-4 rounded-md bg-neutral-100 dark:bg-neutral-900 overflow-hidden flex items-center justify-center p-3">
                <Image
                  src="/assets/images/hero-isometric.png"
                  alt="Track Your Progress"
                  width={320}
                  height={200}
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-1">
                Track Your Progress
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Monitor completed tasks and track your productivity streaks in real-time.
              </p>
            </motion.div>
          </motion.div>
        </section>
      </main>

      {/* Landing Page Exclusive Footer Component */}
      <Footer />
    </div>
  );
}
