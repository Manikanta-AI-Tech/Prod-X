"use client";

import { motion } from "framer-motion";
import { Users, AlertTriangle, Clock } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";
import { mentorTeams } from "@/data/mock";

const stageColors: Record<string, string> = {
  "Core Build": "bg-electric-blue/15 text-electric-blue border-electric-blue/20",
  "User Testing": "bg-amber-500/15 text-amber-400 border-amber-500/20",
  "Discovery": "bg-purple-500/15 text-purple-400 border-purple-500/20",
  "Demo Ready": "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
};

export default function MentorTeamsPage() {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Assigned Teams
        </h1>
        <p className="mt-2 text-muted-foreground">
          Teams you mentor. Track progress, review work, and provide guidance.
        </p>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-2">
        {mentorTeams.map((team, index) => (
          <motion.div
            key={team.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 * index }}
          >
            <Card
              className={`border-border/40 transition-all hover:border-border ${
                team.needsAttention ? "border-amber-500/30" : ""
              }`}
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-white">{team.name}</h3>
                      {team.needsAttention && (
                        <AlertTriangle className="h-4 w-4 text-amber-400" />
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
                      {team.productIdea}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={`${
                      stageColors[team.stage] || "bg-white/5 text-muted-foreground"
                    }`}
                  >
                    {team.stage}
                  </Badge>
                </div>

                {/* Members */}
                <div className="mt-4 flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-muted-foreground" />
                  <div className="flex -space-x-2">
                    {team.members.map((member) => (
                      <div
                        key={member.name}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-electric-blue to-purple-500 text-[9px] font-bold text-white ring-2 ring-background"
                        title={`${member.name} — ${member.role}`}
                      >
                        {member.avatar}
                      </div>
                    ))}
                  </div>
                  <span className="ml-1 text-xs text-muted-foreground">
                    {team.members.length} members
                  </span>
                </div>

                {/* Progress */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium text-white">
                      {team.progress}%
                    </span>
                  </div>
                  <Progress value={team.progress} className="mt-1.5 h-2" />
                </div>

                {/* Last activity & actions */}
                <div className="mt-4 flex items-center justify-between border-t border-border/20 pt-3">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    {team.lastActivity}
                  </div>
                  <Link
                    href={`/mentor/reviews`}
                    className="rounded-lg px-3 py-1.5 text-xs font-medium text-electric-blue transition hover:bg-electric-blue/10"
                  >
                    View Details
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}