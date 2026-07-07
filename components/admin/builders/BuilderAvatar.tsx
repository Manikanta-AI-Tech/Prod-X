"use client";

import { cn } from "@/lib/utils";

interface BuilderAvatarProps {
  name: string;
  avatarUrl?: string | null;
  className?: string;
}

export function BuilderAvatar({
  name,
  avatarUrl,
  className,
}: BuilderAvatarProps) {
  const initials = name
    .split(" ")
    .map((n) => n.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        className={cn(
          "h-9 w-9 flex-shrink-0 rounded-full object-cover",
          className
        )}
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = "none";
          (e.target as HTMLImageElement).nextElementSibling?.classList.remove("hidden");
        }}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-electric-blue/20 text-xs font-bold text-electric-blue",
        className
      )}
    >
      {initials}
    </div>
  );
}