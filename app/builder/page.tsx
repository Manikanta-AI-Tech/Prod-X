"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { StatsCard } from "@/components/StatsCard";
import { MissionCard, type Mission } from "@/components/MissionCard";
import { JourneyTimeline } from "@/components/JourneyTimeline";
import { LeaderboardCard } from "@/components/LeaderboardCard";
import { Rocket, Users, Target, MessageSquare, ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

type Phase = { id: string; name: string; order_index: number };
type PhaseTask = Mission & { phase_id: string };
type Deliverable = { task_id: string; status: string | null };
type Activity = { action: string; created_at: string; profiles: { full_name: string | null } | { full_name: string | null }[] | null };
type JourneyMilestone = { day: number; title: string; status: "completed" | "current" | "pending" };

const isCompletedSubmission = (status: string | null) => status !== "rejected" && status !== "changes_requested";

export default function BuilderDashboard() {
  const { profile, team, loading } = useProfile();
  const [milestones, setMilestones] = useState<JourneyMilestone[]>([]);
  const [leaderboard, setLeaderboard] = useState<{ rank: number; team: string; score: number; change: "up" | "down" | "same" }[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [mission, setMission] = useState<Mission | null>(null);
  const [missionSubmitted, setMissionSubmitted] = useState(false);
  const [completedMilestones, setCompletedMilestones] = useState(0);
  const [totalMilestones, setTotalMilestones] = useState(0);
  const [points, setPoints] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const loadDashboard = useCallback(async () => {
    if (!team) return;
    setError(null);

    const [phasesResult, tasksResult, deliverablesResult, leaderboardResult, activitiesResult] = await Promise.all([
      supabase.from("challenge_phases").select("id, name, order_index").order("order_index", { ascending: true }),
      supabase.from("phase_tasks").select("id, phase_id, title, description, points").order("id"),
      supabase.from("deliverables").select("task_id, status").eq("team_id", team.id),
      supabase.from("leaderboard").select("team_id, total_points, teams(name)").order("total_points", { ascending: false }).limit(5),
      supabase.from("activity_logs").select("action, created_at, profiles(full_name)").order("created_at", { ascending: false }).limit(5),
    ]);

    if (phasesResult.error || tasksResult.error || deliverablesResult.error || leaderboardResult.error || activitiesResult.error) {
      setError("Some dashboard data could not be loaded. Please refresh and try again.");
    }

    const phases = (phasesResult.data ?? []) as Phase[];
    const tasks = (tasksResult.data ?? []) as PhaseTask[];
    const deliverables = (deliverablesResult.data ?? []) as Deliverable[];
    const submittedTaskIds = new Set(deliverables.filter((item) => isCompletedSubmission(item.status)).map((item) => item.task_id));
    const nextTask = tasks.find((task) => !submittedTaskIds.has(task.id)) ?? null;

    let currentFound = false;
    const journey = phases.map((phase) => {
      const phaseTasks = tasks.filter((task) => task.phase_id === phase.id);
      const isComplete = phaseTasks.length > 0 && phaseTasks.every((task) => submittedTaskIds.has(task.id));
      const status: JourneyMilestone["status"] = isComplete ? "completed" : currentFound ? "pending" : "current";
      if (!isComplete) currentFound = true;
      return { day: phase.order_index, title: phase.name, status };
    });

    setMilestones(journey);
    setCompletedMilestones(journey.filter((milestone) => milestone.status === "completed").length);
    setTotalMilestones(phases.length);
    setMission(nextTask);
    setMissionSubmitted(nextTask ? submittedTaskIds.has(nextTask.id) : false);
    setActivities((activitiesResult.data ?? []) as Activity[]);

    const leaders = leaderboardResult.data ?? [];
    setLeaderboard(leaders.map((entry: any, index: number) => ({
      rank: index + 1,
      team: Array.isArray(entry.teams) ? entry.teams[0]?.name ?? "Unknown" : entry.teams?.name ?? "Unknown",
      score: entry.total_points ?? 0,
      change: "same",
    })));
    setPoints(leaders.find((entry: any) => entry.team_id === team.id)?.total_points ?? 0);
  }, [team]);

  useEffect(() => {
    if (!loading && !profile) router.push("/auth");
  }, [profile, loading, router]);

  useEffect(() => {
    if (!profile || !team) return;
    loadDashboard();

    const leaderboardChannel = supabase.channel("builder-leaderboard-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "leaderboard" }, loadDashboard)
      .subscribe();
    const activityChannel = supabase.channel("builder-activity-changes")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "activity_logs" }, loadDashboard)
      .subscribe();

    return () => {
      supabase.removeChannel(leaderboardChannel);
      supabase.removeChannel(activityChannel);
    };
  }, [profile, team, loadDashboard]);

  if (loading) return <div className="p-8 text-white">Loading your dashboard...</div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Welcome, {profile?.full_name || "Builder"}</h1>
          <p className="mt-1 text-muted-foreground">{team ? `Building with ${team.name}` : "Join a team to start your journey."}</p>
        </div>
        <Link href="/builder/journey" className="inline-flex items-center gap-2 text-sm font-medium text-electric-blue hover:text-electric-blue/80">
          Continue your journey <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {error && <p className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">{error}</p>}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Team Progress" value={`${team?.progress ?? 0}%`} icon={Rocket} />
        <StatsCard title="Milestones" value={`${completedMilestones}/${totalMilestones}`} icon={Target} description="Phases submitted" />
        <StatsCard title="Team" value={team?.name || "Not assigned"} icon={Users} description={team?.tagline} />
        <StatsCard title="Points" value={points} icon={MessageSquare} description="Team leaderboard points" />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <MissionCard task={mission} teamId={team?.id} profileId={profile?.id} isSubmitted={missionSubmitted} onSubmitted={loadDashboard} />
          <Card className="border-border/40">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-bold">Recent Activity</CardTitle>
              <Link href="/builder/log" className="text-xs font-medium text-electric-blue hover:text-electric-blue/80">View all</Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {activities.map((activity, index) => {
                  const activityProfile = Array.isArray(activity.profiles) ? activity.profiles[0] : activity.profiles;
                  const name = activityProfile?.full_name || "A builder";
                  return (
                    <div key={`${activity.created_at}-${index}`} className="flex items-center gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-[10px] font-bold text-muted-foreground">{name.substring(0, 2).toUpperCase()}</div>
                      <div className="flex-1"><p className="text-sm text-white"><span className="font-bold">{name}</span> {activity.action}</p><p className="text-xs text-muted-foreground">{new Date(activity.created_at).toLocaleString()}</p></div>
                    </div>
                  );
                })}
                {!activities.length && <p className="text-sm italic text-muted-foreground">No recent activity recorded.</p>}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-8">
          <Card className="border-border/40"><CardHeader><CardTitle className="text-lg font-bold">Your Journey</CardTitle></CardHeader><CardContent>{milestones.length ? <JourneyTimeline milestones={milestones} /> : <p className="text-sm text-muted-foreground">Your journey will appear when phases are available.</p>}</CardContent></Card>
          <LeaderboardCard entries={leaderboard} />
        </div>
      </div>
    </div>
  );
}
