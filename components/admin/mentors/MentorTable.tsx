"use client";

import { useState } from "react";
import { ExternalLink, Pencil, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { MentorAvatar } from "./MentorAvatar";
import { DeleteMentorDialog } from "./DeleteMentorDialog";
import type { Mentor, MentorStatus } from "@/lib/mentors";

const statusConfig: Record<MentorStatus, { label: string; variant: "premium" | "secondary" }> = {
  active: { label: "Active", variant: "premium" },
  inactive: { label: "Inactive", variant: "secondary" },
};

interface MentorTableProps {
  mentors: Mentor[];
  onDeleted: (id: string) => void;
}

export function MentorTable({ mentors, onDeleted }: MentorTableProps) {
  const [deleteTarget, setDeleteTarget] = useState<Mentor | null>(null);

  if (mentors.length === 0) return null;

  return (
    <>
      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-2xl border border-border/40 md:block">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/40 bg-card/40">
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Mentor</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Company</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Designation</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Expertise</th>
              <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Teams</th>
              <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Builders</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/20">
            {mentors.map((mentor) => (
              <tr key={mentor.id} className="group transition hover:bg-white/[0.02]">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <MentorAvatar name={mentor.name} avatarUrl={mentor.avatar_url} />
                    <div>
                      <Link href={`/admin/mentors/${mentor.id}`} className="font-medium text-white transition hover:text-electric-blue">
                        {mentor.name}
                      </Link>
                      <p className="mt-0.5 text-xs text-muted-foreground">{mentor.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{mentor.company}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{mentor.designation}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{mentor.expertise}</td>
                <td className="px-6 py-4 text-center text-sm text-muted-foreground">{mentor.assigned_teams.length}</td>
                <td className="px-6 py-4 text-center text-sm text-muted-foreground">{mentor.builders_count}</td>
                <td className="px-6 py-4">
                  <Badge variant={statusConfig[mentor.status].variant}>
                    {statusConfig[mentor.status].label}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-1">
                    <Link href={`/admin/mentors/${mentor.id}`} className="rounded-lg p-2 text-muted-foreground transition hover:bg-white/5 hover:text-white" title="View Profile">
                      <Eye className="h-4 w-4" />
                    </Link>
                    <Link href={`/admin/mentors/${mentor.id}/edit`} className="rounded-lg p-2 text-muted-foreground transition hover:bg-white/5 hover:text-white" title="Edit">
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => setDeleteTarget(mentor)}
                      className="rounded-lg p-2 text-muted-foreground transition hover:bg-red-500/10 hover:text-red-400"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile card layout */}
      <div className="space-y-4 md:hidden">
        {mentors.map((mentor) => (
          <div key={mentor.id} className="rounded-2xl border border-border/40 bg-card/40 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <MentorAvatar name={mentor.name} avatarUrl={mentor.avatar_url} />
                <div className="min-w-0">
                  <Link href={`/admin/mentors/${mentor.id}`} className="font-medium text-white transition hover:text-electric-blue">
                    {mentor.name}
                  </Link>
                  <p className="text-xs text-muted-foreground truncate">{mentor.email}</p>
                  <Badge variant={statusConfig[mentor.status].variant} className="mt-1">
                    {statusConfig[mentor.status].label}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              <span>Company: {mentor.company}</span>
              <span>Role: {mentor.designation}</span>
              <span>Expertise: {mentor.expertise}</span>
              <span>Teams: {mentor.assigned_teams.length}</span>
              <span>Builders: {mentor.builders_count}</span>
            </div>
            <div className="mt-3 flex items-center gap-2 border-t border-border/20 pt-3">
              <Link href={`/admin/mentors/${mentor.id}`} className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-muted-foreground transition hover:bg-white/5 hover:text-white">
                <Eye className="h-3.5 w-3.5" /> Profile
              </Link>
              <Link href={`/admin/mentors/${mentor.id}/edit`} className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-muted-foreground transition hover:bg-white/5 hover:text-white">
                <Pencil className="h-3.5 w-3.5" /> Edit
              </Link>
              <button onClick={() => setDeleteTarget(mentor)} className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-red-400 transition hover:bg-red-500/10">
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <DeleteMentorDialog
        mentor={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onDeleted={(id) => { setDeleteTarget(null); onDeleted(id); }}
      />
    </>
  );
}