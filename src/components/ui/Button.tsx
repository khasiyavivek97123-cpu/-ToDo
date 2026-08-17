import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

export function Button({
  children,
  variant = "secondary",
  size = "sm",
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-sm transition-all duration-150 cursor-pointer select-none disabled:opacity-50 disabled:pointer-events-none";

  const sizeStyles = {
    sm: "h-8 px-2.5 text-xs",
    md: "h-9 px-3.5 text-xs",
    lg: "h-10 px-4 text-sm",
  };

  const variantStyles = {
    primary:
      "bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 border border-transparent hover:shadow-[inset_0_1px_3px_rgba(0,0,0,0.2)] active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]",
    secondary:
      "bg-transparent border border-border text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800/60 hover:shadow-[inset_0_1px_3px_rgba(0,0,0,0.05)] dark:hover:shadow-[inset_0_1px_3px_rgba(0,0,0,0.4)]",
    ghost:
      "bg-transparent text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800/60 hover:text-foreground hover:shadow-[inset_0_1px_3px_rgba(0,0,0,0.05)] dark:hover:shadow-[inset_0_1px_3px_rgba(0,0,0,0.4)] border border-transparent",
    danger:
      "bg-red-500 text-white hover:bg-red-600 active:bg-red-700 border border-transparent hover:shadow-[inset_0_1px_3px_rgba(0,0,0,0.2)]",
  };

  return (
    <button
      className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
}
