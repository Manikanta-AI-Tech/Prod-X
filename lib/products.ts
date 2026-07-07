import { supabase } from "./supabase";

export type ProductStatus = "draft" | "published";

export interface Product {
  id: string;
  name: string;
  short_description: string;
  team: string;
  progress: number;
  github_url: string | null;
  demo_url: string | null;
  cover_image: string | null;
  status: ProductStatus;
  created_at: string;
  updated_at: string;
}

export interface ProductInput {
  name: string;
  short_description: string;
  team: string;
  progress: number;
  github_url?: string;
  demo_url?: string;
  cover_image?: string;
  status: ProductStatus;
}

export interface ProductFilters {
  search?: string;
  status?: ProductStatus | "all";
  progressMin?: number;
  progressMax?: number;
  page?: number;
  pageSize?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export async function listProducts(filters: ProductFilters = {}): Promise<PaginatedResult<Product>> {
  const {
    search = "",
    status = "all",
    progressMin = 0,
    progressMax = 100,
    page = 1,
    pageSize = 20,
  } = filters;

  let query = supabase
    .from("products")
    .select("*", { count: "exact" });

  if (search) {
    query = query.or(`name.ilike.%${search}%,team.ilike.%${search}%`);
  }

  if (status && status !== "all") {
    query = query.eq("status", status);
  }

  query = query
    .gte("progress", progressMin)
    .lte("progress", progressMax)
    .order("created_at", { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1);

  const { data, error, count } = await query;

  if (error) throw new Error(`Failed to fetch products: ${error.message}`);

  return {
    data: (data as Product[]) || [],
    count: count || 0,
    page,
    pageSize,
    totalPages: Math.ceil((count || 0) / pageSize),
  };
}

export async function getProduct(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(`Failed to fetch product: ${error.message}`);
  return data as Product | null;
}

export async function createProduct(input: ProductInput): Promise<Product> {
  const { data, error } = await supabase
    .from("products")
    .insert({
      name: input.name,
      short_description: input.short_description,
      team: input.team,
      progress: input.progress,
      github_url: input.github_url || null,
      demo_url: input.demo_url || null,
      cover_image: input.cover_image || null,
      status: input.status,
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to create product: ${error.message}`);
  return data as Product;
}

export async function updateProduct(id: string, input: Partial<ProductInput>): Promise<Product> {
  const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };

  if (input.name !== undefined) updateData.name = input.name;
  if (input.short_description !== undefined) updateData.short_description = input.short_description;
  if (input.team !== undefined) updateData.team = input.team;
  if (input.progress !== undefined) updateData.progress = input.progress;
  if (input.github_url !== undefined) updateData.github_url = input.github_url || null;
  if (input.demo_url !== undefined) updateData.demo_url = input.demo_url || null;
  if (input.cover_image !== undefined) updateData.cover_image = input.cover_image || null;
  if (input.status !== undefined) updateData.status = input.status;

  const { data, error } = await supabase
    .from("products")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(`Failed to update product: ${error.message}`);
  return data as Product;
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id);

  if (error) throw new Error(`Failed to delete product: ${error.message}`);
}
