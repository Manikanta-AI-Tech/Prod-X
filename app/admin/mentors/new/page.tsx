"use client";

import { DashboardTopbar } from "@/components/Dashboard/DashboardTopbar";
import { MentorForm } from "@/components/admin/mentors/MentorForm";

export default function NewMentorPage() {
  return (
    <div className="space-y-8">
      <DashboardTopbar title="New Mentor" subtitle="Add a new mentor to the ecosystem." />
      <div className="rounded-2xl border border-border/40 bg-card/40 p-6 md:p-8">
        <MentorForm />
      </div>
    </div>
  );
}