"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Trophy, TrendingUp, TrendingDown, Minus, Award, ChevronRight } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

const rankColors = ["text-yellow-400", "text-gray-300", "text-amber-600", "text-muted-foreground"];

export default function AdminLeaderboard() {
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { data: teamsData } = await supabase.from("teams").select("id, name, progress").order("name");
      if (teamsData) {
        const teamIds = teamsData.map(t => t.id);
        const { data: members } = await supabase.from("team_members").select("team_id").in("team_id", teamIds);
        const counts: Record<string, number> = {};
        members?.forEach(m => { counts[m.team_id] = (counts[m.team_id] || 0) + 1; });
        const ranked = teamsData.map(t => ({ ...t, score: (t.progress || 0) + (counts[t.id] || 0) * 10, member_count: counts[t.id] || 0 }))
          .sort((a, b) => b.score - a.score).map((e, i) => ({ ...e, rank: i + 1 }));
        setTeams(ranked);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) return <div className="p-8 text-white"><div className="h-8 w-48 animate-pulse rounded-lg bg-white/5" /></div>;

  const topScore = teams[0]?.score || 1;
  return (
    <div className="space-y-8">
      <div><h1 className="text-3xl font-bold tracking-tight text-white">Leaderboard</h1><p className="mt-1 text-sm text-muted-foreground">Team rankings based on progress, builders, and activity.</p></div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {teams.slice(0, 3).map(entry => (
          <Card key={entry.rank} className={`relative overflow-hidden border-border/40 ${entry.rank === 1 ? "bg-gradient-to-br from-yellow-500/5 to-transparent" : ""}`}>
            <div className="absolute right-3 top-3">{entry.rank === 1 ? <Trophy className="h-6 w-6 text-yellow-400" /> : <Award className={`h-5 w-5 ${rankColors[entry.rank - 1]}`} />}</div>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className={`flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold ${entry.rank === 1 ? "bg-yellow-400/20 text-yellow-400" : entry.rank === 2 ? "bg-gray-300/20 text-gray-300" : "bg-amber-600/20 text-amber-600"}`}>{entry.rank}</div>
                <div className="flex-1"><p className="text-lg font-semibold text-white">{entry.name}</p><div className="flex items-center gap-2"><span className="text-2xl font-bold text-white">{entry.score.toLocaleString()}</span><span className="text-xs text-muted-foreground">pts</span></div></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="border-border/40">
        <CardHeader><CardTitle className="flex items-center gap-2 text-lg font-bold text-white"><Trophy className="h-5 w-5 text-yellow-400" /> Full Rankings</CardTitle></CardHeader>
        <CardContent>
          <table className="w-full">
            <thead><tr className="border-b border-border/40 text-xs font-medium uppercase tracking-wider text-muted-foreground"><th className="px-4 py-3 text-left">Rank</th><th className="px-4 py-3 text-left">Team</th><th className="px-4 py-3 text-right">Score</th><th className="px-4 py-3 text-right">Members</th><th className="px-4 py-3 text-right">Progress</th><th className="w-8 px-4 py-3"></th></tr></thead>
            <tbody>{teams.map(entry => (
              <tr key={entry.rank} className="group border-b border-border/20 transition-colors last:border-0 hover:bg-white/[0.02]">
                <td className="px-4 py-4"><span className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${rankColors[entry.rank - 1] || "text-muted-foreground"} ${entry.rank <= 3 ? "bg-white/5" : ""}`}>{entry.rank}</span></td>
                <td className="px-4 py-4"><span className="font-medium text-white">{entry.name}</span></td>
                <td className="px-4 py-4 text-right"><span className="font-bold text-white">{entry.score.toLocaleString()}</span></td>
                <td className="px-4 py-4 text-right"><span className="text-muted-foreground">{entry.member_count}</span></td>
                <td className="px-4 py-4 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <div className="h-2 w-24 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-electric-blue to-purple-500 transition-all" style={{ width: `${entry.progress}%` }} /></div>
                    <span className="text-xs text-muted-foreground">{entry.progress}%</span>
                  </div>
                </td>
                <td className="px-4 py-4 text-right"><ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" /></td>
              </tr>
            ))}</tbody>
          </table>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {[{ label: "Total Teams", value: teams.length, icon: Award }, { label: "Highest Score", value: teams[0]?.score.toLocaleString() || "—", icon: Trophy },
          { label: "Average Score", value: teams.length ? Math.round(teams.reduce((a, b) => a + b.score, 0) / teams.length).toLocaleString() : "0", icon: TrendingUp },
          { label: "Active Teams", value: teams.filter(t => t.progress > 0).length, icon: TrendingUp }].map(stat => (
          <Card key={stat.label} className="border-border/40"><CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-electric-blue/10"><stat.icon className="h-5 w-5 text-electric-blue" /></div>
            <div><p className="text-xs text-muted-foreground">{stat.label}</p><p className="text-xl font-bold text-white">{stat.value}</p></div>
          </CardContent></Card>
        ))}
      </div>
    </div>
  );
}