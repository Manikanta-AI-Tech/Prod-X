"use client";

import { useEffect, useState } from "react";
import { StatsCard } from "@/components/StatsCard";
import { MissionCard } from "@/components/MissionCard";
import { JourneyTimeline } from "@/components/JourneyTimeline";
import { LeaderboardCard } from "@/components/LeaderboardCard";
import { Rocket, Users, Target, MessageSquare } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function BuilderDashboard() {
  const { profile, team, loading } = useProfile();
  const [milestones, setMilestones] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !profile) {
      router.push("/auth");
    }
  }, [profile, loading, router]);

  const fetchLeaderboard = async () => {
    const { data: lb } = await supabase
      .from('leaderboard')
      .select('total_points, teams(name)')
      .order('total_points', { ascending: false })
      .limit(5);

    if (lb) {
      setLeaderboard(lb.map((entry: any, i: number) => ({
        rank: i + 1,
        team: Array.isArray(entry.teams) ? entry.teams[0]?.name : entry.teams?.name || 'Unknown',
        score: entry.total_points,
        change: 'same'
      })));
    }
  };

  const fetchActivities = async () => {
    const { data: logs } = await supabase
      .from('activity_logs')
      .select('*, profiles(full_name, avatar_url)')
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (logs) setActivities(logs);
  };

  useEffect(() => {
    async function fetchInitialData() {
      const { data: phases } = await supabase
        .from('challenge_phases')
        .select('*')
        .order('order_index', { ascending: true });
      
      if (phases) {
        setMilestones(phases.map(p => ({
          day: p.order_index,
          title: p.name,
          status: 'pending'
        })));
      }

      await fetchLeaderboard();
      await fetchActivities();
    }

    if (profile) {
      fetchInitialData();

      // Realtime subscription for leaderboard
      const lbChannel = supabase.channel('leaderboard-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'leaderboard' }, fetchLeaderboard)
        .subscribe();

      // Realtime subscription for activity logs
      const activityChannel = supabase.channel('activity-changes')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'activity_logs' }, fetchActivities)
        .subscribe();

      return () => {
        supabase.removeChannel(lbChannel);
        supabase.removeChannel(activityChannel);
      };
    }
  }, [profile]);

  if (loading) return <div className="p-8 text-white">Loading...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Welcome, {profile?.full_name || 'Builder'}
        </h1>
        <p className="text-muted-foreground mt-1">
          {team ? `Building with Team ${team.name}` : 'Join a team to start your journey.'}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Team Progress" value={`${team?.progress || 0}%`} icon={Rocket} />
        <StatsCard title="Milestones" value="0/6" icon={Target} />
        <StatsCard title="Team" value={team?.name || 'N/A'} icon={Users} description={team?.tagline} />
        <StatsCard title="Points" value="0" icon={MessageSquare} description="Build to earn points" />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <MissionCard />
          
          <Card className="border-border/40">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {activities.map((activity, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-[10px] font-bold text-muted-foreground">
                      {activity.profiles?.full_name?.substring(0, 2).toUpperCase() || '??'}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-white">
                        <span className="font-bold">{activity.profiles?.full_name}</span> {activity.action}
                      </p>
                      <p className="text-xs text-muted-foreground">{new Date(activity.created_at).toLocaleTimeString()}</p>
                    </div>
                  </div>
                ))}
                {activities.length === 0 && (
                   <p className="text-sm text-muted-foreground italic">No recent activity recorded.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="border-border/40">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Your Journey</CardTitle>
            </CardHeader>
            <CardContent>
              <JourneyTimeline milestones={milestones} />
            </CardContent>
          </Card>

          <LeaderboardCard entries={leaderboard} />
        </div>
      </div>
    </div>
  );
}
