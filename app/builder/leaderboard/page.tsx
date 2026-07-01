"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Entry = {
  id: string;
  total_points: number;
  teams: {
    name: string;
  };
};

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState<Entry[]>([]);

  useEffect(() => {
    async function loadLeaderboard() {
      const { data } = await supabase
        .from("leaderboard")
        .select(`
          id,
          total_points,
          teams(name)
        `)
        .order("total_points", { ascending: false });

      if (data) setLeaders(data as any);
    }

    loadLeaderboard();
  }, []);

  return (
    <div className="p-8 text-white">
      <h1 className="text-3xl font-bold mb-8">
        Leaderboard
      </h1>

      <div className="space-y-4">
        {leaders.map((team, index) => (
          <div
            key={team.id}
            className="bg-zinc-900 rounded-xl p-5 flex justify-between"
          >
            <div>
              <h2 className="font-bold">
                #{index + 1} {team.teams?.name}
              </h2>
            </div>

            <div className="font-bold text-blue-400">
              {team.total_points} pts
            </div>
          </div>
        ))}

        {leaders.length === 0 && (
          <div>No leaderboard data.</div>
        )}
      </div>
    </div>
  );
}