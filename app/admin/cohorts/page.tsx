import { Suspense } from "react";
import { CohortsPageContent } from "./cohorts-page-content";

export default function CohortsPage() {
  return (
    <Suspense fallback={<CohortsPageFallback />}>
      <CohortsPageContent />
    </Suspense>
  );
}

function CohortsPageFallback() {
  return (
    <div className="space-y-8">
      <div>
        <div className="h-8 w-48 animate-pulse rounded-lg bg-white/5" />
        <div className="mt-2 h-4 w-72 animate-pulse rounded-lg bg-white/5" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-48 animate-pulse rounded-2xl bg-white/5" />
        ))}
      </div>
    </div>
  );
}