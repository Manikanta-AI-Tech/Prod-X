"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Clock, CheckCircle2, XCircle, FileText } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

function fmt(iso: string) { return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }); }
type Tab = "pending" | "reviewed";

export default function MentorReviewsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [pending, setPending] = useState<any[]>([]);
  const [reviewed, setReviewed] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("pending");

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push("/auth"); return; }
    const currentUser = user!; async function fetchData() {
      const { data: mentor } = await supabase.from("mentors").select("id").eq("email", currentUser.email).single();
      if (!mentor) { setLoading(false); return; }
      const { data: teams } = await supabase.from("teams").select("id").eq("mentor_id", mentor.id);
      const ids = teams?.map(t => t.id) || [];
      if (!ids.length) { setLoading(false); return; }
      const { data: members } = await supabase.from("team_members").select("profile_id").in("team_id", ids);
      const pids = members?.map(m => m.profile_id).filter(Boolean) || [];
      if (!pids.length) { setLoading(false); return; }
      const { data: updates } = await supabase.from("journey_updates").select("*").in("profile_id", pids).order("created_at", { ascending: false });
      setPending((updates || []).filter(u => u.status !== "completed"));
      setReviewed((updates || []).filter(u => u.status === "completed"));
      setLoading(false);
    }
    fetchData();
  }, [user, authLoading, router]);

  async function markReviewed(id: string) {
    await supabase.from("journey_updates").update({ status: "completed" }).eq("id", id);
    setPending(prev => prev.filter(r => r.id !== id));
    setReviewed(prev => [{ ...prev[0], status: "completed" }, ...prev]);
  }

  const items = tab === "pending" ? pending : reviewed;
  if (authLoading || loading) return <div className="p-8 text-white"><div className="h-8 w-48 animate-pulse rounded-lg bg-white/5" /></div>;

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-3xl font-bold tracking-tight text-white">Reviews</h1>
        <p className="mt-2 text-muted-foreground">Review builder journey updates and provide feedback.</p>
      </motion.div>
      <div className="flex items-center gap-1 rounded-xl border border-border/40 bg-card/40 p-1">
        <button onClick={() => setTab("pending")} className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition ${tab === "pending" ? "bg-electric-blue/20 text-electric-blue" : "text-muted-foreground hover:text-white"}`}>Pending ({pending.length})</button>
        <button onClick={() => setTab("reviewed")} className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition ${tab === "reviewed" ? "bg-electric-blue/20 text-electric-blue" : "text-muted-foreground hover:text-white"}`}>Reviewed ({reviewed.length})</button>
      </div>
      <div className="space-y-4">
        {items.map((review, index) => (
          <motion.div key={review.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.03 * index }}>
            <Card className="border-border/40 transition-colors hover:border-border"><CardContent className="p-5">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-electric-blue/10"><FileText className="h-5 w-5 text-electric-blue" /></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div><div className="flex items-center gap-2"><h3 className="font-semibold text-white">{review.title}</h3><Badge variant={review.status === "completed" ? "success" : "premium"}>{review.status === "completed" ? "Reviewed" : "Pending"}</Badge></div>
                      <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground"><span className="flex items-center gap-1"><Clock className="h-3 w-3" />{fmt(review.created_at)}</span><span>Day {review.day_number}</span></div>
                      {review.description && <p className="mt-2 text-sm text-muted-foreground">{review.description}</p>}
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    {tab === "pending" && (<><Button size="sm" variant="premium" className="h-8 gap-1.5" onClick={() => markReviewed(review.id)}><CheckCircle2 className="h-3.5 w-3.5" /> Mark Reviewed</Button><Button size="sm" variant="destructive" className="h-8 gap-1.5"><XCircle className="h-3.5 w-3.5" /> Request Changes</Button></>)}
                  </div>
                </div>
              </div>
            </CardContent></Card>
          </motion.div>
        ))}
        {items.length === 0 && <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/40 px-8 py-16 text-center"><p className="text-sm text-muted-foreground">{tab === "pending" ? "No pending reviews." : "No reviewed items yet."}</p></div>}
      </div>
    </div>
  );
}