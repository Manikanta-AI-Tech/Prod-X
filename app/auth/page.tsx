"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { Navbar } from "@/components/Navbar";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: email.split('@')[0], // Default name
            }
          }
        });
        if (error) throw error;
        setMessage("Check your email for the confirmation link!");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push("/builder");
      }
    } catch (error: any) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-md rounded-2xl border border-border/40 bg-card p-8 shadow-xl">
          <h1 className="mb-2 text-2xl font-bold text-white">
            {isSignUp ? "Join Prod[X]" : "Welcome Back"}
          </h1>
          <p className="mb-6 text-sm text-muted-foreground">
            {isSignUp ? "Start your builder journey today." : "Log in to your builder workspace."}
          </p>

          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-border/40 bg-background px-4 py-2 text-sm text-white focus:border-electric-blue focus:outline-none"
                placeholder="alex@example.com"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-border/40 bg-background px-4 py-2 text-sm text-white focus:border-electric-blue focus:outline-none"
                placeholder="••••••••"
              />
            </div>

            {message && (
              <p className={`text-xs ${message.includes("Check") ? "text-emerald-400" : "text-red-400"}`}>
                {message}
              </p>
            )}

            <Button type="submit" disabled={loading} className="w-full premium">
              {loading ? "Processing..." : isSignUp ? "Create Account" : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-xs text-muted-foreground hover:text-electric-blue"
            >
              {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
