"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, Users } from "lucide-react";
import Link from "next/link";
import { DashboardTopbar } from "@/components/Dashboard/DashboardTopbar";
import { EmptyState } from "@/components/Dashboard/EmptyState";
import { Button } from "@/components/ui/Button";
import { BuilderFilters } from "@/components/admin/builders/BuilderFilters";
import { BuilderTable } from "@/components/admin/builders/BuilderTable";
import {
  listBuilders,
  type Builder,
} from "@/lib/builders";

export function BuildersPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [builders, setBuilders] = useState<Builder[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const search = searchParams.get("search") ?? "";
  const cohort = searchParams.get("cohort") ?? "";
  const team = searchParams.get("team") ?? "";

  const fetchBuilders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await listBuilders({
        search: search || undefined,
        cohort: cohort || undefined,
        team: team || undefined,
      });
      setBuilders(result.data);
      setCount(result.count);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load builders"
      );
    } finally {
      setLoading(false);
    }
  }, [search, cohort, team]);

  useEffect(() => {
    fetchBuilders();
  }, [fetchBuilders]);

  function setParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/admin/builders?${params.toString()}`);
  }

  function handleDeleted(id: string) {
    setBuilders((prev) => prev.filter((b) => b.id !== id));
    setCount((prev) => prev - 1);
  }

  return (
    <div className="space-y-8">
      <DashboardTopbar
        title="Builders"
        subtitle="View and manage all builders across cohorts and teams."
      />

      <BuilderFilters
        search={search}
        cohort={cohort}
        team={team}
        onSearchChange={(v) => setParam("search", v)}
        onCohortChange={(v) => setParam("cohort", v)}
        onTeamChange={(v) => setParam("team", v)}
      />

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-16 animate-pulse rounded-2xl bg-white/5"
            />
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-red-500/30 bg-red-500/5 px-8 py-16 text-center">
          <p className="text-sm text-red-400">{error}</p>
          <Button variant="outline" className="mt-4" onClick={fetchBuilders}>
            Retry
          </Button>
        </div>
      ) : builders.length === 0 ? (
        <EmptyState
          title="No builders found"
          description={
            search || cohort || team
              ? "No builders match the current filters. Try adjusting your search criteria."
              : "No builders have joined yet. Builders will appear here once they sign up."
          }
          icon={<Users className="h-10 w-10 text-electric-blue" />}
        />
      ) : (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {builders.length} of {count} builders
            </p>
            <Link href="/admin/builders/new">
              <Button variant="premium" className="gap-2">
                <Plus className="h-4 w-4" />
                New Builder
              </Button>
            </Link>
          </div>
          <BuilderTable builders={builders} onDeleted={handleDeleted} />
        </>
      )}
    </div>
  );
}