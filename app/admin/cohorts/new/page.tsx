"use client";

import { DashboardTopbar } from "@/components/Dashboard/DashboardTopbar";
import { CohortForm } from "@/components/admin/cohorts/CohortForm";

export default function NewCohortPage() {
  return (
    <div className="space-y-8">
      <DashboardTopbar
        title="New Cohort"
        subtitle="Create a new builder cohort to organize teams."
      />

      <div className="rounded-2xl border border-border/40 bg-card/40 p-6 md:p-8">
        <CohortForm />
      </div>
    </div>
  );
}