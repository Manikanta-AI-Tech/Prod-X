"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Zap, Clock, ChevronRight, CheckCircle, Star } from "lucide-react";
import { supabase } from "@/lib/supabase";

export interface Mission {
  id: string;
  title: string;
  description: string | null;
  points: number | null;
}

interface MissionCardProps {
  task: Mission | null;
  teamId?: string;
  profileId?: string;
  isSubmitted: boolean;
  onSubmitted: () => void;
}

export function MissionCard({
  task,
  teamId,
  profileId,
  isSubmitted,
  onSubmitted,
}: MissionCardProps) {
  const [submission, setSubmission] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!task || !teamId || !profileId || !submission.trim()) return;

    setLoading(true);
    setError(null);
    const { error: submitError } = await supabase.from("deliverables").insert({
      team_id: teamId,
      task_id: task.id,
      submitted_by: profileId,
      submission_text: submission.trim(),
      status: "pending",
    });

    if (submitError) {
      setError("We couldn't submit your mission. Please try again.");
      setLoading(false);
      return;
    }

    setSubmission("");
    setLoading(false);
    onSubmitted();
  };

  if (!task) {
    return (
      <Card className="overflow-hidden border-emerald-500/30 bg-emerald-500/5">
        <CardContent className="py-8 text-center">
          <CheckCircle className="mx-auto mb-3 h-10 w-10 text-emerald-500" />
          <h3 className="text-xl font-bold text-white">You&apos;re all caught up!</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            There are no outstanding missions for your team.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden border-electric-blue/30 bg-electric-blue/5">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-bold uppercase tracking-widest text-electric-blue">
          Today&apos;s Mission
        </CardTitle>
        <Zap className="h-4 w-4 fill-electric-blue text-electric-blue" />
      </CardHeader>
      <CardContent>
        {isSubmitted ? (
          <div className="py-8 text-center">
            <CheckCircle className="mx-auto mb-4 h-12 w-12 text-emerald-500" />
            <h3 className="text-xl font-bold text-white">Mission Submitted!</h3>
            <p className="mt-2 text-sm text-muted-foreground">Your mentor will review it shortly.</p>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="mt-2 text-xl font-bold text-white">{task.title}</h3>
                {task.description && <p className="mt-2 text-sm text-muted-foreground">{task.description}</p>}
              </div>
              {task.points !== null && (
                <span className="inline-flex items-center gap-1 rounded-full bg-yellow-500/10 px-2.5 py-1 text-xs font-semibold text-yellow-400">
                  <Star className="h-3 w-3" /> {task.points} pts
                </span>
              )}
            </div>
            <div className="mt-6 space-y-4">
              <textarea
                value={submission}
                onChange={(event) => setSubmission(event.target.value)}
                placeholder="Paste your submission link or details here..."
                className="h-24 w-full rounded-lg border border-border/40 bg-background/50 p-3 text-sm text-white focus:border-electric-blue focus:outline-none"
              />
              {error && <p className="text-xs text-rose-400">{error}</p>}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>Submit when ready</span>
                </div>
                <Button onClick={handleSubmit} disabled={loading || !submission.trim() || !teamId} size="sm" variant="premium">
                  {loading ? "Submitting..." : "Submit Mission"} <ChevronRight className="ml-1 h-3 w-3" />
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
