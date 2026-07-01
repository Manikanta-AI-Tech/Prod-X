"use client";

import { motion } from "framer-motion";
import { logEntries } from "@/data/mock";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Heart, MessageCircle, Share2, Send } from "lucide-react";

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function LogPage() {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Builder Log</h1>
            <p className="mt-2 text-muted-foreground">
              Daily updates from the cohort. Share progress, wins, and blockers.
            </p>
          </div>
          <Badge className="ml-auto bg-electric-blue/15 text-electric-blue border-electric-blue/20">
            {logEntries.length} posts
          </Badge>
        </div>
      </motion.div>

      {/* New Post */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
      >
        <Card className="border-border/40">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-electric-blue text-xs font-bold text-white">
                JD
              </div>
              <div className="flex-1">
                <textarea
                  rows={2}
                  placeholder="What did you build today?"
                  className="w-full resize-none rounded-lg border border-border/40 bg-background px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:border-electric-blue focus:outline-none focus:ring-1 focus:ring-electric-blue"
                />
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex gap-3 text-sm text-muted-foreground">
                    <span className="cursor-pointer hover:text-white transition-colors">📎</span>
                    <span className="cursor-pointer hover:text-white transition-colors">🎨</span>
                    <span className="cursor-pointer hover:text-white transition-colors">💻</span>
                  </div>
                  <button className="flex items-center gap-2 rounded-lg bg-electric-blue px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-electric-blue/90">
                    <Send className="h-3.5 w-3.5" />
                    Post
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Log Feed */}
      <div className="space-y-4">
        {logEntries.map((entry, index) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 * index }}
          >
            <Card className="border-border/40 transition-colors hover:border-border">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-muted to-muted/50 text-xs font-bold text-white">
                    {entry.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white">{entry.author}</span>
                      <span className="text-xs text-muted-foreground">{formatDate(entry.timestamp)}</span>
                    </div>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      {entry.content}
                    </p>
                    <div className="mt-3 flex items-center gap-4 text-sm">
                      <button className="flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-red-400">
                        <Heart className="h-4 w-4" />
                        <span>{entry.likes}</span>
                      </button>
                      <button className="flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-white">
                        <MessageCircle className="h-4 w-4" />
                        <span>Reply</span>
                      </button>
                      <button className="flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-white">
                        <Share2 className="h-4 w-4" />
                        <span>Share</span>
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}