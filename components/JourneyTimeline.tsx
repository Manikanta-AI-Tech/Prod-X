import { CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Milestone {
  day: number;
  title: string;
  status: "completed" | "current" | "pending";
}

interface JourneyTimelineProps {
  milestones: Milestone[];
}

export function JourneyTimeline({ milestones }: JourneyTimelineProps) {
  return (
    <div className="relative space-y-4">
      <div className="absolute left-[11px] top-2 h-[calc(100%-16px)] w-[1px] bg-border/40" />
      {milestones.map((milestone) => (
        <div key={milestone.day} className="relative flex items-start gap-4">
          <div className="z-10 flex h-6 w-6 items-center justify-center rounded-full bg-background">
            {milestone.status === "completed" ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            ) : milestone.status === "current" ? (
              <Circle className="h-5 w-5 animate-pulse text-electric-blue fill-electric-blue/20" />
            ) : (
              <Circle className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
          <div className="flex flex-col gap-1 pt-0.5">
            <div className="flex items-center gap-2">
              <span className={cn(
                "text-xs font-bold uppercase tracking-wider",
                milestone.status === "current" ? "text-electric-blue" : "text-muted-foreground"
              )}>
                Day {milestone.day}
              </span>
              {milestone.status === "current" && (
                <span className="rounded-full bg-electric-blue/10 px-2 py-0.5 text-[10px] font-semibold text-electric-blue">
                  Active
                </span>
              )}
            </div>
            <h4 className={cn(
              "text-sm font-medium",
              milestone.status === "pending" ? "text-muted-foreground" : "text-white"
            )}>
              {milestone.title}
            </h4>
          </div>
        </div>
      ))}
    </div>
  );
}
