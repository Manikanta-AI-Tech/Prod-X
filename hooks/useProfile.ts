"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./useAuth";

export interface Profile {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string;
  role: 'builder' | 'mentor' | 'judge' | 'admin';
}

export interface Team {
  id: string;
  name: string;
  tagline: string;
  progress: number;
}

export function useProfile() {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }

    async function fetchData() {
      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user!.id)
        .single();
      
      setProfile(profileData);

      // Fetch team through team_members
      const { data: memberData } = await supabase
        .from('team_members')
        .select('team_id, teams(*)')
        .eq('profile_id', user!.id)
        .single();

      if (memberData) {
        setTeam(memberData.teams as any);
      }

      setLoading(false);
    }

    fetchData();
  }, [user, authLoading]);

  return { profile, team, loading };
}
