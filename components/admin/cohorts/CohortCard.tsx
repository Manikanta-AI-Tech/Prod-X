"use client";

import { CalendarDays, Users, Layers } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import type { Cohort, CohortStatus } from "@/lib/cohorts";

const statusConfig: Record<CohortStatus, { label: string; variant: "premium" | "success" | "secondary" | "destructive" }> = {
  upcoming: { label: "Upcoming", variant: "secondary" },
  active: { label: "Active", variant: "premium" },
  completed: { label: "Completed", variant: "success" },
};

interface CohortCardProps {
  cohort: Cohort;
  onDelete: (cohort: Cohort) => void;
}

export function CohortCard({ cohort, onDelete }: CohortCardProps) {
  return (
    <Link href={`/admin/cohorts/${cohort.id}/edit`} className="block transition hover:opacity-90">
      <Card className="p-5">
        <CardContent className="p-0">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-white truncate">
                  {cohort.name}
                </h3>
                <Badge variant={statusConfig[cohort.status].variant}>
                  {statusConfig[cohort.status].label}
                </Badge>
              </div>
              {cohort.description && (
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                  {cohort.description}
                </p>
              )}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5" />
              <span>
                {cohort.start_date} – {cohort.end_date}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5" />
              <span>Batch {cohort.batch_year}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" />
              <span>{cohort.team_count ?? 0} teams</span>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-border/20 pt-3">
            <span className="text-xs text-muted-foreground">
              {cohort.member_count ?? 0} members total
            </span>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete(cohort);
              }}
              className="rounded-lg px-2.5 py-1 text-xs text-red-400 transition hover:bg-red-500/10"
            >
              Delete
            </button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}