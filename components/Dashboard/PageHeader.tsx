"use client";

import { ReactNode } from "react";
import { Button } from "@/components/ui/Button";

interface PageHeaderProps {
  title: string;
  description?: string;
  actionLabel?: string;
  actionIcon?: ReactNode;
  onAction?: () => void;
}

export function PageHeader({
  title,
  description,
  actionLabel,
  actionIcon,
  onAction,
}: PageHeaderProps) {
  return (
    <div className="mb-8 flex flex-col items-start justify-between gap-4 border-b border-border/40 pb-6 md:flex-row md:items-center">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white">
          {title}
        </h2>

        {description && (
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>

      {actionLabel && (
        <Button
          variant="premium"
          onClick={onAction}
          className="flex items-center gap-2"
        >
          {actionIcon}
          {actionLabel}
        </Button>
      )}
    </div>
  );
}