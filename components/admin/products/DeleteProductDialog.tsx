"use client";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { deleteProduct } from "@/lib/products";

interface Props {
  productId: string;
  productName: string;
  open: boolean;
  onClose: () => void;
  onDeleted: () => void;
}

export function DeleteProductDialog({ productId, productName, open, onClose, onDeleted }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const handleDelete = async () => {
    setLoading(true);
    setError("");
    try {
      await deleteProduct(productId);
      onDeleted();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-md rounded-xl border border-border/40 bg-card p-6 shadow-2xl">
        <h3 className="text-lg font-semibold text-white">Delete Product</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Are you sure you want to delete <span className="font-medium text-white">&ldquo;{productName}&rdquo;</span>?
          This action cannot be undone.
        </p>
        {error && (
          <p className="mt-3 text-sm text-red-400">{error}</p>
        )}
        <div className="mt-6 flex items-center justify-end gap-3">
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>
    </div>
  );
}
