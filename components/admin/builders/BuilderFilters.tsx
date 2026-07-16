"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { getCohortOptions, getTeamOptions } from "@/lib/builders";

interface BuilderFiltersProps {
  search: string;
  cohort: string;
  team: string;
  onSearchChange: (value: string) => void;
  onCohortChange: (value: string) => void;
  onTeamChange: (value: string) => void;
}

export function BuilderFilters({
  search,
  cohort,
  team,
  onSearchChange,
  onCohortChange,
  onTeamChange,
}: BuilderFiltersProps) {
  const [cohortOptions, setCohortOptions] = useState<string[]>([]);
  const [teamOptions, setTeamOptions] = useState<string[]>([]);

  useEffect(() => {
    async function load() {
      const [cohorts, teams] = await Promise.all([
        getCohortOptions(),
        getTeamOptions(),
      ]);
      setCohortOptions(cohorts);
      setTeamOptions(teams);
    }
    load();
  }, []);

  const selectClass =
    "rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-white outline-none transition focus:border-electric-blue min-w-[140px]";

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by name or email..."
          className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-4 text-sm text-white outline-none transition focus:border-electric-blue"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">
            Cohort:
          </span>
          <select
            className={selectClass}
            value={cohort}
            onChange={(e) => onCohortChange(e.target.value)}
          >
            <option value="">All Cohorts</option>
            {cohortOptions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">
            Team:
          </span>
          <select
            className={selectClass}
            value={team}
            onChange={(e) => onTeamChange(e.target.value)}
          >
            <option value="">All Teams</option>
            {teamOptions.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}