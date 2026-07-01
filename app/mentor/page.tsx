"use client";

import { useEffect, useState } from "react";
import { StatsCard } from "@/components/StatsCard";
import { Users, ClipboardList, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function MentorDashboard() {
  const { profile, loading: profileLoading } = useProfile();
  const router = useRouter();
  const [assignedTeams, setAssignedTeams] = useState<any[]>([]);
  const [pendingDeliverables, setPendingDeliverables] = useState<any[]>([]);

  useEffect(() => {
    if (!profileLoading && profile?.role !== 'mentor' && profile?.role !== 'admin') {
      // router.push("/builder");
    }
  }, [profile, profileLoading, router]);

  useEffect(() => {
    async function fetchData() {
      // Fetch teams assigned to this mentor (for now all teams if admin/mentor for demo)
      const { data: teamsData } = await supabase.from('teams').select('*, team_members(profiles(*))');
      if (teamsData) setAssignedTeams(teamsData);

      // Fetch pending deliverables
      const { data: deliverablesData } = await supabase
        .from('deliverables')
        .select('*, teams(name), phase_tasks(title)')
        .eq('status', 'pending');
      
      if (deliverablesData) setPendingDeliverables(deliverablesData);
    }

    if (profile) fetchData();
  }, [profile]);

  if (profileLoading) return <div className="p-8 text-white">Loading...</div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Mentor Studio</h1>
          <p className="text-muted-foreground mt-1">Review team progress and provide guidance.</p>
        </div>
        <Button className="premium">Schedule Office Hours</Button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Assigned Teams" value={assignedTeams.length} icon={Users} />
        <StatsCard title="Pending Reviews" value={pendingDeliverables.length} icon={ClipboardList} trend={{ value: 2, isUp: true }} />
        <StatsCard title="Completed This Week" value="0" icon={CheckCircle} />
        <StatsCard title="Avg Response Time" value="2.4h" icon={Clock} />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Assigned Teams</h2>
            <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-xs text-muted-foreground">{assignedTeams.length} teams</span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {assignedTeams.map(team => (
              <motion.div key={team.id} className="rounded-xl border border-border/40 bg-card/60 p-5">
                <h3 className="font-semibold text-white">{team.name}</h3>
                <p className="text-xs text-muted-foreground mb-4">{team.tagline || 'No tagline set'}</p>
                <div className="flex -space-x-2">
                   {team.team_members?.map((m: any) => (
                     <div key={m.profiles.id} className="h-6 w-6 rounded-full bg-electric-blue border-2 border-background flex items-center justify-center text-[8px] font-bold">
                       {m.profiles.full_name?.substring(0,2).toUpperCase()}
                     </div>
                   ))}
                </div>
                <div className="mt-4 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="text-white">{team.progress}%</span>
                </div>
                <div className="mt-1.5 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-electric-blue" style={{ width: `${team.progress}%` }} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <Card className="border-border/40">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Pending Reviews</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {pendingDeliverables.map(d => (
                <div key={d.id} className="p-3 rounded-lg border border-border/40 bg-background/40">
                  <p className="text-sm font-medium text-white">{d.phase_tasks?.title}</p>
                  <p className="text-[10px] text-muted-foreground">{d.teams?.name}</p>
                  <Button size="sm" className="w-full mt-2 h-7 text-xs">Review</Button>
                </div>
              ))}
              {pendingDeliverables.length === 0 && <p className="text-xs text-muted-foreground italic">All caught up!</p>}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
