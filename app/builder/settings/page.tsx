"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SettingsPage() {

  const [email, setEmail] = useState("");

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setEmail(user.email || "");
      }
    }

    loadUser();
  }, []);

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <div className="p-8 text-white max-w-xl">

      <h1 className="text-3xl font-bold mb-8">
        Settings
      </h1>

      <div className="bg-zinc-900 rounded-xl p-6">

        <p className="mb-6">
          Logged in as
        </p>

        <div className="text-blue-400 mb-8">
          {email}
        </div>

        <button
          onClick={logout}
          className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg"
        >
          Sign Out
        </button>

      </div>

    </div>
  );
}