"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";
import { CheckCircle2, Target, Lock, Users } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function MentorMilestonesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [milestones, setMilestones] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push("/auth"); return; }
    const currentUser = user!; async function fetchData() {
      const { data: mentor } = await supabase.from("mentors").select("id").eq("email", currentUser.email).single();
      if (!mentor) { setLoading(false); return; }
      const { data: teamsData } = await supabase.from("teams").select("id, name, progress").eq("mentor_id", mentor.id).order("name");
      setTeams(teamsData || []);
      const { data: milestonesData } = await supabase.from("milestones").select("*").order("day_number");
      setMilestones(milestonesData || []);
      setLoading(false);
    }
    fetchData();
  }, [user, authLoading, router]);

  if (authLoading || loading) return <div className="p-8 text-white"><div className="h-8 w-48 animate-pulse rounded-lg bg-white/5" /></div>;

  const avgProgress = teams.length ? Math.round(teams.reduce((s, t) => s + t.progress, 0) / teams.length) : 0;
  const completedCount = milestones.filter(m => m.status === "completed").length;
  const totalCount = milestones.length;

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-3xl font-bold tracking-tight text-white">Milestones</h1>
        <p className="mt-2 text-muted-foreground">Track milestone progress across your teams.</p>
      </motion.div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="border-border/40"><CardContent className="p-5"><div className="flex items-center justify-between mb-2"><span className="text-sm font-medium text-muted-foreground">Overall Progress</span><span className="text-sm font-medium text-white">{completedCount}/{totalCount} milestones</span></div><Progress value={totalCount ? (completedCount / totalCount) * 100 : 0} className="h-2.5" /></CardContent></Card>
        <Card className="border-border/40"><CardContent className="p-5"><div className="flex items-center gap-3"><Users className="h-5 w-5 text-electric-blue" /><div><p className="text-sm text-muted-foreground">Assigned Teams</p><p className="text-xl font-bold text-white">{teams.length}</p></div></div></CardContent></Card>
        <Card className="border-border/40"><CardContent className="p-5"><div className="flex items-center gap-3"><Target className="h-5 w-5 text-emerald-400" /><div><p className="text-sm text-muted-foreground">Avg Team Progress</p><p className="text-xl font-bold text-white">{avgProgress}%</p></div></div></CardContent></Card>
      </div>
      {teams.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Your Teams</h2>
          <div className="grid gap-3 md:grid-cols-2">{teams.map(team => (
            <Card key={team.id} className="border-border/40"><CardContent className="p-4"><div className="flex items-center justify-between"><h3 className="font-semibold text-white">{team.name}</h3><span className="text-sm font-medium text-white">{team.progress}%</span></div><Progress value={team.progress} className="mt-2 h-1.5" /></CardContent></Card>
          ))}</div>
        </div>
      )}
      <div className="space-y-2">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Cohort Milestones</h2>
        <div className="space-y-3">{milestones.map((ms, idx) => {
          const done = ms.status === "completed"; const curr = ms.status === "current";
          return (<motion.div key={ms.id || ms.day_number} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: 0.03 * idx }}>
            <Card className={`border-border/40 ${done ? "border-emerald-500/20" : curr ? "border-electric-blue/20" : ""}`}>
              <CardContent className="p-4"><div className="flex items-center gap-4">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${done ? "bg-emerald-500/20 text-emerald-400" : curr ? "bg-electric-blue/20 text-electric-blue" : "bg-white/5 text-muted-foreground"}`}>{done ? <CheckCircle2 className="h-5 w-5" /> : curr ? <Target className="h-5 w-5" /> : <Lock className="h-5 w-5" />}</div>
                <div className="flex-1 min-w-0"><div className="flex items-center gap-2"><h3 className="font-semibold text-white">{ms.title}</h3><Badge variant="outline" className={done ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" : curr ? "bg-electric-blue/15 text-electric-blue border-electric-blue/20" : "bg-white/5 text-muted-foreground border-white/10"}>{done ? "Complete" : curr ? "In Progress" : `Day ${ms.day_number}`}</Badge></div><p className="mt-0.5 text-xs text-muted-foreground">Day {ms.day_number}</p></div>
              </div></CardContent>
            </Card>
          </motion.div>);
        })}</div>
      </div>
    </div>
  );
}