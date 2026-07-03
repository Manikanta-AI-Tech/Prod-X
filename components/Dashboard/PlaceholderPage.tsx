"use client";

import { ReactNode } from "react";
import { PageHeader } from "./PageHeader";
import { EmptyState } from "./EmptyState";

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon?: ReactNode;
}

export function PlaceholderPage({
  title,
  description,
  icon,
}: PlaceholderPageProps) {
  return (
    <div className="space-y-8">
      <PageHeader
        title={title}
        description={description}
      />

      <EmptyState
        title={`${title} Module`}
        description="This section is currently under development and will be available in the next sprint."
        icon={icon}
      />
    </div>
  );
}