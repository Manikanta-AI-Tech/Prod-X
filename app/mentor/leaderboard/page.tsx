"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Trophy, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { leaderboard } from "@/data/mock";

const changeIcons = {
  up: TrendingUp,
  down: TrendingDown,
  same: Minus,
};

const changeColors = {
  up: "text-emerald-400",
  down: "text-red-400",
  same: "text-muted-foreground",
};

const medals = ["🥇", "🥈", "🥉"];

export default function MentorLeaderboardPage() {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Leaderboard
        </h1>
        <p className="mt-2 text-muted-foreground">
          Team rankings based on sprint performance and milestone completion.
        </p>
      </motion.div>

      <div className="space-y-3">
        {leaderboard.map((entry, index) => {
          const ChangeIcon = changeIcons[entry.change];
          const isPodium = index < 3;
          return (
            <motion.div
              key={entry.rank}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 * index }}
            >
              <Card
                className={`border-border/40 transition-all hover:border-border ${
                  isPodium ? "border-electric-blue/20 bg-electric-blue/[0.02]" : ""
                }`}
              >
                <CardContent className="p-5">
                  <div className="flex items-center gap-4">
                    {/* Rank */}
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-card/60">
                      {isPodium ? (
                        <span className="text-2xl">{medals[index]}</span>
                      ) : (
                        <span className="text-lg font-bold text-muted-foreground">
                          #{entry.rank}
                        </span>
                      )}
                    </div>

                    {/* Team info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-white">
                          {entry.team}
                        </h3>
                        {isPodium && (
                          <Badge
                            variant="outline"
                            className="bg-electric-blue/15 text-electric-blue border-electric-blue/20"
                          >
                            <Trophy className="mr-1 h-3 w-3" />
                            Top {index + 1}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Score */}
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-lg font-bold text-white">
                          {entry.score.toLocaleString()}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          points
                        </p>
                      </div>
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-lg bg-card/60 ${changeColors[entry.change]}`}
                      >
                        <ChangeIcon className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}