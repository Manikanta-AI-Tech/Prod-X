"use client";

import { DashboardTopbar } from "@/components/Dashboard/DashboardTopbar";
import { BuilderForm } from "@/components/admin/builders/BuilderForm";

export default function NewBuilderPage() {
  return (
    <div className="space-y-8">
      <DashboardTopbar
        title="New Builder"
        subtitle="Add a new builder to the ecosystem."
      />

      <div className="rounded-2xl border border-border/40 bg-card/40 p-6 md:p-8">
        <BuilderForm />
      </div>
    </div>
  );
}