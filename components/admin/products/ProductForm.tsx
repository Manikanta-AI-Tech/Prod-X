"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { createProduct, updateProduct, type Product, type ProductInput, type ProductStatus } from "@/lib/products";

interface ProductFormProps {
  product?: Product;
}

export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const isEditing = !!product;
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState(product?.cover_image ?? "");

  const [form, setForm] = useState<ProductInput>({
    name: product?.name ?? "",
    short_description: product?.short_description ?? "",
    team: product?.team ?? "",
    status: product?.status ?? "idea",
    progress: product?.progress ?? 0,
    github_url: product?.github_url ?? "",
    demo_url: product?.demo_url ?? "",
    cover_image: product?.cover_image ?? "",
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const errors: Record<string, string> = {};
    if (!form.name.trim()) errors.name = "Name is required";
    if (form.name.length > 120) errors.name = "Name must be 120 characters or less";
    if ((form.progress ?? 0) < 0 || (form.progress ?? 0) > 100) errors.progress = "Progress must be 0–100";
    if (form.github_url && !/^https?:\/\/.+/.test(form.github_url)) errors.github_url = "Must be a valid URL starting with http:// or https://";
    if (form.demo_url && !/^https?:\/\/.+/.test(form.demo_url)) errors.demo_url = "Must be a valid URL starting with http:// or https://";
    if (form.cover_image && !/^https?:\/\/.+/.test(form.cover_image)) errors.cover_image = "Must be a valid URL starting with http:// or https://";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    setError(null);

    try {
      if (isEditing) {
        await updateProduct(product.id, form);
      } else {
        await createProduct(form);
      }
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save product");
    } finally {
      setSaving(false);
    }
  }

  function handleChange(field: keyof ProductInput, value: string | number) {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Clear field error on change
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }

  function handleCoverImageChange(url: string) {
    handleChange("cover_image", url);
    setPreviewUrl(url);
  }

  const inputClass = (field: string) =>
    `w-full rounded-xl border bg-background px-4 py-2.5 text-sm text-white outline-none transition focus:border-electric-blue ${
      fieldErrors[field] ? "border-red-500" : "border-border"
    }`;

  const labelClass = "block text-sm font-medium text-muted-foreground mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Name */}
        <div className="md:col-span-2">
          <label className={labelClass}>Product Name *</label>
          <input
            className={inputClass("name")}
            placeholder="Enter product name"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
          {fieldErrors.name && <p className="mt-1 text-xs text-red-400">{fieldErrors.name}</p>}
        </div>

        {/* Short Description */}
        <div className="md:col-span-2">
          <label className={labelClass}>Short Description</label>
          <textarea
            className={`${inputClass("short_description")} min-h-[80px] resize-y`}
            placeholder="A brief description of the product"
            value={form.short_description ?? ""}
            onChange={(e) => handleChange("short_description", e.target.value)}
          />
        </div>

        {/* Team */}
        <div>
          <label className={labelClass}>Team</label>
          <input
            className={inputClass("team")}
            placeholder="Team name"
            value={form.team ?? ""}
            onChange={(e) => handleChange("team", e.target.value)}
          />
        </div>

        {/* Status */}
        <div>
          <label className={labelClass}>Status</label>
          <select
            className={inputClass("status")}
            value={form.status}
            onChange={(e) => handleChange("status", e.target.value as ProductStatus)}
          >
            <option value="idea">Idea</option>
            <option value="building">Building</option>
            <option value="testing">Testing</option>
            <option value="live">Live</option>
          </select>
        </div>

        {/* Progress */}
        <div>
          <label className={labelClass}>Progress (0–100)</label>
          <input
            type="number"
            min={0}
            max={100}
            className={inputClass("progress")}
            value={form.progress}
            onChange={(e) => handleChange("progress", Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
          />
          {fieldErrors.progress && <p className="mt-1 text-xs text-red-400">{fieldErrors.progress}</p>}
        </div>

        {/* GitHub URL */}
        <div>
          <label className={labelClass}>GitHub URL</label>
          <input
            className={inputClass("github_url")}
            placeholder="https://github.com/..."
            value={form.github_url ?? ""}
            onChange={(e) => handleChange("github_url", e.target.value)}
          />
          {fieldErrors.github_url && <p className="mt-1 text-xs text-red-400">{fieldErrors.github_url}</p>}
        </div>

        {/* Demo URL */}
        <div>
          <label className={labelClass}>Demo URL</label>
          <input
            className={inputClass("demo_url")}
            placeholder="https://demo.example.com"
            value={form.demo_url ?? ""}
            onChange={(e) => handleChange("demo_url", e.target.value)}
          />
          {fieldErrors.demo_url && <p className="mt-1 text-xs text-red-400">{fieldErrors.demo_url}</p>}
        </div>

        {/* Cover Image */}
        <div>
          <label className={labelClass}>Cover Image URL</label>
          <input
            className={inputClass("cover_image")}
            placeholder="https://example.com/image.png"
            value={form.cover_image ?? ""}
            onChange={(e) => handleCoverImageChange(e.target.value)}
          />
          {fieldErrors.cover_image && <p className="mt-1 text-xs text-red-400">{fieldErrors.cover_image}</p>}
          {previewUrl && (
            <div className="mt-2 overflow-hidden rounded-lg border border-border">
              <img
                src={previewUrl}
                alt="Cover preview"
                className="h-24 w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 pt-4">
        <Button type="submit" variant="premium" disabled={saving}>
          {saving ? "Saving..." : isEditing ? "Update Product" : "Create Product"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/products")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}