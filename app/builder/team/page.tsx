"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";
import { Users, Clock } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

export default function TeamPage() {
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { data: teamsData } = await supabase.from("teams").select("id, name, description, progress, product:products(name)").order("name");
      if (teamsData) {
        const teamIds = teamsData.map(t => t.id);
        const { data: members } = await supabase.from("team_members").select("id, name, role, team_id").in("team_id", teamIds);
        setTeams(teamsData.map(t => ({ ...t, members: members?.filter(m => m.team_id === t.id) || [] })));
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) return <div className="p-8 text-white"><div className="h-8 w-48 animate-pulse rounded-lg bg-white/5" /></div>;

  const totalBuilders = teams.reduce((s, t) => s + t.members.length, 0);
  const avgProgress = teams.length ? Math.round(teams.reduce((s, t) => s + t.progress, 0) / teams.length) : 0;

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-3xl font-bold tracking-tight text-white">Team Overview</h1>
        <p className="mt-2 text-muted-foreground">All builders, teams, and their progress across the cohort.</p>
      </motion.div>
      <div className="grid grid-cols-3 gap-4">
        {[{ label: "Total Builders", value: totalBuilders, color: "text-electric-blue" }, { label: "Active Teams", value: teams.length, color: "text-emerald-400" }, { label: "Avg Progress", value: `${avgProgress}%`, color: "text-amber-400" }].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.05 * i }}>
            <Card className="border-border/40"><CardContent className="p-4">
              <div className="flex items-center justify-between"><p className="text-sm text-muted-foreground">{stat.label}</p><Users className={`h-4 w-4 ${stat.color}`} /></div>
              <p className={`mt-1 text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </CardContent></Card>
          </motion.div>
        ))}
      </div>
      {teams.map((team, teamIdx) => (
        <motion.div key={team.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 * teamIdx }} className="space-y-4">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-white">{team.name}</h2>
            <Badge variant="outline" className="bg-electric-blue/10 text-electric-blue border-electric-blue/20">{team.product?.name || "No product"}</Badge>
            <span className="text-sm text-muted-foreground ml-auto">{team.members.length} members · {team.progress}% complete</span>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {team.members.map((builder: any, index: number) => (
              <motion.div key={builder.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: 0.05 * index }}>
                <Card className="border-border/40 transition-colors hover:border-border"><CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-electric-blue to-purple-500 text-xs font-bold text-white">{builder.name?.substring(0, 2).toUpperCase() || "?"}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-white truncate">{builder.name}</h3>
                        <Badge variant="outline" className="bg-muted/30 text-muted-foreground border-muted text-[10px] px-1.5 py-0">{builder.role || "Builder"}</Badge>
                      </div>
                      <div className="mt-1.5 flex items-center gap-2"><Progress value={team.progress} className="h-1.5 flex-1" /><span className="text-xs font-medium text-muted-foreground shrink-0">{team.progress}%</span></div>
                    </div>
                  </div>
                </CardContent></Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ))}
      {teams.length === 0 && <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/40 px-8 py-16 text-center"><p className="text-sm text-muted-foreground">No teams found.</p></div>}
    </div>
  );
}