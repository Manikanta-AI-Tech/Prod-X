"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");

  async function signIn() {
    await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/builder`,
      },
    });

    alert("Check your email for the login link.");
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-96 rounded-xl border p-8">
        <h1 className="mb-6 text-2xl font-bold">Login to Prod[X]</h1>

        <input
          className="mb-4 w-full rounded border p-3"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={signIn}
          className="w-full rounded bg-blue-600 p-3 text-white"
        >
          Continue
        </button>
      </div>
    </div>
  );
}