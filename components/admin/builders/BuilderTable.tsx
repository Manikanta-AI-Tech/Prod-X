"use client";

import { useState } from "react";
import { ExternalLink, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";
import { BuilderAvatar } from "./BuilderAvatar";
import { DeleteBuilderDialog } from "./DeleteBuilderDialog";
import type { Builder, BuilderStatus } from "@/lib/builders";

const statusConfig: Record<
  BuilderStatus,
  { label: string; variant: "premium" | "success" | "secondary" }
> = {
  active: { label: "Active", variant: "premium" },
  completed: { label: "Completed", variant: "success" },
  paused: { label: "Paused", variant: "secondary" },
};

interface BuilderTableProps {
  builders: Builder[];
  onDeleted: (id: string) => void;
}

export function BuilderTable({ builders, onDeleted }: BuilderTableProps) {
  const [deleteTarget, setDeleteTarget] = useState<Builder | null>(null);

  if (builders.length === 0) return null;

  return (
    <>
      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-2xl border border-border/40 md:block">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/40 bg-card/40">
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Builder
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Team
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Role
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Progress
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/20">
            {builders.map((builder) => (
              <tr
                key={builder.id}
                className="group transition hover:bg-white/[0.02]"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <BuilderAvatar
                      name={builder.full_name}
                      avatarUrl={builder.avatar_url}
                    />
                    <div>
                      <Link
                        href={`/admin/builders/${builder.id}/edit`}
                        className="font-medium text-white transition hover:text-electric-blue"
                      >
                        {builder.full_name}
                      </Link>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {builder.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {builder.team}
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {builder.role}
                </td>
                <td className="px-6 py-4">
                  <Badge variant={statusConfig[builder.status].variant}>
                    {statusConfig[builder.status].label}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <Progress value={builder.progress} className="h-2" />
                    </div>
                    <span className="min-w-[2.5rem] text-right text-xs font-medium text-muted-foreground">
                      {builder.progress}%
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/admin/builders/${builder.id}/edit`}
                      className="rounded-lg p-2 text-muted-foreground transition hover:bg-white/5 hover:text-white"
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => setDeleteTarget(builder)}
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
        {builders.map((builder) => (
          <div
            key={builder.id}
            className="rounded-2xl border border-border/40 bg-card/40 p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <BuilderAvatar
                  name={builder.full_name}
                  avatarUrl={builder.avatar_url}
                />
                <div className="min-w-0">
                  <Link
                    href={`/admin/builders/${builder.id}/edit`}
                    className="font-medium text-white transition hover:text-electric-blue"
                  >
                    {builder.full_name}
                  </Link>
                  <p className="text-xs text-muted-foreground truncate">
                    {builder.email}
                  </p>
                  <Badge
                    variant={statusConfig[builder.status].variant}
                    className="mt-1"
                  >
                    {statusConfig[builder.status].label}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              <span>Team: {builder.team}</span>
              <span>Role: {builder.role}</span>
              <span>Cohort: {builder.cohort}</span>
              <span>Product: {builder.product}</span>
            </div>

            <div className="mt-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium text-white">
                  {builder.progress}%
                </span>
              </div>
              <Progress value={builder.progress} className="mt-1 h-2" />
            </div>

            <div className="mt-3 flex items-center gap-2 border-t border-border/20 pt-3">
              <Link
                href={`/admin/builders/${builder.id}/edit`}
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-muted-foreground transition hover:bg-white/5 hover:text-white"
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </Link>
              <button
                onClick={() => setDeleteTarget(builder)}
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-red-400 transition hover:bg-red-500/10"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <DeleteBuilderDialog
        builder={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onDeleted={(id) => {
          setDeleteTarget(null);
          onDeleted(id);
        }}
      />
    </>
  );
}