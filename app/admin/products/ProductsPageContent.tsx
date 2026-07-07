"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, Rocket, Search } from "lucide-react";
import Link from "next/link";
import { DashboardTopbar } from "@/components/Dashboard/DashboardTopbar";
import { EmptyState } from "@/components/Dashboard/EmptyState";
import { Button } from "@/components/ui/Button";
import { ProductsTable } from "@/components/admin/products/ProductsTable";
import { listProducts, type Product, type ProductStatus } from "@/lib/products";

const statusOptions: { label: string; value: ProductStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Idea", value: "idea" },
  { label: "Building", value: "building" },
  { label: "Testing", value: "testing" },
  { label: "Live", value: "live" },
];

const progressRanges: { label: string; min: number; max: number }[] = [
  { label: "All", min: 0, max: 100 },
  { label: "0–25%", min: 0, max: 25 },
  { label: "25–50%", min: 25, max: 50 },
  { label: "50–75%", min: 50, max: 75 },
  { label: "75–100%", min: 75, max: 100 },
];

export function ProductsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const search = searchParams.get("search") ?? "";
  const status = (searchParams.get("status") ?? "all") as ProductStatus | "all";
  const progressRange = parseInt(searchParams.get("progress") ?? "0", 10);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const range = progressRanges[progressRange] ?? progressRanges[0];
      const result = await listProducts({
        search: search || undefined,
        status: status,
        progressMin: range.min,
        progressMax: range.max,
      });
      setProducts(result.data);
      setCount(result.count);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [search, status, progressRange]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  function setParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/admin/products?${params.toString()}`);
  }

  function handleDeleted(id: string) {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setCount((prev) => prev - 1);
  }

  const filterButtonClass = (active: boolean) =>
    `rounded-lg px-3 py-1.5 text-xs font-medium transition ${
      active
        ? "bg-electric-blue/20 text-electric-blue"
        : "text-muted-foreground hover:bg-white/5 hover:text-white"
    }`;

  return (
    <div className="space-y-8">
      <DashboardTopbar
        title="Products"
        subtitle="Manage builder products across all teams."
      />

      {/* Filters */}
      <div className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name or team..."
            className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-4 text-sm text-white outline-none transition focus:border-electric-blue"
            value={search}
            onChange={(e) => setParam("search", e.target.value)}
          />
        </div>

        {/* Status filter */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">Status:</span>
          {statusOptions.map((option) => (
            <button
              key={option.value}
              className={filterButtonClass(status === option.value)}
              onClick={() => setParam("status", option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Progress filter */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">Progress:</span>
          {progressRanges.map((range, i) => (
            <button
              key={range.label}
              className={filterButtonClass(progressRange === i)}
              onClick={() => setParam("progress", i === 0 ? "" : String(i))}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-2xl bg-white/5" />
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-red-500/30 bg-red-500/5 px-8 py-16 text-center">
          <p className="text-sm text-red-400">{error}</p>
          <Button variant="outline" className="mt-4" onClick={fetchProducts}>
            Retry
          </Button>
        </div>
      ) : products.length === 0 ? (
        <EmptyState
          title="No products yet"
          description={
            search || status !== "all" || progressRange !== 0
              ? "No products match the current filters. Try adjusting your search or filter criteria."
              : "Builders haven't launched any products yet. Products will appear here once teams start building."
          }
          icon={<Rocket className="h-10 w-10 text-electric-blue" />}
        />
      ) : (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {products.length} of {count} products
            </p>
            <Link href="/admin/products/new">
              <Button variant="premium" className="gap-2">
                <Plus className="h-4 w-4" />
                New Product
              </Button>
            </Link>
          </div>
          <ProductsTable products={products} onDeleted={handleDeleted} />
        </>
      )}
    </div>
  );
}