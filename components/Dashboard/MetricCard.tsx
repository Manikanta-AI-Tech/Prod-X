"use client";

import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: number;
  description?: string;
}

export function MetricCard({
  title,
  value,
  icon: Icon,
  trend,
  description,
}: MetricCardProps) {
  return (
    <div className="rounded-2xl border border-border/40 bg-card/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-electric-blue/40 hover:shadow-lg hover:shadow-electric-blue/10">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            {title}
          </p>

          <h3 className="mt-2 text-3xl font-bold text-white">
            {value}
          </h3>

          {description && (
            <p className="mt-2 text-xs text-muted-foreground">
              {description}
            </p>
          )}
        </div>

        <div className="rounded-xl bg-electric-blue/10 p-3">
          <Icon className="h-6 w-6 text-electric-blue" />
        </div>
      </div>

      {trend !== undefined && (
        <div className="mt-5 flex items-center gap-2">
          {trend >= 0 ? (
            <TrendingUp className="h-4 w-4 text-green-500" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-500" />
          )}

          <span
            className={`text-sm font-medium ${
              trend >= 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            {Math.abs(trend)}%
          </span>

          <span className="text-xs text-muted-foreground">
            vs last week
          </span>
        </div>
      )}
    </div>
  );
}