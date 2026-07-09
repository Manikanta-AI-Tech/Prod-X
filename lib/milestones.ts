import { supabase } from "./supabase";

export type MilestoneStatus = "completed" | "current" | "pending";

export interface Milestone {
  id: string;
  day_number: number;
  title: string;
  status: MilestoneStatus;
  created_at: string;
}

/**
 * Fetch all milestones ordered by day number.
 */
export async function listMilestones(): Promise<Milestone[]> {
  const { data, error } = await supabase
    .from("milestones")
    .select("*")
    .order("day_number", { ascending: true });

  if (error) throw error;
  return data as Milestone[];
}

/**
 * Update a milestone's status.
 */
export async function updateMilestoneStatus(
  id: string,
  status: MilestoneStatus
): Promise<Milestone> {
  const { data, error } = await supabase
    .from("milestones")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Milestone;
}