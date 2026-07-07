import { Suspense } from "react";
import { BuildersPageContent } from "./builders-page-content";

export default function AdminBuildersPage() {
  return (
    <Suspense fallback={<BuildersPageFallback />}>
      <BuildersPageContent />
    </Suspense>
  );
}

function BuildersPageFallback() {
  return (
    <div className="space-y-8">
      <div>
        <div className="h-8 w-48 animate-pulse rounded-lg bg-white/5" />
        <div className="mt-2 h-4 w-72 animate-pulse rounded-lg bg-white/5" />
      </div>
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-16 animate-pulse rounded-2xl bg-white/5" />
        ))}
      </div>
    </div>
  );
}