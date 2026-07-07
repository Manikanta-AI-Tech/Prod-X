import { supabase } from "./supabase";

export type ProductStatus = "idea" | "building" | "testing" | "live";

export interface Product {
  id: string;
  name: string;
  short_description: string | null;
  team: string | null;
  status: ProductStatus;
  progress: number;
  github_url: string | null;
  demo_url: string | null;
  cover_image: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProductInput {
  name: string;
  short_description?: string | null;
  team?: string | null;
  status?: ProductStatus;
  progress?: number;
  github_url?: string | null;
  demo_url?: string | null;
  cover_image?: string | null;
}

export interface ProductFilters {
  search?: string;
  status?: ProductStatus | "all";
  progressMin?: number;
  progressMax?: number;
}

/**
 * List products with optional filters, search, and pagination.
 */
export async function listProducts(filters?: ProductFilters) {
  let query = supabase
    .from("products")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });

  if (filters?.search) {
    query = query.or(
      `name.ilike.%${filters.search}%,team.ilike.%${filters.search}%`
    );
  }

  if (filters?.status && filters.status !== "all") {
    query = query.eq("status", filters.status);
  }

  if (filters?.progressMin !== undefined) {
    query = query.gte("progress", filters.progressMin);
  }

  if (filters?.progressMax !== undefined) {
    query = query.lte("progress", filters.progressMax);
  }

  const { data, error, count } = await query;

  if (error) throw error;
  return { data: data as Product[], count: count ?? 0 };
}

/**
 * Get a single product by ID.
 */
export async function getProduct(id: string) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as Product;
}

/**
 * Create a new product.
 */
export async function createProduct(input: ProductInput) {
  const { data, error } = await supabase
    .from("products")
    .insert({
      name: input.name,
      short_description: input.short_description ?? null,
      team: input.team ?? null,
      status: input.status ?? "idea",
      progress: input.progress ?? 0,
      github_url: input.github_url ?? null,
      demo_url: input.demo_url ?? null,
      cover_image: input.cover_image ?? null,
    })
    .select()
    .single();

  if (error) throw error;
  return data as Product;
}

/**
 * Update an existing product.
 */
export async function updateProduct(id: string, input: Partial<ProductInput>) {
  const { data, error } = await supabase
    .from("products")
    .update({
      ...input,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Product;
}

/**
 * Delete a product by ID.
 */
export async function deleteProduct(id: string) {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
}