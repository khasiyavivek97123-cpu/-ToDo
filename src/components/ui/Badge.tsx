import React from "react";

export function Badge({
  children,
  className = "",
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-sm text-xs font-medium border border-border bg-surface text-foreground ${className}`}
    >
      {children}
    </span>
  );
}
