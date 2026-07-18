"use client";

import { useEffect, useState } from "react";
import { Users, ShieldCheck, Rocket, Activity, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { DashboardTopbar } from "@/components/Dashboard/DashboardTopbar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { MetricCard } from "@/components/Dashboard/MetricCard";
import { supabase } from "@/lib/supabase/client";

export default function AdminAnalytics() {
  const [stats, setStats] = useState({ teams: 0, members: 0, products: 0, milestones: [] as any[] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { count: tc } = await supabase.from("teams").select("*", { count: "exact", head: true });
      const { count: mc } = await supabase.from("team_members").select("*", { count: "exact", head: true });
      const { count: pc } = await supabase.from("products").select("*", { count: "exact", head: true });
      const { data: ms } = await supabase.from("milestones").select("*").order("day_number");
      setStats({
        teams: tc || 0, members: mc || 0, products: pc || 0,
        milestones: ms?.map((m: any) => ({ name: m.title, completionRate: m.status === "completed" ? 100 : m.status === "current" ? 50 : 0 })) || [],
      });
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) return <div className="p-8 text-white"><div className="h-8 w-48 animate-pulse rounded-lg bg-white/5" /></div>;

  const kpis = [
    { label: "Active Builders", value: stats.members, change: stats.members > 0 ? 100 : 0, icon: "Users" },
    { label: "Active Teams", value: stats.teams, change: stats.teams > 0 ? 100 : 0, icon: "ShieldCheck" },
    { label: "Products", value: stats.products, change: stats.products > 0 ? 100 : 0, icon: "Rocket" },
    { label: "Milestones", value: `${stats.milestones.filter((m: any) => m.completionRate === 100).length}/${stats.milestones.length}`, change: 0, icon: "Activity" },
  ];

  const iconMap: Record<string, any> = { Users, ShieldCheck, Rocket, Activity };
  const cohortTrend = [
    { label: "Teams", active: stats.teams, shipped: Math.round(stats.teams * 0.6) },
    { label: "Members", active: stats.members, shipped: Math.round(stats.members * 0.5) },
    { label: "Products", active: stats.products, shipped: Math.round(stats.products * 0.3) },
  ];

  return (
    <div className="space-y-8">
      <DashboardTopbar title="Analytics" subtitle="Cohort metrics, KPIs, and milestone completion rates." />
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">{kpis.map(kpi => (
        <MetricCard key={kpi.label} title={kpi.label} value={kpi.value} icon={iconMap[kpi.icon] || Users} trend={kpi.change} description={`${kpi.label.toLowerCase()} this cohort`} />
      ))}</div>
      <Card className="border-border/40">
        <CardHeader><CardTitle className="flex items-center gap-2 text-lg font-bold text-white"><Activity className="h-5 w-5 text-electric-blue" /> Cohort Overview</CardTitle></CardHeader>
        <CardContent>
          <table className="w-full">
            <thead><tr className="border-b border-border/40 text-xs font-medium uppercase tracking-wider text-muted-foreground"><th className="px-4 py-3 text-left">Metric</th><th className="px-4 py-3 text-right">Active</th><th className="px-4 py-3 text-right">Progress</th><th className="px-4 py-3 text-right">Rate</th></tr></thead>
            <tbody>{cohortTrend.map(point => {
              const rate = point.active > 0 ? Math.round((point.shipped / point.active) * 100) : 0;
              return (<tr key={point.label} className="border-b border-border/20 transition-colors last:border-0 hover:bg-white/[0.02]">
                <td className="px-4 py-4"><span className="font-medium text-white">{point.label}</span></td>
                <td className="px-4 py-4 text-right"><span className="font-semibold text-white">{point.active}</span></td>
                <td className="px-4 py-4 text-right"><span className="font-semibold text-emerald-400">{point.shipped}</span></td>
                <td className="px-4 py-4 text-right"><div className="flex items-center justify-end gap-3"><div className="h-2 w-24 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-electric-blue to-purple-500" style={{ width: `${rate}%` }} /></div><span className="text-xs text-muted-foreground">{rate}%</span></div></td>
              </tr>);
            })}</tbody>
          </table>
        </CardContent>
      </Card>
      <Card className="border-border/40">
        <CardHeader><CardTitle className="flex items-center gap-2 text-lg font-bold text-white"><Rocket className="h-5 w-5 text-electric-blue" /> Milestone Completion Rates</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-6">{stats.milestones.map((ms: any) => (
            <div key={ms.name} className="space-y-2">
              <div className="flex items-center justify-between"><span className="text-sm font-medium text-white">{ms.name}</span><span className="text-sm font-bold text-white">{ms.completionRate}%</span></div>
              <div className="relative h-3 overflow-hidden rounded-full bg-white/10"><div className={`h-full rounded-full transition-all ${ms.completionRate >= 80 ? "bg-gradient-to-r from-emerald-500 to-emerald-400" : ms.completionRate >= 50 ? "bg-gradient-to-r from-electric-blue to-purple-500" : ms.completionRate >= 30 ? "bg-gradient-to-r from-amber-500 to-amber-400" : "bg-gradient-to-r from-red-500 to-red-400"}`} style={{ width: `${ms.completionRate}%` }} /></div>
            </div>
          ))}</div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="border-border/40"><CardContent className="p-6"><div className="flex items-center gap-4"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-electric-blue/10"><Users className="h-5 w-5 text-electric-blue" /></div><div><p className="text-xs text-muted-foreground">Total Builders</p><p className="text-xl font-bold text-white">{stats.members}</p></div></div></CardContent></Card>
        <Card className="border-border/40"><CardContent className="p-6"><div className="flex items-center gap-4"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10"><Rocket className="h-5 w-5 text-emerald-400" /></div><div><p className="text-xs text-muted-foreground">Total Teams</p><p className="text-xl font-bold text-white">{stats.teams}</p></div></div></CardContent></Card>
        <Card className="border-border/40"><CardContent className="p-6"><div className="flex items-center gap-4"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10"><Activity className="h-5 w-5 text-purple-400" /></div><div><p className="text-xs text-muted-foreground">Total Products</p><p className="text-xl font-bold text-white">{stats.products}</p></div></div></CardContent></Card>
      </div>
    </div>
  );
}