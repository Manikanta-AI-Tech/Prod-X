import { supabase } from "./supabase";

export interface ActivityLogEntry {
  id: string;
  author: string;
  avatar: string;
  content: string;
  likes: number;
  created_at: string;
}

/**
 * Fetch all activity log entries, most recent first.
 */
export async function listActivityLog(): Promise<ActivityLogEntry[]> {
  const { data, error } = await supabase
    .from("activity_log")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as ActivityLogEntry[]) ?? [];
}

/**
 * Create a new activity log entry.
 */
export async function createActivityLogEntry(input: {
  author: string;
  avatar: string;
  content: string;
}): Promise<ActivityLogEntry> {
  const { data, error } = await supabase
    .from("activity_log")
    .insert({
      author: input.author,
      avatar: input.avatar,
      content: input.content,
      likes: 0,
    })
    .select()
    .single();

  if (error) throw error;
  return data as ActivityLogEntry;
}