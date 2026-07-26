"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Navbar } from "@/components/Navbar";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Server handles cookie setting via createServerClient.
      // Navigate to the role-based dashboard with a full page load
      // so the middleware reads the freshly-set cookies.
      window.location.href = data.redirectTo || "/builder";
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
          <h1 className="mb-2 text-2xl font-bold text-white">Welcome Back</h1>
          <p className="mb-6 text-sm text-muted-foreground">
            Log in to your builder workspace.
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
              <p className="text-xs text-red-400">{message}</p>
            )}

            <Button type="submit" disabled={loading} className="w-full premium">
              {loading ? "Processing..." : "Sign In"}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}