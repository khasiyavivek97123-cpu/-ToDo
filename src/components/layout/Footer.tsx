import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, MapPin, Mail } from "lucide-react";

function LinkedinIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-background py-8 lg:py-10 shrink-0">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Left Column: Brand, Tagline, Feature List & Contact */}
        <div className="flex flex-col items-start space-y-4">
          {/* Brand Logo & Name */}
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-lg tracking-tight group"
          >
            <Image
              src="/assets/images/logo-mark.png"
              alt="!todo logo mark"
              width={24}
              height={24}
              className="w-6 h-6 object-contain transition-transform group-hover:scale-105"
            />
            <span className="text-foreground">todo</span>
          </Link>

          {/* Tagline */}
          <p className="text-xs text-neutral-500 max-w-md">
            The minimalist, keyboard-first task manager designed for deep work and complete task clarity.
          </p>

          {/* Compact Feature Bullet Points */}
          <ul className="space-y-1.5 text-xs text-neutral-600 dark:text-neutral-400">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-primary-500 shrink-0" />
              <span>Smart shortcuts for dates & priority</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-primary-500 shrink-0" />
              <span>Sections & projects organization</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-primary-500 shrink-0" />
              <span>Daily tracking & streak analytics</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-primary-500 shrink-0" />
              <span>Attachments on tasks</span>
            </li>
          </ul>

          {/* Contact Block */}
          <div className="w-full pt-4 border-t border-border space-y-2 text-xs text-neutral-600 dark:text-neutral-400">
            <div className="font-semibold text-foreground text-xs">
              Vivek Khasiya
            </div>
            <div className="flex items-center gap-1.5 text-neutral-500 text-xs">
              <MapPin className="w-3.5 h-3.5 text-primary-500 shrink-0" />
              <span>Ahmedabad, Gujarat, India</span>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-1">
              <a
                href="mailto:khasiyavivek86@gmail.com"
                className="inline-flex items-center gap-1.5 text-neutral-600 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium"
              >
                <Mail className="w-3.5 h-3.5 text-primary-500 shrink-0" />
                <span>khasiyavivek86@gmail.com</span>
              </a>

              <a
                href="https://www.linkedin.com/in/vivek-khasiya-0aa6b1305/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-neutral-600 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium"
              >
                <LinkedinIcon className="w-3.5 h-3.5 text-primary-500 shrink-0" />
                <span>LinkedIn</span>
              </a>
            </div>
          </div>

          <p className="text-[11px] text-neutral-400 pt-2">
            &copy; {new Date().getFullYear()} !todo. All rights reserved.
          </p>
        </div>

        {/* Right Column: Footer Isometric Illustration */}
        <div className="flex justify-center lg:justify-end items-center">
          <div className="relative w-full max-w-sm lg:max-w-md">
            <Image
              src="/assets/images/footer-isometric.png"
              alt="!todo footer illustration"
              width={420}
              height={340}
              className="w-full h-auto object-contain rounded-md"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
