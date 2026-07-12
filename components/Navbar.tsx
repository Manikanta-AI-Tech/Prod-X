"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export function Navbar() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold tracking-tighter text-white">
              Prod<span className="text-electric-blue">[</span>X<span className="text-electric-blue">]</span>
            </span>
          </Link>
          <div className="hidden items-center gap-6 md:flex">
            <Link href="/#journey" className="text-sm font-medium text-muted-foreground transition-colors hover:text-white">
              Builder Journey
            </Link>
            {user && (
              <>
                <Link href="/builder" className="text-sm font-medium text-muted-foreground transition-colors hover:text-white">
                  Workspace
                </Link>
                <Link href="/mentor" className="text-sm font-medium text-muted-foreground transition-colors hover:text-white">
                  Mentor Studio
                </Link>
                <Link href="/admin" className="text-sm font-medium text-muted-foreground transition-colors hover:text-white">
                  Mission Control
                </Link>
              </>
            )}
            <Link href="/#manifesto" className="text-sm font-medium text-muted-foreground transition-colors hover:text-white">
              Manifesto
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {!loading && (
            user ? (
              <div className="flex items-center gap-4">
                <span className="hidden text-xs text-muted-foreground sm:inline-block">
                  {user.email}
                </span>
                <Button onClick={handleSignOut} variant="ghost" size="sm" className="text-muted-foreground hover:text-white">
                  Sign Out
                </Button>
              </div>
            ) : (
              <Link href="/auth">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-white">
                  Login
                </Button>
              </Link>
            )
          )}
          {!user && (
             <Link href="/auth">
                <Button variant="premium" size="sm" className="hidden sm:inline-flex">
                  Join Builder Journey
                </Button>
             </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
