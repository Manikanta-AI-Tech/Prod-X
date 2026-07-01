"use client";

import { motion } from "framer-motion";
import { journeyDays, milestones } from "@/data/mock";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";
import { CheckCircle2, Circle, Rocket } from "lucide-react";

export default function JourneyPage() {
  const totalDays = journeyDays.length;
  const completedDays = journeyDays.filter((d) =>
    d.tasks.every((t) => t.done)
  ).length;

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold tracking-tight text-white">Builder Journey</h1>
        <p className="mt-2 text-muted-foreground">
          Your 10-day sprint timeline. Complete each day&apos;s tasks to progress.
        </p>
      </motion.div>

      {/* Sprint Progress */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <Card className="border-border/40">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">Sprint Progress</span>
              <span className="text-sm font-medium text-white">
                Day {completedDays}/{totalDays}
              </span>
            </div>
            <Progress value={(completedDays / totalDays) * 100} className="h-2.5" />
          </CardContent>
        </Card>
      </motion.div>

      {/* Timeline */}
      <div className="relative">
        <div className="absolute left-[19px] top-0 h-full w-0.5 bg-border/40" />
        <div className="space-y-6">
          {journeyDays.map((day, index) => {
            const allDone = day.tasks.every((t) => t.done);
            const milestone = milestones[day.day - 1];
            return (
              <motion.div
                key={day.day}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.05 * index }}
                className="relative pl-12"
              >
                {/* Timeline dot */}
                <div
                  className={`absolute left-2.5 top-1.5 h-3.5 w-3.5 rounded-full border-2 ${
                    allDone
                      ? "border-emerald-500 bg-emerald-500"
                      : milestone?.status === "current"
                      ? "border-electric-blue bg-electric-blue"
                      : "border-muted bg-background"
                  }`}
                />

                <Card className={`border-border/40 transition-colors ${
                  allDone ? "border-emerald-500/20" : milestone?.status === "current" ? "border-electric-blue/20" : ""
                }`}>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-electric-blue">
                            Day {day.day}
                          </span>
                          {allDone && (
                            <Badge variant="outline" className="bg-emerald-500/15 text-emerald-400 border-emerald-500/20">
                              <CheckCircle2 className="mr-1 h-3 w-3" /> Complete
                            </Badge>
                          )}
                          {milestone?.status === "current" && !allDone && (
                            <Badge variant="outline" className="bg-electric-blue/15 text-electric-blue border-electric-blue/20">
                              <Rocket className="mr-1 h-3 w-3" /> In Progress
                            </Badge>
                          )}
                        </div>
                        <h3 className="mt-1 font-semibold text-white">{day.title}</h3>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {day.tasks.map((task) => (
                        <div key={task.name} className="flex items-center gap-3">
                          {task.done ? (
                            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                          ) : (
                            <Circle className="h-4 w-4 shrink-0 text-muted-foreground" />
                          )}
                          <span
                            className={`text-sm ${
                              task.done
                                ? "text-muted-foreground line-through"
                                : "text-foreground"
                            }`}
                          >
                            {task.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}