import React from "react";
import Image from "next/image";

interface EmptyStateProps {
  imageSrc?: string;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

export function EmptyState({
  imageSrc,
  title,
  subtitle,
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-8 px-4 text-center border border-dashed border-border rounded-md bg-surface">
      {imageSrc ? (
        <div className="relative w-32 h-32 mb-3 flex items-center justify-center">
          <Image
            src={imageSrc}
            alt={title}
            width={128}
            height={128}
            className="w-full h-full object-contain"
          />
        </div>
      ) : icon ? (
        <div className="w-10 h-10 rounded-sm bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-400 flex items-center justify-center mb-2">
          {icon}
        </div>
      ) : null}
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      {subtitle && (
        <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mt-0.5">
          {subtitle}
        </p>
      )}
    </div>
  );
}
