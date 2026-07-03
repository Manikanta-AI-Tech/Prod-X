"use client";

import { Bell, Search } from "lucide-react";

interface DashboardTopbarProps {
  title: string;
  subtitle?: string;
}

export function DashboardTopbar({
  title,
  subtitle,
}: DashboardTopbarProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="flex items-center justify-between px-8 py-5">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            {title}
          </h1>

          {subtitle && (
            <p className="mt-1 text-sm text-muted-foreground">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="relative hidden lg:block">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

            <input
              type="text"
              placeholder="Search..."
              className="w-72 rounded-xl border border-border bg-background py-2 pl-10 pr-4 text-sm text-white outline-none focus:border-electric-blue"
            />
          </div>

          <button className="rounded-xl border border-border p-2 hover:border-electric-blue transition">
            <Bell className="h-5 w-5 text-muted-foreground" />
          </button>

          <div className="flex items-center gap-3 rounded-xl border border-border px-3 py-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-electric-blue text-sm font-bold text-white">
              A
            </div>

            <div className="hidden md:block">
              <p className="text-sm font-semibold text-white">
                Administrator
              </p>
              <p className="text-xs text-muted-foreground">
                Mission Control
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}