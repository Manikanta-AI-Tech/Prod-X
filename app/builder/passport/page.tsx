"use client";

import { motion } from "framer-motion";
import { milestones } from "@/data/mock";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";
import { ShieldCheck, CheckCircle2, Lock } from "lucide-react";

const statusIcons = {
  completed: CheckCircle2,
  current: ShieldCheck,
  pending: Lock,
};

const statusColors = {
  completed: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  current: "text-electric-blue bg-electric-blue/10 border-electric-blue/20",
  pending: "text-muted-foreground bg-muted/30 border-muted",
} as const;

const badgeColors = {
  completed: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  current: "bg-electric-blue/15 text-electric-blue border-electric-blue/20",
  pending: "bg-muted/30 text-muted-foreground border-muted",
} as const;

export default function PassportPage() {
  const completed = milestones.filter((m) => m.status === "completed").length;
  const total = milestones.length;

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold tracking-tight text-white">Builder Passport</h1>
        <p className="mt-2 text-muted-foreground">
          Track your milestones and progress through the 10-day Builder Journey.
        </p>
      </motion.div>

      {/* Progress Summary */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <Card className="border-border/40">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Journey Progress</p>
                <p className="mt-1 text-3xl font-bold text-white">
                  {completed}<span className="text-lg text-muted-foreground">/{total}</span>
                </p>
              </div>
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-electric-blue/20">
                <span className="text-2xl font-bold text-electric-blue">
                  {Math.round((completed / total) * 100)}%
                </span>
              </div>
            </div>
            <Progress value={(completed / total) * 100} className="h-2" />
          </CardContent>
        </Card>
      </motion.div>

      {/* Milestones */}
      <div className="space-y-4">
        {milestones.map((milestone, index) => {
          const StatusIcon = statusIcons[milestone.status];
          return (
            <motion.div
              key={milestone.day}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.05 * index }}
            >
              <Card className={`border ${statusColors[milestone.status]} transition-colors`}>
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${statusColors[milestone.status]}`}>
                      <StatusIcon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-white">{milestone.title}</h3>
                        <Badge variant="outline" className={badgeColors[milestone.status]}>
                          {milestone.status === "completed" ? "Complete" : milestone.status === "current" ? "In Progress" : `Day ${milestone.day}`}
                        </Badge>
                      </div>
                      <p className="mt-1.5 text-sm text-muted-foreground">
                        {milestone.status === "completed"
                          ? "Milestone achieved. Great progress!"
                          : milestone.status === "current"
                          ? "You're working on this milestone right now."
                          : `Unlocks on Day ${milestone.day}.`}
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