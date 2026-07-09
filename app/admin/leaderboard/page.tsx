"use client";

import { leaderboard, type LeaderboardEntry } from "@/data/mock";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Trophy, TrendingUp, TrendingDown, Minus, Award, ChevronRight } from "lucide-react";

const rankColors = ["text-yellow-400", "text-gray-300", "text-amber-600", "text-muted-foreground"];

function TrendIcon({ change }: { change: LeaderboardEntry["change"] }) {
  switch (change) {
    case "up":
      return <TrendingUp className="h-4 w-4 text-emerald-400" />;
    case "down":
      return <TrendingDown className="h-4 w-4 text-red-400" />;
    default:
      return <Minus className="h-4 w-4 text-muted-foreground" />;
  }
}

export default function AdminLeaderboard() {
  const topScore = leaderboard[0]?.score ?? 1;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Leaderboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Team rankings based on builder points, milestone completion, and peer reviews.
        </p>
      </div>

      {/* Top 3 Podium Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {leaderboard.slice(0, 3).map((entry) => (
          <Card
            key={entry.rank}
            className={`relative overflow-hidden border-border/40 transition-all duration-300 hover:border-electric-blue/30 ${
              entry.rank === 1 ? "bg-gradient-to-br from-yellow-500/5 to-transparent" : ""
            }`}
          >
            <div className="absolute right-3 top-3">
              {entry.rank === 1 ? (
                <Trophy className="h-6 w-6 text-yellow-400" />
              ) : (
                <Award className={`h-5 w-5 ${rankColors[entry.rank - 1] || "text-muted-foreground"}`} />
              )}
            </div>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold ${
                    entry.rank === 1
                      ? "bg-yellow-400/20 text-yellow-400"
                      : entry.rank === 2
                        ? "bg-gray-300/20 text-gray-300"
                        : "bg-amber-600/20 text-amber-600"
                  }`}
                >
                  {entry.rank}
                </div>
                <div className="flex-1">
                  <p className="text-lg font-semibold text-white">{entry.team}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-white">{entry.score.toLocaleString()}</span>
                    <span className="text-xs text-muted-foreground">pts</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5">
                  <TrendIcon change={entry.change} />
                  <span className={`text-xs font-medium ${
                    entry.change === "up" ? "text-emerald-400" :
                    entry.change === "down" ? "text-red-400" : "text-muted-foreground"
                  }`}>
                    {entry.change === "up" ? "Rising" : entry.change === "down" ? "Falling" : "Steady"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Full Leaderboard Table */}
      <Card className="border-border/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-bold text-white">
            <Trophy className="h-5 w-5 text-yellow-400" />
            Full Rankings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/40 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  <th className="px-4 py-3 text-left">Rank</th>
                  <th className="px-4 py-3 text-left">Team</th>
                  <th className="px-4 py-3 text-right">Score</th>
                  <th className="px-4 py-3 text-right">Trend</th>
                  <th className="px-4 py-3 text-right">Progress</th>
                  <th className="w-8 px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry) => (
                  <tr
                    key={entry.rank}
                    className="group border-b border-border/20 transition-colors last:border-0 hover:bg-white/[0.02]"
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <span className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                          rankColors[entry.rank - 1] || "text-muted-foreground"
                        } ${entry.rank <= 3 ? "bg-white/5" : ""}`}>
                          {entry.rank}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="font-medium text-white">{entry.team}</span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <span className="font-bold text-white">{entry.score.toLocaleString()}</span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <TrendIcon change={entry.change} />
                        <span className={`text-xs font-medium ${
                          entry.change === "up" ? "text-emerald-400" :
                          entry.change === "down" ? "text-red-400" : "text-muted-foreground"
                        }`}>
                          {entry.change === "up" ? "+2" : entry.change === "down" ? "-2" : "0"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <div className="h-2 w-24 overflow-hidden rounded-full bg-white/10">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-electric-blue to-purple-500 transition-all"
                            style={{ width: `${Math.min(100, (entry.score / topScore) * 100)}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {Math.round((entry.score / topScore) * 100)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {[
          { label: "Total Teams", value: leaderboard.length, icon: Award },
          { label: "Highest Score", value: leaderboard[0]?.score.toLocaleString() ?? "—", icon: Trophy },
          { label: "Average Score", value: Math.round(leaderboard.reduce((a, b) => a + b.score, 0) / leaderboard.length).toLocaleString(), icon: TrendingUp },
          { label: "Teams Rising", value: leaderboard.filter((e) => e.change === "up").length, icon: TrendingUp },
        ].map((stat) => (
          <Card key={stat.label} className="border-border/40">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-electric-blue/10">
                <stat.icon className="h-5 w-5 text-electric-blue" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className="text-xl font-bold text-white">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}