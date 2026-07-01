import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Trophy, ArrowUp, ArrowDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface LeaderboardEntry {
  rank: number;
  team: string;
  score: number;
  change: "up" | "down" | "same";
}

interface LeaderboardCardProps {
  entries: LeaderboardEntry[];
}

export function LeaderboardCard({ entries }: LeaderboardCardProps) {
  return (
    <Card className="border-border/40">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Leaderboard</CardTitle>
        <Trophy className="h-4 w-4 text-yellow-500" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mt-4">
          {entries.map((entry) => (
            <div key={entry.team} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold",
                  entry.rank === 1 ? "bg-yellow-500/20 text-yellow-500" :
                  entry.rank === 2 ? "bg-slate-300/20 text-slate-300" :
                  entry.rank === 3 ? "bg-amber-600/20 text-amber-600" :
                  "bg-muted text-muted-foreground"
                )}>
                  {entry.rank}
                </div>
                <span className="text-sm font-medium text-white">{entry.team}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-white">{entry.score}</span>
                {entry.change === "up" ? (
                  <ArrowUp className="h-3 w-3 text-emerald-500" />
                ) : entry.change === "down" ? (
                  <ArrowDown className="h-3 w-3 text-rose-500" />
                ) : (
                  <Minus className="h-3 w-3 text-muted-foreground" />
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
