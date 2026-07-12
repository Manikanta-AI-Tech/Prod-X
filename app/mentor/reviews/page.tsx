"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Clock,
  Code,
  Palette,
  FileText,
  Presentation,
  CheckCircle2,
  XCircle,
  Archive,
} from "lucide-react";
import { pendingReviews, recentReviews } from "@/data/mock";
import type { ReviewItem } from "@/data/mock";

const typeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  code: Code,
  design: Palette,
  presentation: Presentation,
  plan: FileText,
};

const typeLabels: Record<string, string> = {
  code: "Code Review",
  design: "Design Review",
  presentation: "Presentation",
  plan: "Plan Review",
};

const statusConfig: Record<
  string,
  { label: string; variant: "premium" | "success" | "destructive" | "secondary" }
> = {
  pending: { label: "Pending", variant: "premium" },
  reviewed: { label: "Reviewed", variant: "success" },
  changes_requested: { label: "Changes Requested", variant: "destructive" },
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

type Tab = "pending" | "reviewed";

export default function MentorReviewsPage() {
  const [tab, setTab] = useState<Tab>("pending");

  const items = tab === "pending" ? pendingReviews : recentReviews;

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Reviews
        </h1>
        <p className="mt-2 text-muted-foreground">
          Review team deliverables and provide feedback.
        </p>
      </motion.div>

      {/* Tabs */}
      <div className="flex items-center gap-1 rounded-xl border border-border/40 bg-card/40 p-1">
        <button
          onClick={() => setTab("pending")}
          className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition ${
            tab === "pending"
              ? "bg-electric-blue/20 text-electric-blue"
              : "text-muted-foreground hover:text-white"
          }`}
        >
          Pending ({pendingReviews.length})
        </button>
        <button
          onClick={() => setTab("reviewed")}
          className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition ${
            tab === "reviewed"
              ? "bg-electric-blue/20 text-electric-blue"
              : "text-muted-foreground hover:text-white"
          }`}
        >
          Reviewed ({recentReviews.length})
        </button>
      </div>

      {/* Review items */}
      <div className="space-y-4">
        {items.map((review, index) => {
          const TypeIcon = typeIcons[review.type] || FileText;
          const config = statusConfig[review.status] || statusConfig.pending;
          return (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.03 * index }}
            >
              <Card className="border-border/40 transition-colors hover:border-border">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-electric-blue/10">
                      <TypeIcon className="h-5 w-5 text-electric-blue" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-white">
                              {review.title}
                            </h3>
                            <Badge variant={config.variant}>
                              {config.label}
                            </Badge>
                          </div>
                          <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="font-medium text-white">
                              {review.teamName}
                            </span>
                            <span>{typeLabels[review.type]}</span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatDate(review.submittedAt)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center gap-2">
                        {tab === "pending" && (
                          <>
                            <Button size="sm" variant="premium" className="h-8 gap-1.5">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              Approve
                            </Button>
                            <Button size="sm" variant="destructive" className="h-8 gap-1.5">
                              <XCircle className="h-3.5 w-3.5" />
                              Request Changes
                            </Button>
                          </>
                        )}
                        {tab === "reviewed" && (
                          <Button size="sm" variant="outline" className="h-8 gap-1.5">
                            <Archive className="h-3.5 w-3.5" />
                            View Review
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}

        {items.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/40 px-8 py-16 text-center">
            <p className="text-sm text-muted-foreground">
              {tab === "pending"
                ? "No pending reviews. Great job staying on top of things!"
                : "No reviewed items yet."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}