"use client";

import { Search } from "lucide-react";
import { getExpertiseOptions } from "@/lib/mentors";

interface MentorFiltersProps {
  search: string;
  expertise: string;
  onSearchChange: (value: string) => void;
  onExpertiseChange: (value: string) => void;
}

export function MentorFilters({
  search,
  expertise,
  onSearchChange,
  onExpertiseChange,
}: MentorFiltersProps) {
  const expertiseOptions = getExpertiseOptions();

  const selectClass =
    "rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-white outline-none transition focus:border-electric-blue min-w-[160px]";

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by name, designation, or expertise..."
          className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-4 text-sm text-white outline-none transition focus:border-electric-blue"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">Expertise:</span>
          <select
            className={selectClass}
            value={expertise}
            onChange={(e) => onExpertiseChange(e.target.value)}
          >
            <option value="">All Expertise</option>
            {expertiseOptions.map((e) => (
              <option key={e} value={e}>{e}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}