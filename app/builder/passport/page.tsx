"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { fetchPassportData, updateProfile, addSkill, removeSkill, updateSkill, type PassportData } from "@/lib/passport";
import { listMilestones, type Milestone } from "@/lib/milestones";
import {
  ShieldCheck, CheckCircle2, Lock, User, Mail, Phone, MapPin, GraduationCap,
  GitBranch, Link2, Globe, FileText, Users, Star, Target, Trophy,
  Award, Plus, X, Edit3, Building, BookOpen, Calendar,
  Zap, Medal, TrendingUp
} from "lucide-react";

const statusIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  completed: CheckCircle2, current: ShieldCheck, pending: Lock,
};
const statusColors: Record<string, string> = {
  completed: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  current: "text-electric-blue bg-electric-blue/10 border-electric-blue/20",
  pending: "text-muted-foreground bg-muted/30 border-muted",
};
const badgeColors: Record<string, string> = {
  completed: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  current: "bg-electric-blue/15 text-electric-blue border-electric-blue/20",
  pending: "bg-muted/30 text-muted-foreground border-muted",
};
const proficiencyColors: Record<string, string> = {
  beginner: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  intermediate: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  advanced: "bg-purple-500/15 text-purple-400 border-purple-500/20",
  expert: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
};

export default function PassportPage() {
  const { user } = useAuth();
  const { profile: authProfile, loading: profileLoading } = useProfile();
  const [data, setData] = useState<PassportData | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [newSkill, setNewSkill] = useState("");
  const [newSkillProficiency, setNewSkillProficiency] = useState<string>("intermediate");

  const loadData = useCallback(async () => {
    if (!authProfile?.id) return;
    try {
      const [passportData, milestonesData] = await Promise.all([
        fetchPassportData(authProfile.id),
        listMilestones().catch(() => []),
      ]);
      setData(passportData);
      setMilestones(milestonesData);
    } catch (err) {
      console.error("Failed to load passport data:", err);
    } finally {
      setLoading(false);
    }
  }, [authProfile?.id]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleSaveField = async (field: string, value: string) => {
    if (!authProfile?.id) return;
    setEditing(null);
    await updateProfile(authProfile.id, { [field]: value } as any);
    loadData();
  };

  const handleAddSkill = async () => {
    if (!authProfile?.id || !newSkill.trim()) return;
    await addSkill(authProfile.id, newSkill.trim(), newSkillProficiency);
    setNewSkill("");
    setNewSkillProficiency("intermediate");
    loadData();
  };

  const handleRemoveSkill = async (skillId: string) => {
    await removeSkill(skillId);
    loadData();
  };

  const handleCycleProficiency = async (skill: any) => {
    const levels = ["beginner", "intermediate", "advanced", "expert"];
    const idx = levels.indexOf(skill.proficiency);
    const next = levels[(idx + 1) % levels.length];
    await updateSkill(skill.id, next);
    loadData();
  };

  if (loading || profileLoading) {
    return (
      <div className="space-y-6">
        {[1,2,3,4].map(i => <div key={i} className="h-32 animate-pulse rounded-2xl bg-white/5" />)}
      </div>
    );
  }

  const completed = milestones.filter(m => m.status === "completed").length;
  const total = milestones.length;
  const p = data?.profile;
  const stats = data?.stats;
  const skills = data?.skills || [];
  const achievements = data?.achievements || [];
  const certificates = data?.certificates || [];
  const team = data?.team;

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-3xl font-bold tracking-tight text-white">Builder Passport</h1>
        <p className="mt-2 text-muted-foreground">Your professional builder profile and journey progress.</p>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column — Profile Card */}
        <div className="space-y-6 lg:col-span-1">
          {/* Personal Info */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.05 }}>
            <Card className="border-border/40">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-electric-blue to-purple-500 text-3xl font-bold text-white shadow-lg shadow-electric-blue/20">
                    {p?.avatar_url ? (
                      <img src={p.avatar_url} alt="" className="h-full w-full rounded-full object-cover" />
                    ) : (
                      p?.full_name?.substring(0, 2).toUpperCase() || "U"
                    )}
                  </div>
                  <h2 className="mt-4 text-xl font-bold text-white">{p?.full_name || "Builder"}</h2>
                  <Badge variant="outline" className="mt-1 bg-electric-blue/10 text-electric-blue border-electric-blue/20 capitalize">
                    {p?.role || "builder"}
                  </Badge>
                </div>

                <div className="mt-6 space-y-3">
                  <InfoRow icon={Mail} label="Email" value={user?.email} />
                  <InfoRow icon={Phone} label="Phone" value={p?.phone} field="phone" editing={editing} editValue={editValue} setEditing={setEditing} setEditValue={setEditValue} onSave={handleSaveField} />
                  <InfoRow icon={MapPin} label="City" value={p?.city} field="city" editing={editing} editValue={editValue} setEditing={setEditing} setEditValue={setEditValue} onSave={handleSaveField} />
                  <InfoRow icon={GraduationCap} label="College" value={p?.college} field="college" editing={editing} editValue={editValue} setEditing={setEditing} setEditValue={setEditValue} onSave={handleSaveField} />
                  <InfoRow icon={BookOpen} label="Degree" value={p?.degree} field="degree" editing={editing} editValue={editValue} setEditing={setEditing} setEditValue={setEditValue} onSave={handleSaveField} />
                  <InfoRow icon={Calendar} label="Graduation" value={p?.graduation_year?.toString()} field="graduation_year" editing={editing} editValue={editValue} setEditing={setEditing} setEditValue={setEditValue} onSave={handleSaveField} />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Professional Links */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
            <Card className="border-border/40">
              <CardContent className="p-6">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Connect</h3>
                <div className="space-y-3">
                  <LinkRow icon={Github} label="GitHub" value={p?.github_handle} prefix="@" field="github_handle" editing={editing} editValue={editValue} setEditing={setEditing} setEditValue={setEditValue} onSave={handleSaveField} />
                  <LinkRow icon={Linkedin} label="LinkedIn" value={p?.linkedin_url} field="linkedin_url" editing={editing} editValue={editValue} setEditing={setEditing} setEditValue={setEditValue} onSave={handleSaveField} />
                  <LinkRow icon={Globe} label="Portfolio" value={p?.portfolio_url} field="portfolio_url" editing={editing} editValue={editValue} setEditing={setEditing} setEditValue={setEditValue} onSave={handleSaveField} />
                  <LinkRow icon={FileText} label="Resume" value={p?.resume_url} field="resume_url" editing={editing} editValue={editValue} setEditing={setEditing} setEditValue={setEditValue} onSave={handleSaveField} />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Team Info */}
          {team && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.15 }}>
              <Card className="border-border/40">
                <CardContent className="p-6">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                    <div className="flex items-center gap-2"><Users className="h-4 w-4" /> Team</div>
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-muted-foreground">Team</span><span className="text-white font-medium">{team.name}</span></div>
                    {team.cohort_name && <div className="flex justify-between"><span className="text-muted-foreground">Cohort</span><span className="text-white">{team.cohort_name}</span></div>}
                    {team.mentor_name && <div className="flex justify-between"><span className="text-muted-foreground">Mentor</span><span className="text-white">{team.mentor_name}</span></div>}
                    {team.product_name && <div className="flex justify-between"><span className="text-muted-foreground">Product</span><span className="text-white">{team.product_name}</span></div>}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Stats Grid */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.05 }}>
            <Card className="border-border/40">
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                  <StatBox icon={Zap} label="XP" value={stats?.xp ?? 0} />
                  <StatBox icon={Medal} label="Rank" value={`#${stats?.rank ?? '-'}`} />
                  <StatBox icon={TrendingUp} label="Attendance" value={`${stats?.attendance ?? 0}%`} />
                  <StatBox icon={Target} label="Challenges" value={stats?.challenges ?? 0} />
                  <StatBox icon={Rocket as any} label="Products" value={stats?.products ?? 0} />
                  <StatBox icon={Star} label="Milestones" value={`${completed}/${total}`} />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Skills */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
            <Card className="border-border/40">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Skills</h3>
                  <span className="text-xs text-muted-foreground">{skills.length} skills</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skills.map(skill => (
                    <div key={skill.id} className="group flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-all hover:pr-1" className={`${proficiencyColors[skill.proficiency]}`}>
                      <span>{skill.name}</span>
                      <span className="text-[10px] opacity-60">· {skill.proficiency}</span>
                      <button onClick={() => handleCycleProficiency(skill)} className="ml-0.5 rounded-full p-0.5 opacity-0 group-hover:opacity-100 hover:bg-white/10 transition-opacity" title="Change proficiency">
                        <Edit3 className="h-3 w-3" />
                      </button>
                      <button onClick={() => handleRemoveSkill(skill.id)} className="rounded-full p-0.5 opacity-0 group-hover:opacity-100 hover:bg-red-500/20 transition-opacity" title="Remove skill">
                        <X className="h-3 w-3 text-red-400" />
                      </button>
                    </div>
                  ))}
                  {/* Add skill input */}
                  <div className="flex items-center gap-1.5 rounded-full border border-dashed border-border/60 px-3 py-1">
                    <input
                      type="text"
                      placeholder="+ Add skill"
                      value={newSkill}
                      onChange={e => setNewSkill(e.target.value)}
                      className="w-20 bg-transparent text-xs text-muted-foreground placeholder-muted-foreground/50 outline-none"
                      onKeyDown={e => e.key === "Enter" && handleAddSkill()}
                    />
                    <select
                      value={newSkillProficiency}
                      onChange={e => setNewSkillProficiency(e.target.value)}
                      className="bg-transparent text-[10px] text-muted-foreground outline-none"
                    >
                      <option value="beginner">B</option>
                      <option value="intermediate">I</option>
                      <option value="advanced">A</option>
                      <option value="expert">E</option>
                    </select>
                    <button onClick={handleAddSkill} className="text-muted-foreground hover:text-white transition-colors">
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Milestones */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.15 }}>
            <Card className="border-border/40">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Journey Milestones</h3>
                  <span className="text-xs text-muted-foreground">{completed}/{total} complete</span>
                </div>
                <Progress value={total > 0 ? (completed / total) * 100 : 0} className="h-2 mb-6" />
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {milestones.map((m, i) => {
                    const Icon = statusIcons[m.status] || Lock;
                    return (
                      <div key={m.id} className={`flex items-center gap-3 rounded-lg border p-3 ${statusColors[m.status]}`}>
                        <Icon className="h-4 w-4 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">{m.title}</p>
                          <p className="text-[10px] text-muted-foreground">Day {m.day_number} · {m.status}</p>
                        </div>
                        <Badge variant="outline" className={`text-[10px] ${badgeColors[m.status]}`}>
                          {m.status === "completed" ? "Done" : m.status === "current" ? "Now" : `D${m.day_number}`}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Achievements */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }}>
            <Card className="border-border/40">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground"><div className="flex items-center gap-2"><Award className="h-4 w-4" /> Achievements</div></h3>
                  <span className="text-xs text-muted-foreground">{achievements.length} badges</span>
                </div>
                {achievements.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic">Complete milestones to earn badges.</p>
                ) : (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {achievements.map(a => (
                      <div key={a.id} className="flex flex-col items-center rounded-xl border border-border/40 bg-card/60 p-4 text-center transition-colors hover:border-border">
                        <span className="text-3xl">{a.badge_icon}</span>
                        <p className="mt-2 text-xs font-medium text-white">{a.badge_name}</p>
                        {a.description && <p className="mt-0.5 text-[10px] text-muted-foreground line-clamp-2">{a.description}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Certificates */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.25 }}>
            <Card className="border-border/40">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground"><div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Certificates</div></h3>
                  <span className="text-xs text-muted-foreground">{certificates.length} earned</span>
                </div>
                {certificates.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic">Complete the Builder Journey to earn certificates.</p>
                ) : (
                  <div className="space-y-3">
                    {certificates.map(c => (
                      <div key={c.id} className="flex items-center justify-between rounded-lg border border-border/40 bg-card/60 p-4">
                        <div>
                          <p className="text-sm font-medium text-white">{c.title}</p>
                          <p className="text-xs text-muted-foreground">{c.issuer} · {new Date(c.issued_at).toLocaleDateString()}</p>
                        </div>
                        {c.certificate_url && (
                          <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => window.open(c.certificate_url, '_blank')}>
                            View
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// Inline editable info row
function InfoRow({ icon: Icon, label, value, field, editing, editValue, setEditing, setEditValue, onSave }: any) {
  const isEditing = editing === field;
  return (
    <div className="flex items-center gap-3 text-sm group">
      <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</p>
        {isEditing ? (
          <div className="flex items-center gap-1 mt-0.5">
            <input
              type="text"
              value={editValue}
              onChange={e => setEditValue(e.target.value)}
              className="w-full bg-white/5 rounded px-2 py-0.5 text-sm text-white outline-none border border-electric-blue/30"
              autoFocus
              onKeyDown={e => { if (e.key === "Enter") onSave(field, editValue); if (e.key === "Escape") setEditing(null); }}
              onBlur={() => onSave(field, editValue)}
            />
          </div>
        ) : (
          <p className="text-white truncate">{value || <span className="text-muted-foreground italic text-xs">Not set</span>}</p>
        )}
      </div>
      {field && !isEditing && (
        <button onClick={() => { setEditValue(value || ""); setEditing(field); }} className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-white">
          <Edit3 className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}

// Link row with clickable value
function LinkRow({ icon: Icon, label, value, prefix, field, editing, editValue, setEditing, setEditValue, onSave }: any) {
  const isEditing = editing === field;
  const display = value ? (prefix || "") + value : null;
  return (
    <div className="flex items-center gap-3 text-sm group">
      <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</p>
        {isEditing ? (
          <div className="flex items-center gap-1 mt-0.5">
            <input
              type="text"
              value={editValue}
              onChange={e => setEditValue(e.target.value)}
              className="w-full bg-white/5 rounded px-2 py-0.5 text-sm text-white outline-none border border-electric-blue/30"
              autoFocus
              onKeyDown={e => { if (e.key === "Enter") onSave(field, editValue); if (e.key === "Escape") setEditing(null); }}
              onBlur={() => onSave(field, editValue)}
            />
          </div>
        ) : (
          <p className="text-white truncate">
            {display ? (
              <span className="text-electric-blue hover:underline cursor-pointer" onClick={() => value && window.open(value.startsWith("http") ? value : `https://github.com/${value}`, '_blank')}>
                {display}
              </span>
            ) : <span className="text-muted-foreground italic text-xs">Not set</span>}
          </p>
        )}
      </div>
      {!isEditing && (
        <button onClick={() => { setEditValue(value || ""); setEditing(field); }} className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-white">
          <Edit3 className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}

// Stat box
function StatBox({ icon: Icon, label, value }: { icon: any; label: string; value: string | number }) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-border/40 bg-card/60 p-3 text-center">
      <Icon className="h-4 w-4 text-electric-blue" />
      <p className="mt-1 text-lg font-bold text-white">{value}</p>
      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</p>
    </div>
  );
}