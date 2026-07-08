"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { DashboardTopbar } from "@/components/Dashboard/DashboardTopbar";
import { MentorProfileCard } from "@/components/admin/mentors/MentorProfileCard";
import { getMentor, type Mentor } from "@/lib/mentors";

export default function MentorProfilePage() {
  const params = useParams<{ id: string }>();
  const [mentor, setMentor] = useState<Mentor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getMentor(params.id);
        setMentor(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Mentor not found");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [params.id]);

  if (loading) {
    return (
      <div className="space-y-8">
        <div><div className="h-8 w-48 animate-pulse rounded-lg bg-white/5" /><div className="mt-2 h-4 w-64 animate-pulse rounded-lg bg-white/5" /></div>
        <div className="h-96 animate-pulse rounded-2xl bg-white/5" />
      </div>
    );
  }

  if (error || !mentor) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-red-500/30 bg-red-500/5 px-8 py-16 text-center">
        <p className="text-sm text-red-400">{error ?? "Mentor not found"}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <DashboardTopbar title={mentor.name} subtitle="Mentor profile and assignment overview." />
      <MentorProfileCard mentor={mentor} />
    </div>
  );
}