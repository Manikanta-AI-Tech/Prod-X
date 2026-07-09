import { supabase } from "./supabase";

export interface JourneyTask {
  id: string;
  journey_day_id: string;
  name: string;
  done: boolean;
  created_at: string;
}

export interface JourneyDay {
  id: string;
  day_number: number;
  title: string;
  created_at: string;
  tasks: JourneyTask[];
}

/**
 * Fetch all journey days with their tasks, ordered by day number.
 */
export async function listJourneyDays(): Promise<JourneyDay[]> {
  const { data, error } = await supabase
    .from("journey_days")
    .select(
      `
      *,
      tasks:journey_tasks(*)
    `
    )
    .order("day_number", { ascending: true });

  if (error) throw error;
  return (data as JourneyDay[]) ?? [];
}

/**
 * Toggle a task's done status.
 */
export async function toggleTask(
  taskId: string,
  done: boolean
): Promise<JourneyTask> {
  const { data, error } = await supabase
    .from("journey_tasks")
    .update({ done })
    .eq("id", taskId)
    .select()
    .single();

  if (error) throw error;
  return data as JourneyTask;
}