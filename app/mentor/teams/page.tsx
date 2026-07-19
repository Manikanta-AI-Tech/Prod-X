"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function MentorTeamsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push("/auth"); return; }
    const currentUser = user!; async function fetchData() {
      const { data: mentor } = await supabase.from("mentors").select("id").eq("email", currentUser.email).single();
      if (!mentor) { setLoading(false); return; }
      const { data: teamsData } = await supabase.from("teams").select("id, name, description, progress, status, cohort:cohorts(name), product:products(name)").eq("mentor_id", mentor.id).order("name");
      if (teamsData) {
        const ids = teamsData.map(t => t.id);
        const { data: members } = await supabase.from("team_members").select("team_id").in("team_id", ids);
        const counts: Record<string, number> = {}; members?.forEach(m => { counts[m.team_id] = (counts[m.team_id] || 0) + 1; });
        setTeams(teamsData.map(t => ({ ...t, member_count: counts[t.id] || 0 })));
      }
      setLoading(false);
    }
    fetchData();
  }, [user, authLoading, router]);

  if (authLoading || loading) return <div className="p-8 text-white"><div className="h-8 w-48 animate-pulse rounded-lg bg-white/5" /></div>;

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-3xl font-bold tracking-tight text-white">Assigned Teams</h1>
        <p className="mt-2 text-muted-foreground">Teams you mentor.</p>
      </motion.div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-2">
        {teams.map((team, index) => (
          <motion.div key={team.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.05 * index }}>
            <Card className="border-border/40 transition-all hover:border-border">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1"><h3 className="font-semibold text-white">{team.name}</h3><p className="mt-0.5 text-xs text-muted-foreground">{team.cohort?.name || "No cohort"}</p></div>
                  <Badge variant="outline" className="bg-electric-blue/10 text-electric-blue border-electric-blue/20">{team.product?.name || "No product"}</Badge>
                </div>
                <div className="mt-4 flex items-center gap-1.5"><Users className="h-3.5 w-3.5 text-muted-foreground" /><span className="text-xs text-muted-foreground">{team.member_count} builders</span></div>
                <div className="mt-4"><div className="flex items-center justify-between text-xs"><span className="text-muted-foreground">Progress</span><span className="font-medium text-white">{team.progress}%</span></div><Progress value={team.progress} className="mt-1.5 h-2" /></div>
                <div className="mt-4 flex items-center justify-between border-t border-border/20 pt-3">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><Clock className="h-3.5 w-3.5" />{team.status}</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
        {teams.length === 0 && <div className="col-span-2 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/40 px-8 py-16 text-center"><p className="text-sm text-muted-foreground">No teams assigned to you yet.</p></div>}
      </div>
    </div>
  );
}