"use client";

import { Suspense, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Navbar } from "@/components/Navbar";

function SetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    if (password !== confirmPassword) { setMessage("Passwords do not match"); setLoading(false); return; }
    if (password.length < 6) { setMessage("Password must be at least 6 characters"); setLoading(false); return; }
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setSuccess(true);
      setMessage("Password set! Redirecting...");
      setTimeout(() => router.push("/auth"), 2000);
    } catch (err: any) { setMessage(err.message); }
    finally { setLoading(false); }
  }

  return (
    <main className="flex flex-1 items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-border/40 bg-card p-8 shadow-xl">
        <h1 className="mb-2 text-2xl font-bold text-white">Set Your Password</h1>
        <p className="mb-6 text-sm text-muted-foreground">{email ? `Welcome, ${email}` : "Choose a password to access your account."}</p>
        {success ? (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">{message}</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">New Password</label>
              <input type="password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)}
                className="w-full rounded-lg border border-border/40 bg-background px-4 py-2 text-sm text-white focus:border-electric-blue focus:outline-none" placeholder="••••••••" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Confirm Password</label>
              <input type="password" required minLength={6} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                className="w-full rounded-lg border border-border/40 bg-background px-4 py-2 text-sm text-white focus:border-electric-blue focus:outline-none" placeholder="••••••••" />
            </div>
            {message && <p className="text-xs text-red-400">{message}</p>}
            <Button type="submit" disabled={loading} className="w-full premium">{loading ? "Saving..." : "Set Password & Login"}</Button>
          </form>
        )}
      </div>
    </main>
  );
}

export default function SetPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <Suspense fallback={<div className="flex flex-1 items-center justify-center"><p className="text-muted-foreground">Loading...</p></div>}>
        <SetPasswordForm />
      </Suspense>
    </div>
  );
}