"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { StatsCard } from "@/components/StatsCard";
import { Users, ClipboardList, CheckCircle, BookOpen } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function MentorDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [assignedTeams, setAssignedTeams] = useState<any[]>([]);
  const [pendingReviews, setPendingReviews] = useState<any[]>([]);
  const [completedThisWeek, setCompletedThisWeek] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push("/auth"); return; }
    async function fetchData() {
      const { data: mentor } = await supabase.from("mentors").select("*").eq("email", user.email).single();
      setProfile(mentor);
      if (!mentor) { setLoading(false); return; }
      const { data: teams } = await supabase.from("teams").select("id, name, progress, cohort:cohorts(name), product:products(name)").eq("mentor_id", mentor.id).order("name");
      if (teams) {
        const ids = teams.map(t => t.id);
        const { data: members } = await supabase.from("team_members").select("team_id").in("team_id", ids);
        const counts: Record<string, number> = {}; members?.forEach(m => { counts[m.team_id] = (counts[m.team_id] || 0) + 1; });
        setAssignedTeams(teams.map(t => ({ ...t, member_count: counts[t.id] || 0 })));
        const { data: deliverables } = await supabase.from("deliverables").select("id, title, created_at").in("team_id", ids).eq("status", "pending").order("created_at", { ascending: false });
        setPendingReviews(deliverables || []);
        const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7);
        const { count } = await supabase.from("deliverables").select("*", { count: "exact", head: true }).in("team_id", ids).eq("status", "reviewed").gte("updated_at", weekAgo.toISOString());
        setCompletedThisWeek(count || 0);
      }
      setLoading(false);
    }
    fetchData();
  }, [user, authLoading, router]);

  if (authLoading || loading) return <div className="p-8 text-white"><div className="h-8 w-48 animate-pulse rounded-lg bg-white/5" /></div>;

  const totalBuilders = assignedTeams.reduce((sum, t) => sum + t.member_count, 0);
  return (
    <div className="space-y-8">
      <div><div>{profile && <p className="text-sm text-electric-blue font-medium">{profile.name}</p>}</div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Mentor Studio</h1>
        <p className="text-muted-foreground mt-1">Review team progress and provide guidance.</p>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Assigned Teams" value={assignedTeams.length} icon={Users} />
        <StatsCard title="Total Builders" value={totalBuilders} icon={BookOpen} />
        <StatsCard title="Pending Reviews" value={pendingReviews.length} icon={ClipboardList} />
        <StatsCard title="Reviewed This Week" value={completedThisWeek} icon={CheckCircle} />
      </div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Assigned Teams</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {assignedTeams.map(team => (
              <motion.div key={team.id} className="rounded-xl border border-border/40 bg-card/60 p-5">
                <h3 className="font-semibold text-white">{team.name}</h3>
                <p className="text-xs text-muted-foreground mb-2">{team.cohort?.name || "No cohort"} · {team.product?.name || "No product"}</p>
                <p className="text-xs text-muted-foreground mb-4"><Users className="h-3 w-3 inline mr-1" />{team.member_count} builders</p>
                <div className="flex items-center justify-between text-xs"><span className="text-muted-foreground">Progress</span><span className="text-white">{team.progress}%</span></div>
                <div className="mt-1.5 h-1 w-full bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-electric-blue" style={{ width: `${team.progress}%` }} /></div>
              </motion.div>
            ))}
            {assignedTeams.length === 0 && <p className="text-sm text-muted-foreground italic col-span-2">No teams assigned yet.</p>}
          </div>
        </div>
        <div>
          <Card className="border-border/40">
            <CardHeader className="pb-3"><CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Pending Reviews</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {pendingReviews.map(d => (
                <div key={d.id} className="p-3 rounded-lg border border-border/40 bg-background/40">
                  <p className="text-sm font-medium text-white">{d.title}</p>
                  <p className="text-[10px] text-muted-foreground">{new Date(d.created_at).toLocaleDateString()}</p>
                  <Button size="sm" className="w-full mt-2 h-7 text-xs">Review</Button>
                </div>
              ))}
              {pendingReviews.length === 0 && <p className="text-xs text-muted-foreground italic">All caught up!</p>}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}