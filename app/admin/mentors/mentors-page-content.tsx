"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, GraduationCap } from "lucide-react";
import Link from "next/link";
import { DashboardTopbar } from "@/components/Dashboard/DashboardTopbar";
import { EmptyState } from "@/components/Dashboard/EmptyState";
import { Button } from "@/components/ui/Button";
import { MentorFilters } from "@/components/admin/mentors/MentorFilters";
import { MentorTable } from "@/components/admin/mentors/MentorTable";
import { listMentors, type Mentor } from "@/lib/mentors";

export function MentorsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const search = searchParams.get("search") ?? "";
  const expertise = searchParams.get("expertise") ?? "";

  const fetchMentors = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await listMentors({
        search: search || undefined,
        expertise: expertise || undefined,
      });
      setMentors(result.data);
      setCount(result.count);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load mentors");
    } finally {
      setLoading(false);
    }
  }, [search, expertise]);

  useEffect(() => { fetchMentors(); }, [fetchMentors]);

  function setParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`/admin/mentors?${params.toString()}`);
  }

  function handleDeleted(id: string) {
    setMentors((prev) => prev.filter((m) => m.id !== id));
    setCount((prev) => prev - 1);
  }

  return (
    <div className="space-y-8">
      <DashboardTopbar title="Mentors" subtitle="Manage mentors, view their expertise, and track assignments." />

      <MentorFilters
        search={search}
        expertise={expertise}
        onSearchChange={(v) => setParam("search", v)}
        onExpertiseChange={(v) => setParam("expertise", v)}
      />

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-2xl bg-white/5" />
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-red-500/30 bg-red-500/5 px-8 py-16 text-center">
          <p className="text-sm text-red-400">{error}</p>
          <Button variant="outline" className="mt-4" onClick={fetchMentors}>Retry</Button>
        </div>
      ) : mentors.length === 0 ? (
        <EmptyState
          title="No mentors found"
          description={search || expertise ? "No mentors match the current filters." : "No mentors have been added yet."}
          icon={<GraduationCap className="h-10 w-10 text-electric-blue" />}
        />
      ) : (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Showing {mentors.length} of {count} mentors</p>
            <Link href="/admin/mentors/new">
              <Button variant="premium" className="gap-2"><Plus className="h-4 w-4" /> New Mentor</Button>
            </Link>
          </div>
          <MentorTable mentors={mentors} onDeleted={handleDeleted} />
        </>
      )}
    </div>
  );
}