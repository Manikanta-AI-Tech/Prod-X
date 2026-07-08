"use client";

import { ExternalLink, Mail, Building2, GraduationCap, Users, Layers } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { MentorAvatar } from "./MentorAvatar";
import type { Mentor } from "@/lib/mentors";

interface MentorProfileCardProps {
  mentor: Mentor;
}

export function MentorProfileCard({ mentor }: MentorProfileCardProps) {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <CardContent className="p-0">
          <div className="flex flex-col items-start gap-6 sm:flex-row">
            <MentorAvatar name={mentor.name} avatarUrl={mentor.avatar_url} className="h-20 w-20 text-lg" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-white">{mentor.name}</h2>
                <Badge variant={mentor.status === "active" ? "premium" : "secondary"}>
                  {mentor.status === "active" ? "Active" : "Inactive"}
                </Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{mentor.designation} at {mentor.company}</p>

              <div className="mt-4 flex flex-wrap gap-3">
                <Link href={`mailto:${mentor.email}`} className="flex items-center gap-1.5 text-xs text-muted-foreground transition hover:text-electric-blue">
                  <Mail className="h-3.5 w-3.5" /> {mentor.email}
                </Link>
                {mentor.linkedin_url && (
                  <a href={mentor.linkedin_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-muted-foreground transition hover:text-electric-blue">
                    <ExternalLink className="h-3.5 w-3.5" /> LinkedIn
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="mb-2 text-sm font-semibold text-white">Bio</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{mentor.bio}</p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-border/30 bg-card/40 p-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Building2 className="h-4 w-4" />
                <span>Company</span>
              </div>
              <p className="mt-1 text-sm font-medium text-white">{mentor.company}</p>
            </div>
            <div className="rounded-xl border border-border/30 bg-card/40 p-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <GraduationCap className="h-4 w-4" />
                <span>Expertise</span>
              </div>
              <p className="mt-1 text-sm font-medium text-white">{mentor.expertise}</p>
            </div>
            <div className="rounded-xl border border-border/30 bg-card/40 p-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>Designation</span>
              </div>
              <p className="mt-1 text-sm font-medium text-white">{mentor.designation}</p>
            </div>
          </div>

          {/* Assigned cohorts & teams */}
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div>
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
                <Layers className="h-4 w-4 text-electric-blue" />
                Assigned Cohorts
              </h3>
              {mentor.assigned_cohorts.length > 0 ? (
                <ul className="space-y-2">
                  {mentor.assigned_cohorts.map((cohort) => (
                    <li key={cohort} className="flex items-center gap-2 rounded-lg border border-border/20 bg-card/40 px-3 py-2 text-sm text-muted-foreground">
                      {cohort}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">No cohorts assigned</p>
              )}
            </div>
            <div>
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
                <Users className="h-4 w-4 text-electric-blue" />
                Assigned Teams ({mentor.assigned_teams.length})
              </h3>
              {mentor.assigned_teams.length > 0 ? (
                <ul className="space-y-2">
                  {mentor.assigned_teams.map((team) => (
                    <li key={team} className="flex items-center gap-2 rounded-lg border border-border/20 bg-card/40 px-3 py-2 text-sm text-muted-foreground">
                      {team}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">No teams assigned</p>
              )}
            </div>
          </div>

          <div className="mt-6 flex items-center gap-4 border-t border-border/20 pt-6">
            <Link href={`/admin/mentors/${mentor.id}/edit`}>
              <Button variant="premium">Edit Mentor</Button>
            </Link>
            <Link href="/admin/mentors">
              <Button variant="outline">Back to Mentors</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}