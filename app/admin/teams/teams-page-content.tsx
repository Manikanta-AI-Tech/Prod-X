"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, Users, Search } from "lucide-react";
import Link from "next/link";
import { DashboardTopbar } from "@/components/Dashboard/DashboardTopbar";
import { EmptyState } from "@/components/Dashboard/EmptyState";
import { Button } from "@/components/ui/Button";
import { TeamCard } from "@/components/admin/teams/TeamCard";
import { DeleteTeamDialog } from "@/components/admin/teams/DeleteTeamDialog";
import { listTeams, type Team, type TeamStatus } from "@/lib/teams";

const statusOptions: { label: string; value: TeamStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Completed", value: "completed" },
  { label: "Paused", value: "paused" },
];

export function TeamsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [teams, setTeams] = useState<Team[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Team | null>(null);

  const search = searchParams.get("search") ?? "";
  const status = (searchParams.get("status") ?? "all") as TeamStatus | "all";

  const fetchTeams = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await listTeams({
        search: search || undefined,
        status,
      });
      setTeams(result.data);
      setCount(result.count);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load teams");
    } finally {
      setLoading(false);
    }
  }, [search, status]);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  function setParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/admin/teams?${params.toString()}`);
  }

  function handleDeleted(id: string) {
    setTeams((prev) => prev.filter((t) => t.id !== id));
    setCount((prev) => prev - 1);
    setDeleteTarget(null);
  }

  const filterButtonClass = (active: boolean) =>
    `rounded-lg px-3 py-1.5 text-xs font-medium transition ${
      active
        ? "bg-electric-blue/20 text-electric-blue"
        : "text-muted-foreground hover:bg-white/5 hover:text-white"
    }`;

  return (
    <div className="space-y-8">
      <DashboardTopbar
        title="Teams"
        subtitle="Manage builder teams, track progress, and assign mentors."
      />

      {/* Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by team name, mentor, cohort, or product..."
            className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-4 text-sm text-white outline-none transition focus:border-electric-blue"
            value={search}
            onChange={(e) => setParam("search", e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">
            Status:
          </span>
          {statusOptions.map((option) => (
            <button
              key={option.value}
              className={filterButtonClass(status === option.value)}
              onClick={() => setParam("status", option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-52 animate-pulse rounded-2xl bg-white/5"
            />
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-red-500/30 bg-red-500/5 px-8 py-16 text-center">
          <p className="text-sm text-red-400">{error}</p>
          <Button variant="outline" className="mt-4" onClick={fetchTeams}>
            Retry
          </Button>
        </div>
      ) : teams.length === 0 ? (
        <EmptyState
          title="No teams yet"
          description={
            search || status !== "all"
              ? "No teams match the current filters."
              : "Teams will appear here once builders start forming groups."
          }
          icon={<Users className="h-10 w-10 text-electric-blue" />}
        />
      ) : (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {teams.length} of {count} teams
            </p>
            <Link href="/admin/teams/new">
              <Button variant="premium" className="gap-2">
                <Plus className="h-4 w-4" />
                New Team
              </Button>
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {teams.map((team) => (
              <TeamCard
                key={team.id}
                team={team}
                onDelete={setDeleteTarget}
              />
            ))}
          </div>
        </>
      )}

      <DeleteTeamDialog
        team={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onDeleted={handleDeleted}
      />
    </div>
  );
}