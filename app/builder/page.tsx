"use client";

import { useEffect, useState, useCallback } from "react";
import { StatsCard } from "@/components/StatsCard";
import { MissionCard } from "@/components/MissionCard";
import { JourneyTimeline } from "@/components/JourneyTimeline";
import { LeaderboardCard } from "@/components/LeaderboardCard";
import {
  Rocket, Users, Target, MessageSquare, Zap, Clock, CheckCircle2,
  Code, Trophy, TrendingUp, Star, ArrowRight, AlertCircle
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/Progress";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { listMilestones } from "@/lib/milestones";

export default function BuilderDashboard() {
  const { profile, team, loading } = useProfile();
  const [milestones, setMilestones] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [teamProduct, setTeamProduct] = useState<any>(null);
  const [mentorFeedback, setMentorFeedback] = useState<any[]>([]);
  const [teamProgress, setTeamProgress] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !profile) router.push("/auth");
  }, [profile, loading, router]);

  const fetchLeaderboard = useCallback(async () => {
    const { data: lb } = await supabase
      .from('leaderboard')
      .select('*')
      .order('total_points', { ascending: false })
      .limit(5);
    if (lb) {
      setLeaderboard(lb.map((entry: any, i: number) => ({
        rank: i + 1,
        team: entry.team_name || entry.team_id?.substring(0, 8) || 'Unknown',
        score: entry.total_points || 0,
        change: 'same' as const,
      })));
    }
  }, []);

  const fetchActivities = useCallback(async () => {
    const { data: logs } = await supabase
      .from('activity_log')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);
    if (logs) setActivities(logs);
  }, []);

  useEffect(() => {
    if (!profile) return;
    let mounted = true;

    async function load() {
      try {
        const [ms, lb, acts] = await Promise.all([
          listMilestones().catch(() => []),
          supabase.from('leaderboard').select('*').order('total_points', { ascending: false }).limit(5),
          supabase.from('activity_log').select('*').order('created_at', { ascending: false }).limit(5),
        ]);
        if (!mounted) return;
        setMilestones(ms);
        if (lb.data) {
          setLeaderboard(lb.data.map((e: any, i: number) => ({
            rank: i + 1, team: e.team_name || `Team ${i + 1}`, score: e.total_points || 0, change: 'same' as const,
          })));
        }
        if (acts.data) setActivities(acts.data);
      } catch (err) {
        console.error("Dashboard load error:", err);
      }
    }
    load();

    const lbChannel = supabase.channel('lb-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leaderboard' }, () => fetchLeaderboard())
      .subscribe();
    const actChannel = supabase.channel('act-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'activity_log' }, () => fetchActivities())
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(lbChannel);
      supabase.removeChannel(actChannel);
    };
  }, [profile, fetchLeaderboard, fetchActivities]);

  useEffect(() => {
    if (!team?.id) return;
    supabase.from('products').select('*').eq('id', team.id).single().then(({ data }) => {
      if (data) setTeamProduct(data);
    });
    // Use team progress directly
    if (team?.progress) setTeamProgress(team.progress);
  }, [team]);

  // My team's rank in leaderboard
  const myTeamRank = team?.name ? leaderboard.findIndex(e => e.team === team.name) + 1 : 0;
  const myTeamEntry = myTeamRank > 0 ? leaderboard[myTeamRank - 1] : null;

  if (loading) return <div className="p-8 text-white">Loading...</div>;

  const completed = milestones.filter((m: any) => m.status === "completed").length;
  const total = milestones.length;
  const overallProgress = total > 0 ? Math.round((completed / total) * 100) : teamProgress;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Welcome, {profile?.full_name?.split(' ')[0] || 'Builder'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {team ? `Building with Team ${team.name}` : 'Join a team to start your journey.'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-electric-blue/10 text-electric-blue border-electric-blue/20 text-xs px-3 py-1.5">
            <Zap className="h-3 w-3 mr-1" /> Sprint Day {milestones.filter((m: any) => m.status === 'current').length > 0
              ? milestones.find((m: any) => m.status === 'current')?.day_number || 1 : 1}
          </Badge>
          {myTeamRank > 0 && (
            <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/20 text-xs px-3 py-1.5">
              <Trophy className="h-3 w-3 mr-1" /> Rank #{myTeamRank}
            </Badge>
          )}
        </div>
      </div>

      {/* Today's Mission */}
      <MissionCard />

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
        <StatsCard title="Journey Progress" value={`${overallProgress}%`} icon={TrendingUp} />
        <StatsCard title="Team Progress" value={`${teamProgress}%`} icon={Rocket} trend={teamProgress > 50 ? { value: 12, isUp: true } : undefined} />
        <StatsCard title="Milestones" value={`${completed}/${total}`} icon={Target} />
        <StatsCard title="Team" value={team?.name || 'N/A'} icon={Users} description={team?.tagline || undefined} />
        <StatsCard title="Product" value={teamProduct?.name || 'N/A'} icon={Code} description={teamProduct?.status || undefined} />
        <StatsCard title="Points" value={myTeamEntry?.score || 0} icon={Star} description={myTeamRank > 0 ? `#${myTeamRank} on leaderboard` : 'Start building!'} />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column - Main content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Progress Bar */}
          <Card className="border-border/40">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Current Sprint Progress</h3>
                <span className="text-sm font-bold text-white">{overallProgress}%</span>
              </div>
              <Progress value={overallProgress} className="h-3" />
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span>Day 1</span>
                <span>Demo Day</span>
              </div>
            </CardContent>
          </Card>

          {/* Mentor Feedback */}
          <Card className="border-border/40">
            <CardHeader>
              <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <MessageSquare className="h-4 w-4" /> Mentor Feedback
              </CardTitle>
            </CardHeader>
            <CardContent>
              {mentorFeedback.length === 0 ? (
                <div className="text-center py-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted/30 mx-auto mb-3">
                    <MessageSquare className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground italic">No feedback yet. Submit your missions to get mentor reviews.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {mentorFeedback.map((fb: any, i: number) => (
                    <div key={i} className="flex gap-3 rounded-lg border border-border/40 bg-card/60 p-4">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-electric-blue/20 text-xs font-bold text-electric-blue">
                        {fb.mentor_name?.substring(0, 2).toUpperCase() || 'M'}
                      </div>
                      <div>
                        <p className="text-sm text-white">{fb.comment || fb.feedback}</p>
                        <p className="text-[10px] text-muted-foreground mt-1">{fb.mentor_name || 'Mentor'} · {fb.created_at ? new Date(fb.created_at).toLocaleDateString() : ''}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="border-border/40">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Clock className="h-4 w-4" /> Recent Activity
              </CardTitle>
              <Link href="/builder/log">
                <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground hover:text-white">
                  View All <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activities.map((act: any, i: number) => (
                  <div key={act.id || i} className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-electric-blue to-purple-500 text-[10px] font-bold text-white">
                      {act.author?.substring(0, 2).toUpperCase() || act.avatar || '??'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white">{act.author} <span className="text-muted-foreground font-normal">{act.content}</span></p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[10px] text-muted-foreground">{new Date(act.created_at || act.timestamp).toLocaleDateString()}</span>
                        <span className="text-[10px] text-muted-foreground">❤️ {act.likes || 0}</span>
                      </div>
                    </div>
                  </div>
                ))}
                {activities.length === 0 && (
                  <p className="text-sm text-muted-foreground italic text-center py-4">No activity yet. Start building!</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-8">
          {/* Upcoming Milestones */}
          <Card className="border-border/40">
            <CardHeader>
              <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Target className="h-4 w-4" /> Upcoming Milestones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <JourneyTimeline milestones={milestones.slice(0, 6).map((m: any) => ({
                day: m.day_number || m.day,
                title: m.title,
                status: m.status,
              }))} />
              {milestones.length === 0 && (
                <p className="text-sm text-muted-foreground italic text-center py-4">No milestones loaded.</p>
              )}
            </CardContent>
          </Card>

          {/* Leaderboard */}
          <LeaderboardCard entries={leaderboard} />

          {/* Quick Actions */}
          <Card className="border-border/40">
            <CardHeader>
              <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Zap className="h-4 w-4" /> Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Link href="/builder/journey">
                  <Button variant="outline" className="w-full justify-start h-9 text-xs border-border/40 hover:border-electric-blue/40">
                    <Rocket className="h-3.5 w-3.5 mr-2 text-electric-blue" /> View Journey
                  </Button>
                </Link>
                <Link href="/builder/passport">
                  <Button variant="outline" className="w-full justify-start h-9 text-xs border-border/40">
                    <Star className="h-3.5 w-3.5 mr-2 text-amber-400" /> Builder Passport
                  </Button>
                </Link>
                <Link href="/builder/team">
                  <Button variant="outline" className="w-full justify-start h-9 text-xs border-border/40">
                    <Users className="h-3.5 w-3.5 mr-2 text-electric-blue" /> My Team
                  </Button>
                </Link>
                <Link href="/builder/leaderboard">
                  <Button variant="outline" className="w-full justify-start h-9 text-xs border-border/40">
                    <Trophy className="h-3.5 w-3.5 mr-2 text-amber-500" /> Leaderboard
                  </Button>
                </Link>
                <Link href="/builder/log">
                  <Button variant="outline" className="w-full justify-start h-9 text-xs border-border/40">
                    <MessageSquare className="h-3.5 w-3.5 mr-2 text-muted-foreground" /> Builder Log
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}