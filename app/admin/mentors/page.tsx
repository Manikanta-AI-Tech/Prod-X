import { Suspense } from "react";
import { MentorsPageContent } from "./mentors-page-content";

export default function AdminMentorsPage() {
  return (
    <Suspense fallback={<MentorsPageFallback />}>
      <MentorsPageContent />
    </Suspense>
  );
}

function MentorsPageFallback() {
  return (
    <div className="space-y-8">
      <div>
        <div className="h-8 w-48 animate-pulse rounded-lg bg-white/5" />
        <div className="mt-2 h-4 w-72 animate-pulse rounded-lg bg-white/5" />
      </div>
      <div className="space-y-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-16 animate-pulse rounded-2xl bg-white/5" />
        ))}
      </div>
    </div>
  );
}