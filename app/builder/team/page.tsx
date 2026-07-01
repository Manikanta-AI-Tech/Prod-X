"use client";

import { motion } from "framer-motion";
import { builders, teams } from "@/data/mock";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";
import { Users, Wifi, WifiOff, Clock } from "lucide-react";

const statusConfig = {
  online: { icon: Wifi, color: "text-emerald-400", bg: "bg-emerald-500" },
  idle: { icon: Clock, color: "text-amber-400", bg: "bg-amber-500" },
  offline: { icon: WifiOff, color: "text-muted-foreground", bg: "bg-muted" },
} as const;

export default function TeamPage() {
  const avgProgress = Math.round(
    builders.reduce((sum, b) => sum + b.progress, 0) / builders.length
  );

  // Group builders by team
  const teamMap = teams.map((team) => ({
    ...team,
    members: builders.filter((b) => b.team === team.name),
  }));

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold tracking-tight text-white">Team Overview</h1>
        <p className="mt-2 text-muted-foreground">
          All builders, teams, and their progress across the cohort.
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Builders", value: builders.length, icon: Users, color: "text-electric-blue" },
          { label: "Active Teams", value: teams.length, icon: Users, color: "text-emerald-400" },
          { label: "Avg Progress", value: `${avgProgress}%`, icon: Clock, color: "text-amber-400" },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 * i }}
            >
              <Card className="border-border/40">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                  <p className={`mt-1 text-2xl font-bold ${stat.color}`}>
                    {stat.value}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Teams */}
      {teamMap.map((team, teamIdx) => (
        <motion.div
          key={team.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 * teamIdx }}
          className="space-y-4"
        >
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-white">{team.name}</h2>
            <Badge variant="outline" className="bg-electric-blue/10 text-electric-blue border-electric-blue/20">
              {team.product}
            </Badge>
            <span className="text-sm text-muted-foreground ml-auto">
              {team.members.length} members · {team.progress}% complete
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {team.members.map((builder, index) => (
              <motion.div
                key={builder.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.05 * index }}
              >
                <Card className="border-border/40 transition-colors hover:border-border">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-muted to-muted/50 text-xs font-bold text-white">
                          {builder.avatar}
                        </div>
                        <div className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background ${statusConfig.online.bg}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-white truncate">{builder.name}</h3>
                          <Badge variant="outline" className="bg-muted/30 text-muted-foreground border-muted text-[10px] px-1.5 py-0">
                            {builder.role}
                          </Badge>
                        </div>
                        <div className="mt-1.5 flex items-center gap-2">
                          <Progress value={builder.progress} className="h-1.5 flex-1" />
                          <span className="text-xs font-medium text-muted-foreground shrink-0">
                            {builder.progress}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}