"use client";

import { ReactNode } from "react";
import { Inbox } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  title,
  description,
  icon,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/40 bg-card/40 px-8 py-16 text-center">
      <div className="mb-6 rounded-full bg-electric-blue/10 p-5">
        {icon ?? <Inbox className="h-10 w-10 text-electric-blue" />}
      </div>

      <h3 className="text-2xl font-semibold text-white">
        {title}
      </h3>

      <p className="mt-3 max-w-md text-sm text-muted-foreground">
        {description}
      </p>

      {actionLabel && (
        <Button
          className="mt-8"
          variant="premium"
          onClick={onAction}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}