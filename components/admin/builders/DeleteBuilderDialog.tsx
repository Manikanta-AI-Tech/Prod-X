"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { deleteBuilder, type Builder } from "@/lib/builders";

interface DeleteBuilderDialogProps {
  builder: Builder | null;
  onClose: () => void;
  onDeleted: (id: string) => void;
}

export function DeleteBuilderDialog({
  builder,
  onClose,
  onDeleted,
}: DeleteBuilderDialogProps) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!builder) return null;
  const builderId = builder.id;

  async function handleDelete() {
    setDeleting(true);
    setError(null);
    try {
      await deleteBuilder(builderId);
      onDeleted(builderId);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete builder"
      );
      setDeleting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md rounded-2xl border border-border/40 bg-card p-6 shadow-2xl">
        <h3 className="text-lg font-semibold text-white">Delete Builder</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Are you sure you want to delete{" "}
          <strong className="text-white">{builder.full_name}</strong>? This
          action cannot be undone.
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
            {deleting ? "Deleting..." : "Delete Builder"}
          </Button>
        </div>
      </div>
    </div>
  );
}