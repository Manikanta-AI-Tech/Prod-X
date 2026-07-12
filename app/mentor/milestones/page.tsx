"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";
import { CheckCircle2, Target, Lock } from "lucide-react";
import { milestones } from "@/data/mock";

export default function MentorMilestonesPage() {
  const completed = milestones.filter((m) => m.status === "completed").length;
  const total = milestones.length;

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Milestones
        </h1>
        <p className="mt-2 text-muted-foreground">
          Track cohort-wide milestone progress across all teams.
        </p>
      </motion.div>

      {/* Overall progress */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <Card className="border-border/40">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">
                Overall Progress
              </span>
              <span className="text-sm font-medium text-white">
                {completed}/{total} milestones
              </span>
            </div>
            <Progress
              value={total > 0 ? (completed / total) * 100 : 0}
              className="h-2.5"
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* Milestones list */}
      <div className="space-y-3">
        {milestones.map((milestone, index) => {
          const isComplete = milestone.status === "completed";
          const isCurrent = milestone.status === "current";
          return (
            <motion.div
              key={milestone.day}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.03 * index }}
            >
              <Card
                className={`border-border/40 transition-colors ${
                  isComplete
                    ? "border-emerald-500/20"
                    : isCurrent
                    ? "border-electric-blue/20"
                    : ""
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                        isComplete
                          ? "bg-emerald-500/20 text-emerald-400"
                          : isCurrent
                          ? "bg-electric-blue/20 text-electric-blue"
                          : "bg-white/5 text-muted-foreground"
                      }`}
                    >
                      {isComplete ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : isCurrent ? (
                        <Target className="h-5 w-5" />
                      ) : (
                        <Lock className="h-5 w-5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-white">
                          {milestone.title}
                        </h3>
                        <Badge
                          variant="outline"
                          className={`${
                            isComplete
                              ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/20"
                              : isCurrent
                              ? "bg-electric-blue/15 text-electric-blue border-electric-blue/20"
                              : "bg-white/5 text-muted-foreground border-white/10"
                          }`}
                        >
                          {isComplete
                            ? "Complete"
                            : isCurrent
                            ? "In Progress"
                            : `Day ${milestone.day}`}
                        </Badge>
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        Day {milestone.day}
                      </p>
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