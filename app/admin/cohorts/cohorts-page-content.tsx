"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, CalendarDays, Search } from "lucide-react";
import Link from "next/link";
import { DashboardTopbar } from "@/components/Dashboard/DashboardTopbar";
import { EmptyState } from "@/components/Dashboard/EmptyState";
import { Button } from "@/components/ui/Button";
import { CohortCard } from "@/components/admin/cohorts/CohortCard";
import { DeleteCohortDialog } from "@/components/admin/cohorts/DeleteCohortDialog";
import {
  listCohorts,
  type Cohort,
  type CohortStatus,
} from "@/lib/cohorts";

const statusOptions: { label: string; value: CohortStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Upcoming", value: "upcoming" },
  { label: "Active", value: "active" },
  { label: "Completed", value: "completed" },
];

export function CohortsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Cohort | null>(null);

  const search = searchParams.get("search") ?? "";
  const status = (searchParams.get("status") ?? "all") as CohortStatus | "all";

  const fetchCohorts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await listCohorts({
        search: search || undefined,
        status,
      });
      setCohorts(result.data);
      setCount(result.count);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load cohorts"
      );
    } finally {
      setLoading(false);
    }
  }, [search, status]);

  useEffect(() => {
    fetchCohorts();
  }, [fetchCohorts]);

  function setParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/admin/cohorts?${params.toString()}`);
  }

  function handleDeleted(id: string) {
    setCohorts((prev) => prev.filter((c) => c.id !== id));
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
        title="Cohorts"
        subtitle="Manage builder cohorts and track team participation."
      />

      {/* Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search cohorts..."
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
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-48 animate-pulse rounded-2xl bg-white/5"
            />
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-red-500/30 bg-red-500/5 px-8 py-16 text-center">
          <p className="text-sm text-red-400">{error}</p>
          <Button variant="outline" className="mt-4" onClick={fetchCohorts}>
            Retry
          </Button>
        </div>
      ) : cohorts.length === 0 ? (
        <div className="space-y-6">
          <EmptyState
            title="No cohorts yet"
            description={
              search || status !== "all"
                ? "No cohorts match the current filters."
                : "Create your first cohort to start organizing builder teams."
            }
            icon={<CalendarDays className="h-10 w-10 text-electric-blue" />}
          />

          {!search && status === "all" && (
            <div className="flex justify-center">
              <Link href="/admin/cohorts/new">
                <Button variant="premium" className="gap-2">
                  <Plus className="h-4 w-4" />
                  New Cohort
                </Button>
              </Link>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {cohorts.length} of {count} cohorts
            </p>

            <Link href="/admin/cohorts/new">
              <Button variant="premium" className="gap-2">
                <Plus className="h-4 w-4" />
                New Cohort
              </Button>
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {cohorts.map((cohort) => (
              <CohortCard
                key={cohort.id}
                cohort={cohort}
                onDelete={setDeleteTarget}
              />
            ))}
          </div>
        </>
      )}
      <DeleteCohortDialog
        cohort={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onDeleted={handleDeleted}
      />
    </div>
  );
}