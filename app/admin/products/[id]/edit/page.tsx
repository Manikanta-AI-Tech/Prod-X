"use client";

import { use, useEffect, useState } from "react";
import { notFound, useParams } from "next/navigation";
import { DashboardTopbar } from "@/components/Dashboard/DashboardTopbar";
import { ProductForm } from "@/components/admin/products/ProductForm";
import { getProduct, type Product } from "@/lib/products";

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getProduct(params.id);
        setProduct(data);
      } catch (err) {
        console.error("Failed to load product:", err);
        setError(err instanceof Error ? err.message : "Product not found");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [params.id]);

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <div className="h-8 w-48 animate-pulse rounded-lg bg-white/5" />
          <div className="mt-2 h-4 w-64 animate-pulse rounded-lg bg-white/5" />
        </div>
        <div className="h-96 animate-pulse rounded-2xl bg-white/5" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-red-500/30 bg-red-500/5 px-8 py-16 text-center">
        <p className="text-sm text-red-400">
          {error ?? "Product not found"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <DashboardTopbar
        title={`Edit: ${product.name}`}
        subtitle="Update product details, status, and progress."
      />

      <div className="rounded-2xl border border-border/40 bg-card/40 p-6 md:p-8">
        <ProductForm product={product} />
      </div>
    </div>
  );
}