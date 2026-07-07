"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { ProductsTable } from "@/components/admin/products/ProductsTable";
import { listProducts } from "@/lib/products";
import type { Product, ProductStatus } from "@/lib/products";

const PROGRESS_RANGES = [
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [statusFilter, setStatusFilter] = useState<ProductStatus | "all">(
    (searchParams.get("status") as ProductStatus | "all") || "all"
  );
  const [progressRange, setProgressRange] = useState(0);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const range = PROGRESS_RANGES[progressRange];
      const result = await listProducts({
        search,
        status: statusFilter,
        progressMin: range.min,
        progressMax: range.max,
        pageSize: 50,
      });
      setProducts(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, progressRange]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (statusFilter !== "all") params.set("status", statusFilter);
    const qs = params.toString();
    router.replace(`/admin/products${qs ? `?${qs}` : ""}`, { scroll: false });
  }, [search, statusFilter, router]);

  const filterButtonClass = (active: boolean) =>
    `rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
      active
        ? "bg-electric-blue text-white"
        : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-white"
    }`;

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Products</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage all builder products</p>
        </div>
        <Button variant="premium" onClick={() => router.push("/admin/products/new")}>
          + New Product
        </Button>
      </div>

      <div className="mb-6 space-y-4 rounded-xl border border-border/40 bg-card/40 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              className="w-full rounded-lg border border-border/40 bg-black/30 py-2 pl-10 pr-3 text-sm text-white placeholder-muted-foreground focus:border-electric-blue focus:outline-none"
              placeholder="Search by name or team..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">Status:</span>
            {(["all", "draft", "published"] as const).map((s) => (
              <button
                key={s}
                className={filterButtonClass(statusFilter === s)}
                onClick={() => setStatusFilter(s)}
              >
                {s === "all" ? "All" : s === "draft" ? "Draft" : "Published"}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">Progress:</span>
            {PROGRESS_RANGES.map((range, i) => (
              <button
                key={range.label}
                className={filterButtonClass(progressRange === i)}
                onClick={() => setProgressRange(i)}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading && (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-white/5" />
          ))}
        </div>
      )}

      {error && !loading && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-6 py-8 text-center">
          <p className="text-sm text-red-400">{error}</p>
          <Button variant="ghost" size="sm" className="mt-3" onClick={fetchProducts}>
            Try Again
          </Button>
        </div>
      )}

      {!loading && !error && (
        <ProductsTable products={products} onRefresh={fetchProducts} />
      )}
    </div>
  );
}
