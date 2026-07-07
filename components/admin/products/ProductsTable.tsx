"use client";

import { useState } from "react";
import { ExternalLink, GitFork, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "./StatusBadge";
import { ProgressCell } from "./ProgressCell";
import { DeleteProductDialog } from "./DeleteProductDialog";
import type { Product } from "@/lib/products";

interface ProductsTableProps {
  products: Product[];
  onDeleted: (id: string) => void;
}

export function ProductsTable({ products, onDeleted }: ProductsTableProps) {
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  if (products.length === 0) {
    return null; // Empty state is handled by the parent
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-2xl border border-border/40 md:block">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/40 bg-card/40">
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Product
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Team
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Progress
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/20">
            {products.map((product) => (
              <tr key={product.id} className="group transition hover:bg-white/[0.02]">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {product.cover_image ? (
                      <img
                        src={product.cover_image}
                        alt=""
                        className="h-10 w-10 flex-shrink-0 rounded-lg object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-electric-blue/10 text-sm font-bold text-electric-blue">
                        {product.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="font-medium text-white transition hover:text-electric-blue"
                      >
                        {product.name}
                      </Link>
                      {product.short_description && (
                        <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1 max-w-xs">
                          {product.short_description}
                        </p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {product.team ?? "—"}
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={product.status} />
                </td>
                <td className="px-6 py-4">
                  <ProgressCell progress={product.progress} />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-1">
                    {product.github_url && (
                      <a
                        href={product.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg p-2 text-muted-foreground transition hover:bg-white/5 hover:text-white"
                        title="GitHub"
                      >
                        <GitFork className="h-4 w-4" />
                      </a>
                    )}
                    {product.demo_url && (
                      <a
                        href={product.demo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg p-2 text-muted-foreground transition hover:bg-white/5 hover:text-white"
                        title="Demo"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="rounded-lg p-2 text-muted-foreground transition hover:bg-white/5 hover:text-white"
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => setDeleteTarget(product)}
                      className="rounded-lg p-2 text-muted-foreground transition hover:bg-red-500/10 hover:text-red-400"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile card layout */}
      <div className="space-y-4 md:hidden">
        {products.map((product) => (
          <div
            key={product.id}
            className="rounded-2xl border border-border/40 bg-card/40 p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                {product.cover_image ? (
                  <img
                    src={product.cover_image}
                    alt=""
                    className="h-10 w-10 flex-shrink-0 rounded-lg object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : (
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-electric-blue/10 text-sm font-bold text-electric-blue">
                    {product.name.charAt(0)}
                  </div>
                )}
                <div className="min-w-0">
                  <Link
                    href={`/admin/products/${product.id}/edit`}
                    className="font-medium text-white transition hover:text-electric-blue"
                  >
                    {product.name}
                  </Link>
                  <StatusBadge status={product.status} />
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                {product.github_url && (
                  <a href={product.github_url} target="_blank" rel="noopener noreferrer" className="rounded-lg p-2 text-muted-foreground hover:text-white" title="GitHub">
                    <GitFork className="h-4 w-4" />
                  </a>
                )}
                {product.demo_url && (
                  <a href={product.demo_url} target="_blank" rel="noopener noreferrer" className="rounded-lg p-2 text-muted-foreground hover:text-white" title="Demo">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
            {product.short_description && (
              <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
                {product.short_description}
              </p>
            )}
            <div className="mt-3 flex items-center justify-between gap-2">
              <span className="text-xs text-muted-foreground">
                {product.team ?? "No team"}
              </span>
              <ProgressCell progress={product.progress} />
            </div>
            <div className="mt-3 flex items-center gap-2 border-t border-border/20 pt-3">
              <Link
                href={`/admin/products/${product.id}/edit`}
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-muted-foreground transition hover:bg-white/5 hover:text-white"
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </Link>
              <button
                onClick={() => setDeleteTarget(product)}
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-red-400 transition hover:bg-red-500/10"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <DeleteProductDialog
        product={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onDeleted={(id) => {
          setDeleteTarget(null);
          onDeleted(id);
        }}
      />
    </>
  );
}