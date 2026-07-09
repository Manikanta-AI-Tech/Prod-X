"use client";

import { useState } from "react";
import { Settings, ToggleLeft, Calendar, Save, RefreshCw, Globe, Users, Flag } from "lucide-react";
import { DashboardTopbar } from "@/components/Dashboard/DashboardTopbar";
import { PageHeader } from "@/components/Dashboard/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function AdminSettings() {
  const [platformName, setPlatformName] = useState("Prod[X]");
  const [platformDesc, setPlatformDesc] = useState("Builder Operating System by LeapStart School of Technology");
  const [cohortActive, setCohortActive] = useState(true);
  const [cohortStart, setCohortStart] = useState("2026-07-01");
  const [cohortEnd, setCohortEnd] = useState("2026-07-14");
  const [flagAutoDeploy, setFlagAutoDeploy] = useState(true);
  const [flagMentorReviews, setFlagMentorReviews] = useState(true);
  const [flagDemoDay, setFlagDemoDay] = useState(false);
  const [flagAnalytics, setFlagAnalytics] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const Toggle = ({ enabled, onChange, label }: { enabled: boolean; onChange: (v: boolean) => void; label: string }) => (
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled ? "bg-electric-blue" : "bg-white/20"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? "translate-x-6" : "translate-x-1"
        }`}
      />
      <span className="ml-3 text-sm text-muted-foreground">{label}</span>
    </button>
  );

  return (
    <div className="space-y-8">
      <DashboardTopbar
        title="Settings"
        subtitle="Platform configuration options"
      />

      <PageHeader
        title="Platform Settings"
        description="Configure platform name, cohort schedules, and feature flags."
        actionLabel={saved ? "Saved!" : "Save Changes"}
        actionIcon={saved ? <RefreshCw className="h-4 w-4" /> : <Save className="h-4 w-4" />}
        onAction={handleSave}
      />

      {/* General Settings */}
      <Card className="border-border/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-bold text-white">
            <Globe className="h-5 w-5 text-electric-blue" />
            General Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Platform Name</label>
            <input
              type="text"
              value={platformName}
              onChange={(e) => setPlatformName(e.target.value)}
              className="w-full rounded-lg border border-border/40 bg-background px-4 py-2.5 text-sm text-white focus:border-electric-blue focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Platform Description</label>
            <textarea
              value={platformDesc}
              onChange={(e) => setPlatformDesc(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-border/40 bg-background px-4 py-2.5 text-sm text-white focus:border-electric-blue focus:outline-none"
            />
          </div>
        </CardContent>
      </Card>

      {/* Cohort Management */}
      <Card className="border-border/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-bold text-white">
            <Users className="h-5 w-5 text-electric-blue" />
            Cohort Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Active Cohort</p>
              <p className="text-xs text-muted-foreground">Toggle whether the current cohort is accepting builders</p>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={cohortActive}
                onChange={(e) => setCohortActive(e.target.checked)}
                className="peer sr-only"
              />
              <div className="peer h-6 w-11 rounded-full bg-white/20 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-electric-blue peer-checked:after:translate-x-full" />
            </label>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1.5 flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                Cohort Start Date
              </label>
              <input
                type="date"
                value={cohortStart}
                onChange={(e) => setCohortStart(e.target.value)}
                className="w-full rounded-lg border border-border/40 bg-background px-4 py-2.5 text-sm text-white focus:border-electric-blue focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                Cohort End Date (Demo Day)
              </label>
              <input
                type="date"
                value={cohortEnd}
                onChange={(e) => setCohortEnd(e.target.value)}
                className="w-full rounded-lg border border-border/40 bg-background px-4 py-2.5 text-sm text-white focus:border-electric-blue focus:outline-none"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feature Flags */}
      <Card className="border-border/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-bold text-white">
            <Flag className="h-5 w-5 text-electric-blue" />
            Feature Flags
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Auto Deploy</p>
                <p className="text-xs text-muted-foreground">Automatically deploy builds to preview URLs</p>
              </div>
              <Toggle enabled={flagAutoDeploy} onChange={setFlagAutoDeploy} label="" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Mentor Reviews</p>
                <p className="text-xs text-muted-foreground">Enable mentor review workflow for teams</p>
              </div>
              <Toggle enabled={flagMentorReviews} onChange={setFlagMentorReviews} label="" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Demo Day Mode</p>
                <p className="text-xs text-muted-foreground">Enable Demo Day showcase and voting features</p>
              </div>
              <Toggle enabled={flagDemoDay} onChange={setFlagDemoDay} label="" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Analytics Dashboard</p>
                <p className="text-xs text-muted-foreground">Show analytics and metrics in Mission Control</p>
              </div>
              <Toggle enabled={flagAnalytics} onChange={setFlagAnalytics} label="" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Bar */}
      <div className="flex items-center justify-end gap-4 rounded-xl border border-border/40 bg-card/50 p-4">
        <Button variant="ghost" size="sm" onClick={() => {
          setPlatformName("Prod[X]");
          setPlatformDesc("Builder Operating System by LeapStart School of Technology");
          setCohortActive(true);
          setCohortStart("2026-07-01");
          setCohortEnd("2026-07-14");
          setFlagAutoDeploy(true);
          setFlagMentorReviews(true);
          setFlagDemoDay(false);
          setFlagAnalytics(true);
        }}>
          Reset to Defaults
        </Button>
        <Button variant="premium" size="sm" onClick={handleSave} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}