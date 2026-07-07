"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { deleteProduct, type Product } from "@/lib/products";

interface DeleteProductDialogProps {
  product: Product | null;
  onClose: () => void;
  onDeleted: (id: string) => void;
}

export function DeleteProductDialog({
  product,
  onClose,
  onDeleted,
}: DeleteProductDialogProps) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!product) return null;
  const productId = product.id;

  async function handleDelete() {
    setDeleting(true);
    setError(null);
    try {
      await deleteProduct(productId);
      onDeleted(productId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete product");
      setDeleting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Dialog */}
      <div className="relative w-full max-w-md rounded-2xl border border-border/40 bg-card p-6 shadow-2xl">
        <h3 className="text-lg font-semibold text-white">Delete Product</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Are you sure you want to delete <strong className="text-white">{product.name}</strong>?
          This action cannot be undone.
        </p>

        {error && (
          <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="mt-6 flex items-center justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={deleting}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? "Deleting..." : "Delete Product"}
          </Button>
        </div>
      </div>
    </div>
  );
}