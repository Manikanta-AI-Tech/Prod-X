"use client";

import { Users } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { Progress } from "@/components/ui/Progress";
import type { Team, TeamStatus } from "@/lib/teams";

const statusConfig: Record<TeamStatus, { label: string; variant: "premium" | "success" | "secondary" | "destructive" }> = {
  active: { label: "Active", variant: "premium" },
  completed: { label: "Completed", variant: "success" },
  paused: { label: "Paused", variant: "secondary" },
};

interface TeamCardProps {
  team: Team;
  onDelete: (team: Team) => void;
}

export function TeamCard({ team, onDelete }: TeamCardProps) {
  const initials = team.members
    ? team.members
        .slice(0, 3)
        .map((m) => m.name.charAt(0).toUpperCase())
        .join("")
    : "";

  return (
    <Link
      href={`/admin/teams/${team.id}/edit`}
      className="block transition hover:opacity-90"
    >
      <Card className="p-5">
        <CardContent className="p-0">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-white truncate">
                  {team.name}
                </h3>
                <Badge variant={statusConfig[team.status].variant}>
                  {statusConfig[team.status].label}
                </Badge>
              </div>
              {team.description && (
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                  {team.description}
                </p>
              )}
            </div>
          </div>

          {/* Progress */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium text-white">{team.progress}%</span>
            </div>
            <Progress value={team.progress} className="mt-1.5 h-2" />
          </div>

          {/* Team info */}
          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            {team.cohort_name && <span>{team.cohort_name}</span>}
            {team.mentor_name && (
              <span>Mentor: {team.mentor_name}</span>
            )}
            {team.product_name && (
              <span>Product: {team.product_name}</span>
            )}
          </div>

          {/* Members */}
          <div className="mt-4 flex items-center justify-between border-t border-border/20 pt-3">
            <div className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" />
              <span className="text-xs text-muted-foreground">
                {team.member_count ?? 0} members
              </span>
            </div>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete(team);
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
