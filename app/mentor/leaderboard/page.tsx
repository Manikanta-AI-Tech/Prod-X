"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Trophy, TrendingUp } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

const medals = ["🥇", "🥈", "🥉"];

export default function MentorLeaderboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [rankings, setRankings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push("/auth"); return; }
    async function fetchData() {
      const { data: mentor } = await supabase.from("mentors").select("id").eq("email", user.email).single();
      if (!mentor) { setLoading(false); return; }
      const { data: teams } = await supabase.from("teams").select("id, name").eq("mentor_id", mentor.id);
      const ids = teams?.map(t => t.id) || [];
      if (!ids.length) { setLoading(false); return; }
      const { data: members } = await supabase.from("team_members").select("id, name, profile_id, team_id").in("team_id", ids);
      const pids = members?.map(m => m.profile_id).filter(Boolean) || [];
      const { data: profiles } = pids.length ? await supabase.from("profiles").select("id, xp").in("id", pids) : { data: [] };
      const xpMap: Record<string, number> = {}; profiles?.forEach(p => { xpMap[p.id] = p.xp || 0; });
      const { data: updates } = pids.length ? await supabase.from("journey_updates").select("profile_id") : { data: [] };
      const updateCounts: Record<string, number> = {}; (updates || []).forEach((u: any) => { updateCounts[u.profile_id] = (updateCounts[u.profile_id] || 0) + 1; });
      const teamMap: Record<string, string> = {}; teams?.forEach(t => { teamMap[t.id] = t.name; });
      const ranked = (members || []).map(m => {
        const xp = xpMap[m.profile_id] || 0;
        const updates = updateCounts[m.profile_id] || 0;
        return { name: m.name, team: teamMap[m.team_id] || "Unknown", score: (xp * 2) + (updates * 5), xp, updates };
      }).sort((a, b) => b.score - a.score).map((e, i) => ({ ...e, rank: i + 1 }));
      setRankings(ranked);
      setLoading(false);
    }
    fetchData();
  }, [user, authLoading, router]);

  if (authLoading || loading) return <div className="p-8 text-white"><div className="h-8 w-48 animate-pulse rounded-lg bg-white/5" /></div>;

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-3xl font-bold tracking-tight text-white">Leaderboard</h1>
        <p className="mt-2 text-muted-foreground">Builder rankings based on XP, attendance, and journey updates.</p>
      </motion.div>
      <div className="space-y-3">
        {rankings.map((entry, index) => {
          const isPodium = index < 3;
          return (<motion.div key={entry.name} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.05 * index }}>
            <Card className={`border-border/40 transition-all hover:border-border ${isPodium ? "border-electric-blue/20 bg-electric-blue/[0.02]" : ""}`}>
              <CardContent className="p-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-card/60">{isPodium ? <span className="text-2xl">{medals[index]}</span> : <span className="text-lg font-bold text-muted-foreground">#{entry.rank}</span>}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2"><h3 className="font-semibold text-white">{entry.name}</h3>{isPodium && <Badge variant="outline" className="bg-electric-blue/15 text-electric-blue border-electric-blue/20"><Trophy className="mr-1 h-3 w-3" />Top {index + 1}</Badge>}</div>
                    <p className="text-xs text-muted-foreground mt-0.5">{entry.team}</p>
                  </div>
                  <div className="text-right"><p className="text-lg font-bold text-white">{entry.score.toLocaleString()}</p><p className="text-[10px] text-muted-foreground">{entry.xp} XP · {entry.updates} updates</p></div>
                </div>
              </CardContent>
            </Card>
          </motion.div>);
        })}
        {rankings.length === 0 && <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/40 px-8 py-16 text-center"><p className="text-sm text-muted-foreground">No builders in your teams yet.</p></div>}
      </div>
    </div>
  );
}