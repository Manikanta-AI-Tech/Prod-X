"use client";

import { Users, UserCheck, Rocket, ClipboardList } from "lucide-react";
import { DashboardTopbar } from "@/components/dashboard/DashboardTopbar";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { MetricCard } from "@/components/dashboard/MetricCard";

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <DashboardTopbar
        title="Mission Control"
        subtitle="Manage your cohorts, teams, mentors and products."
      />

      <PageHeader
        title="Mission Control"
        description="Your central operating system for managing the entire Prod[X] ecosystem."
      />

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Builders"
          value="128"
          icon={Users}
          trend={12}
          description="Active builders"
        />

        <MetricCard
          title="Mentors"
          value="14"
          icon={UserCheck}
          trend={4}
          description="Industry mentors"
        />

        <MetricCard
          title="Products"
          value="27"
          icon={Rocket}
          trend={18}
          description="Products under development"
        />

        <MetricCard
          title="Pending Reviews"
          value="42"
          icon={ClipboardList}
          trend={-3}
          description="Awaiting mentor review"
        />
      </div>

      <div className="rounded-2xl border border-border/40 bg-card/40 p-8">
        <h2 className="mb-6 text-xl font-semibold text-white">
          Mission Control Overview
        </h2>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-border/30 p-6">
            <h3 className="mb-3 font-semibold text-white">
              Recent Activity
            </h3>

            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>✅ Team Alpha submitted Sprint 2.</li>
              <li>🚀 Builder Passport updated.</li>
              <li>🎯 Mentor review completed.</li>
              <li>📦 New product milestone reached.</li>
            </ul>
          </div>

          <div className="rounded-xl border border-border/30 p-6">
            <h3 className="mb-3 font-semibold text-white">
              Quick Actions
            </h3>

            <div className="grid gap-3">
              <button className="rounded-lg border border-border/40 p-3 text-left transition hover:border-electric-blue">
                Create Challenge
              </button>

              <button className="rounded-lg border border-border/40 p-3 text-left transition hover:border-electric-blue">
                Assign Mentor
              </button>

              <button className="rounded-lg border border-border/40 p-3 text-left transition hover:border-electric-blue">
                View Builder Progress
              </button>

              <button className="rounded-lg border border-border/40 p-3 text-left transition hover:border-electric-blue">
                Generate Weekly Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}