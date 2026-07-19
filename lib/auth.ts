import { supabase } from "./supabase";

export function getUserRole(user: any): string | null {
  return user?.user_metadata?.role || null;
}

export function getDashboardRoute(role: string | null): string {
  switch (role) {
    case "admin": return "/admin";
    case "mentor": return "/mentor";
    case "builder": return "/builder";
    default: return "/auth";
  }
}

export function canAccessRoute(role: string | null, path: string): boolean {
  if (!role) return path.startsWith("/auth");
  if (role === "admin") return true;
  if (role === "mentor") return path.startsWith("/mentor") || path.startsWith("/auth") || path === "/";
  if (role === "builder") return path.startsWith("/builder") || path.startsWith("/auth") || path === "/";
  return path.startsWith("/auth");
}