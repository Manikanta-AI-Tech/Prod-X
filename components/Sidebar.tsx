"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Rocket, 
  BookOpen, 
  Trophy, 
  Users, 
  Settings, 
  Target, 
  Zap,
  ShieldCheck,
  Package,
  Layers
} from "lucide-react";

interface SidebarProps {
  type: "builder" | "mentor" | "admin";
}

const navItems = {
  builder: [
    { name: "Dashboard", href: "/builder", icon: LayoutDashboard },
    { name: "Builder Passport", href: "/builder/passport", icon: ShieldCheck },
    { name: "Journey", href: "/builder/journey", icon: Rocket },
    { name: "Builder Log", href: "/builder/log", icon: BookOpen },
    { name: "Leaderboard", href: "/builder/leaderboard", icon: Trophy },
    { name: "Team", href: "/builder/team", icon: Users },
    { name: "Settings", href: "/builder/settings", icon: Settings },
  ],
  mentor: [
    { name: "Dashboard", href: "/mentor", icon: LayoutDashboard },
    { name: "Teams", href: "/mentor/teams", icon: Users },
    { name: "Reviews", href: "/mentor/reviews", icon: BookOpen },
    { name: "Milestones", href: "/mentor/milestones", icon: Target },
    { name: "Leaderboard", href: "/mentor/leaderboard", icon: Trophy },
  ],
  admin: [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Cohorts", href: "/admin/cohorts", icon: Layers },
    { name: "Builders", href: "/admin/builders", icon: Users },
    { name: "Teams", href: "/admin/teams", icon: ShieldCheck },
    { name: "Mentors", href: "/admin/mentors", icon: Zap },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Leaderboard", href: "/admin/leaderboard", icon: Trophy },
    { name: "Analytics", href: "/admin/analytics", icon: Rocket },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ],
};

export function Sidebar({ type }: SidebarProps) {
  const pathname = usePathname();
  const items = navItems[type];

  return (
    <div className="fixed left-0 top-0 h-screen w-64 border-r border-border/40 bg-background/50 pt-16 backdrop-blur-xl">
      <div className="flex h-full flex-col p-4">
        <div className="mb-8 px-4 py-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {type} Interface
          </span>
        </div>
        <nav className="flex-1 space-y-1">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive 
                    ? "bg-electric-blue/10 text-electric-blue" 
                    : "text-muted-foreground hover:bg-white/5 hover:text-white"
                )}
              >
                <Icon className={cn("h-4 w-4", isActive ? "text-electric-blue" : "")} />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto border-t border-border/40 p-4">
          <div className="flex items-center gap-3 rounded-lg px-2 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-electric-blue text-xs font-bold text-white">
              JD
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-white">John Doe</span>
              <span className="text-[10px] text-muted-foreground">Builder #124</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
