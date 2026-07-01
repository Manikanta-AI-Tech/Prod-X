"use client";

import { useEffect, useState } from "react";
import { StatsCard } from "@/components/StatsCard";
import { Users, ShieldCheck, Package, Rocket, Activity, MoreVertical } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { supabase } from "@/lib/supabase";
import { useProfile } from "@/hooks/useProfile";
import { useRouter } from "next/navigation";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area,
} from "recharts";

const chartTooltip = {
  contentStyle: { backgroundColor: "rgba(15, 23, 42, 0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: "13px", color: "#e5e7eb" },
  labelStyle: { color: "#9ca3af" },
};

export default function AdminDashboard() {
  const { profile, loading: profileLoading } = useProfile();
  const router = useRouter();
  const [stats, setStats] = useState({
    builders: 0,
    teams: 0,
    shipped: 0,
    avgTime: '0d'
  });
  const [products, setProducts] = useState<any[]>([]);
  const [topBuilders, setTopBuilders] = useState<any[]>([]);

  useEffect(() => {
    if (!profileLoading && profile?.role !== 'admin') {
      // For now just redirect if not admin, but in real app would be more robust
      // router.push("/builder");
    }
  }, [profile, profileLoading, router]);

  useEffect(() => {
    async function fetchData() {
      // Real counts from DB
      const { count: builderCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'builder');
      const { count: teamCount } = await supabase.from('teams').select('*', { count: 'exact', head: true });
      const { data: teamsData } = await supabase.from('teams').select('*').limit(5);
      const { data: profilesData } = await supabase.from('profiles').select('*').limit(5);

      setStats({
        builders: builderCount || 0,
        teams: teamCount || 0,
        shipped: 0, // Placeholder
        avgTime: '8.2d' // Placeholder
      });

      if (teamsData) setProducts(teamsData);
      if (profilesData) setTopBuilders(profilesData);
    }

    fetchData();
  }, []);

  if (profileLoading) return <div className="p-8 text-white">Loading...</div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Mission Control</h1>
          <p className="text-muted-foreground mt-1">Platform-wide overview and management.</p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline">Export Data</Button>
          <Button className="premium">New Cohort</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Active Builders" value={stats.builders} icon={Users} trend={{ value: 12, isUp: true }} />
        <StatsCard title="Active Teams" value={stats.teams} icon={ShieldCheck} trend={{ value: 3, isUp: true }} />
        <StatsCard title="Ship Rate" value="78%" icon={Rocket} trend={{ value: 5, isUp: true }} />
        <StatsCard title="Avg Ship Time" value={stats.avgTime} icon={Activity} />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-border/40">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-bold">Active Products</CardTitle>
              <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
            </CardHeader>
            <CardContent>
              <div className="relative overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-border/40 text-muted-foreground">
                      <th className="pb-3 font-medium">Product</th>
                      <th className="pb-3 font-medium">Status</th>
                      <th className="pb-3 font-medium text-right">Progress</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {products.map(team => (
                      <tr key={team.id} className="group hover:bg-white/[0.02]">
                        <td className="py-4 font-bold text-white">{team.name}</td>
                        <td className="py-4"><Badge variant="outline">{team.status}</Badge></td>
                        <td className="py-4 text-right font-medium text-white">{team.progress}%</td>
                      </tr>
                    ))}
                    {products.length === 0 && (
                      <tr>
                        <td colSpan={3} className="py-8 text-center text-muted-foreground italic">No products found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="border-border/40">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Recent Builders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {topBuilders.map(builder => (
                  <div key={builder.id} className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-electric-blue/20 text-[10px] font-bold text-electric-blue border border-electric-blue/30">
                      {builder.full_name?.substring(0, 2).toUpperCase() || '??'}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">{builder.full_name || builder.username}</p>
                      <p className="text-[10px] text-muted-foreground">{builder.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-electric-blue/20 bg-electric-blue/[0.02]">
            <CardHeader>
              <CardTitle className="text-sm font-bold text-electric-blue">System Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs text-white font-medium">All Services Operational</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
