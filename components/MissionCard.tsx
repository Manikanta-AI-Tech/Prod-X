"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Zap, Clock, ChevronRight, CheckCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useProfile } from "@/hooks/useProfile";

export function MissionCard() {
  const { profile, team } = useProfile();
  const [task, setTask] = useState<any>(null);
  const [submission, setSubmission] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchTask() {
      // Get the first incomplete task for the current phase (Discovery for now)
      const { data: tasks } = await supabase
        .from('phase_tasks')
        .select('*')
        .order('id')
        .limit(1);
      
      if (tasks && tasks[0]) {
        setTask(tasks[0]);
      }
    }
    fetchTask();
  }, []);

  const handleSubmit = async () => {
    if (!task || !team || !profile) return;
    setLoading(true);

    const { error } = await supabase.from('deliverables').insert({
      team_id: team.id,
      task_id: task.id,
      submitted_by: profile.id,
      submission_text: submission,
      status: 'pending'
    });

    if (!error) {
      setSubmitted(true);
    }
    setLoading(false);
  };

  if (!task) return null;

  return (
    <Card className="border-electric-blue/30 bg-electric-blue/5 overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-bold uppercase tracking-widest text-electric-blue">
          Today's Mission
        </CardTitle>
        <Zap className="h-4 w-4 text-electric-blue fill-electric-blue" />
      </CardHeader>
      <CardContent>
        {submitted ? (
          <div className="py-8 text-center">
            <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white">Mission Submitted!</h3>
            <p className="text-sm text-muted-foreground mt-2">Your mentor will review it shortly.</p>
          </div>
        ) : (
          <>
            <h3 className="text-xl font-bold text-white mt-2">{task.title}</h3>
            <p className="text-sm text-muted-foreground mt-2">
              {task.description}
            </p>
            <div className="mt-6 space-y-4">
              <textarea
                value={submission}
                onChange={(e) => setSubmission(e.target.value)}
                placeholder="Paste your submission link or details here..."
                className="w-full h-24 rounded-lg bg-background/50 border border-border/40 p-3 text-sm text-white focus:outline-none focus:border-electric-blue"
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>Submission requested</span>
                </div>
                <Button 
                  onClick={handleSubmit} 
                  disabled={loading || !submission}
                  size="sm" 
                  className="premium h-8 px-4"
                >
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
