"use client";

import { Users, ShieldCheck, Rocket, Activity, TrendingUp, TrendingDown, Minus, Users as UsersIcon, type LucideIcon } from "lucide-react";
import { DashboardTopbar } from "@/components/Dashboard/DashboardTopbar";
import { PageHeader } from "@/components/Dashboard/PageHeader";
import { MetricCard } from "@/components/Dashboard/MetricCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { adminKpis, cohortTrend, milestoneStats } from "@/data/mock";

const iconMap: Record<string, LucideIcon> = {
  Users,
  ShieldCheck,
  Rocket,
  Activity,
};

function getTrendIcon(change: number) {
  if (change > 0) return <TrendingUp className="h-4 w-4 text-emerald-400" />;
  if (change < 0) return <TrendingDown className="h-4 w-4 text-red-400" />;
  return <Minus className="h-4 w-4 text-muted-foreground" />;
}

export default function AdminAnalytics() {
  return (
    <div className="space-y-8">
      <DashboardTopbar
        title="Analytics"
        subtitle="Cohort metrics, KPIs, and milestone completion rates."
      />

      <PageHeader
        title="Analytics Overview"
        description="Track builder progress, cohort health, and milestone completion across the entire Prod[X] ecosystem."
      />

      {/* KPI Stat Cards */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {adminKpis.map((kpi) => (
          <MetricCard
            key={kpi.label}
            title={kpi.label}
            value={kpi.value}
            icon={iconMap[kpi.icon] || Users}
            trend={kpi.change}
            description={`${kpi.label.toLowerCase()} this cohort`}
          />
        ))}
      </div>

      {/* Cohort Trend Table */}
      <Card className="border-border/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-bold text-white">
            <Activity className="h-5 w-5 text-electric-blue" />
            Cohort Builder Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/40 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  <th className="px-4 py-3 text-left">Week</th>
                  <th className="px-4 py-3 text-right">Active Builders</th>
                  <th className="px-4 py-3 text-right">Shipped</th>
                  <th className="px-4 py-3 text-right">Dropped</th>
                  <th className="px-4 py-3 text-right">Retention</th>
                </tr>
              </thead>
              <tbody>
                {cohortTrend.map((point) => {
                  const total = point.active + point.dropped;
                  const retention = total > 0 ? Math.round((point.active / total) * 100) : 0;
                  return (
                    <tr
                      key={point.label}
                      className="group border-b border-border/20 transition-colors last:border-0 hover:bg-white/[0.02]"
                    >
                      <td className="px-4 py-4">
                        <span className="font-medium text-white">{point.label}</span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <span className="font-semibold text-white">{point.active}</span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <span className="font-semibold text-emerald-400">{point.shipped}</span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <span className="font-semibold text-red-400">{point.dropped}</span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <div className="h-2 w-24 overflow-hidden rounded-full bg-white/10">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-electric-blue to-purple-500 transition-all"
                              style={{ width: `${retention}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">{retention}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Milestone Completion Rates */}
      <Card className="border-border/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-bold text-white">
            <Rocket className="h-5 w-5 text-electric-blue" />
            Milestone Completion Rates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {milestoneStats.map((ms) => (
              <div key={ms.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white">{ms.name}</span>
                  <span className="text-sm font-bold text-white">{ms.completionRate}%</span>
                </div>
                <div className="relative h-3 overflow-hidden rounded-full bg-white/10">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      ms.completionRate >= 80
                        ? "bg-gradient-to-r from-emerald-500 to-emerald-400"
                        : ms.completionRate >= 50
                          ? "bg-gradient-to-r from-electric-blue to-purple-500"
                          : ms.completionRate >= 30
                            ? "bg-gradient-to-r from-amber-500 to-amber-400"
                            : "bg-gradient-to-r from-red-500 to-red-400"
                    }`}
                    style={{ width: `${ms.completionRate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats Row */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="border-border/40">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-electric-blue/10">
                <UsersIcon className="h-5 w-5 text-electric-blue" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Active (Wk 6)</p>
                <p className="text-xl font-bold text-white">{cohortTrend[cohortTrend.length - 1]?.active ?? 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/40">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                <Rocket className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Shipped</p>
                <p className="text-xl font-bold text-white">{cohortTrend.reduce((a, b) => a + b.shipped, 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/40">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10">
                <TrendingDown className="h-5 w-5 text-red-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Dropped</p>
                <p className="text-xl font-bold text-white">{cohortTrend.reduce((a, b) => a + b.dropped, 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}