"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "./StatusBadge";
import { ProgressCell } from "./ProgressCell";
import { DeleteProductDialog } from "./DeleteProductDialog";
import type { Product } from "@/lib/products";

interface Props {
  products: Product[];
  onRefresh: () => void;
}

export function ProductsTable({ products, onRefresh }: Props) {
  const router = useRouter();
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-border/40 bg-card/40 py-16">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-electric-blue/10">
          <svg className="h-8 w-8 text-electric-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-white">No products yet</h3>
        <p className="mt-1 text-sm text-muted-foreground">Create your first product to get started.</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-border/40">
        {/* Desktop table */}
        <div className="hidden md:block">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/40 bg-black/20">
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Product</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Team</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Progress</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Created</th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {products.map((product) => (
                <tr key={product.id} className="transition-colors hover:bg-white/5">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {product.cover_image ? (
                        <img
                          src={product.cover_image}
                          alt=""
                          className="h-10 w-10 flex-shrink-0 rounded-lg object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                        />
                      ) : (
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-electric-blue/10 text-sm font-bold text-electric-blue">
                          {product.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium text-white">{product.name}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">{product.short_description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{product.team}</td>
                  <td className="px-4 py-3"><ProgressCell value={product.progress} /></td>
                  <td className="px-4 py-3"><StatusBadge status={product.status} /></td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {new Date(product.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/admin/products/${product.id}/edit`)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:text-red-300"
                        onClick={() => setDeleteTarget({ id: product.id, name: product.name })}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="divide-y divide-border/20 md:hidden">
          {products.map((product) => (
            <div key={product.id} className="px-4 py-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {product.cover_image ? (
                    <img src={product.cover_image} alt="" className="h-10 w-10 rounded-lg object-cover" />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-electric-blue/10 text-sm font-bold text-electric-blue">
                      {product.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-white">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.team}</p>
                  </div>
                </div>
                <StatusBadge status={product.status} />
              </div>
              <div className="mt-3">
                <ProgressCell value={product.progress} />
              </div>
              <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{product.short_description}</p>
              <div className="mt-3 flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => router.push(`/admin/products/${product.id}/edit`)}>Edit</Button>
                <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300" onClick={() => setDeleteTarget({ id: product.id, name: product.name })}>Delete</Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <DeleteProductDialog
        productId={deleteTarget?.id || ""}
        productName={deleteTarget?.name || ""}
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onDeleted={onRefresh}
      />
    </>
  );
}
