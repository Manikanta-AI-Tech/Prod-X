"use client";

import { DashboardTopbar } from "@/components/Dashboard/DashboardTopbar";
import { TeamForm } from "@/components/admin/teams/TeamForm";

export default function NewTeamPage() {
  return (
    <div className="space-y-8">
      <DashboardTopbar
        title="New Team"
        subtitle="Create a new team and assign a cohort, product, and mentor."
      />

      <div className="rounded-2xl border border-border/40 bg-card/40 p-6 md:p-8">
        <TeamForm />
      </div>
    </div>
  );
}