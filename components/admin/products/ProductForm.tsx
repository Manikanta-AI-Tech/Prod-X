"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import type { Product, ProductInput, ProductStatus } from "@/lib/products";
import { createProduct, updateProduct } from "@/lib/products";

interface Props {
  product?: Product | null;
}

interface FormErrors {
  name?: string;
  short_description?: string;
  team?: string;
  progress?: string;
  github_url?: string;
  demo_url?: string;
  cover_image?: string;
}

export function ProductForm({ product }: Props) {
  const router = useRouter();
  const isEditing = !!product;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: product?.name || "",
    short_description: product?.short_description || "",
    team: product?.team || "",
    progress: product?.progress ?? 50,
    github_url: product?.github_url || "",
    demo_url: product?.demo_url || "",
    cover_image: product?.cover_image || "",
    status: (product?.status || "draft") as ProductStatus,
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const validate = (): boolean => {
    const errors: FormErrors = {};
    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.short_description.trim()) errors.short_description = "Description is required";
    if (!formData.team.trim()) errors.team = "Team is required";
    if (formData.progress < 0 || formData.progress > 100) errors.progress = "Progress must be 0–100";
    if (formData.progress === undefined || formData.progress === null) errors.progress = "Progress is required";
    if (formData.github_url && !/^https?:\/\/.+/.test(formData.github_url)) errors.github_url = "Must be a valid URL (https://...)";
    if (formData.demo_url && !/^https?:\/\/.+/.test(formData.demo_url)) errors.demo_url = "Must be a valid URL (https://...)";
    if (formData.cover_image && !/^https?:\/\/.+/.test(formData.cover_image)) errors.cover_image = "Must be a valid URL (https://...)";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setError("");

    try {
      const input: ProductInput = {
        name: formData.name.trim(),
        short_description: formData.short_description.trim(),
        team: formData.team.trim(),
        progress: formData.progress,
        github_url: formData.github_url.trim() || undefined,
        demo_url: formData.demo_url.trim() || undefined,
        cover_image: formData.cover_image.trim() || undefined,
        status: formData.status,
      };

      if (isEditing && product) {
        await updateProduct(product.id, input);
      } else {
        await createProduct(input);
      }
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field as keyof FormErrors]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const inputClass = (field: keyof FormErrors) =>
    `w-full rounded-lg border ${
      formErrors[field] ? "border-red-500" : "border-border/40"
    } bg-black/30 px-3 py-2 text-sm text-white placeholder-muted-foreground focus:border-electric-blue focus:outline-none focus:ring-1 focus:ring-electric-blue/30 transition-colors`;

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-6">
      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <label className="text-sm font-medium text-white">Product Name *</label>
        <input
          className={inputClass("name")}
          placeholder="e.g. StellarFlow"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />
        {formErrors.name && <p className="text-xs text-red-400">{formErrors.name}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-white">Short Description *</label>
        <textarea
          className={`${inputClass("short_description")} min-h-[80px] resize-y`}
          placeholder="AI-powered workflow automation platform"
          value={formData.short_description}
          onChange={(e) => handleChange("short_description", e.target.value)}
        />
        {formErrors.short_description && <p className="text-xs text-red-400">{formErrors.short_description}</p>}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Team *</label>
          <input
            className={inputClass("team")}
            placeholder="e.g. Nebula"
            value={formData.team}
            onChange={(e) => handleChange("team", e.target.value)}
          />
          {formErrors.team && <p className="text-xs text-red-400">{formErrors.team}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Progress (0–100) *</label>
          <input
            type="number"
            min={0}
            max={100}
            className={inputClass("progress")}
            value={formData.progress}
            onChange={(e) => handleChange("progress", Number(e.target.value))}
          />
          {formErrors.progress && <p className="text-xs text-red-400">{formErrors.progress}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-white">GitHub URL</label>
          <input
            className={inputClass("github_url")}
            placeholder="https://github.com/..."
            value={formData.github_url}
            onChange={(e) => handleChange("github_url", e.target.value)}
          />
          {formErrors.github_url && <p className="text-xs text-red-400">{formErrors.github_url}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Demo URL</label>
          <input
            className={inputClass("demo_url")}
            placeholder="https://demo.example.com"
            value={formData.demo_url}
            onChange={(e) => handleChange("demo_url", e.target.value)}
          />
          {formErrors.demo_url && <p className="text-xs text-red-400">{formErrors.demo_url}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-white">Cover Image URL</label>
        <input
          className={inputClass("cover_image")}
          placeholder="https://images.unsplash.com/..."
          value={formData.cover_image}
          onChange={(e) => handleChange("cover_image", e.target.value)}
        />
        {formErrors.cover_image && <p className="text-xs text-red-400">{formErrors.cover_image}</p>}
        {formData.cover_image && (
          <div className="mt-2 overflow-hidden rounded-lg border border-border/40">
            <img
              src={formData.cover_image}
              alt="Cover preview"
              className="h-32 w-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-white">Status</label>
        <select
          className="w-full rounded-lg border border-border/40 bg-black/30 px-3 py-2 text-sm text-white focus:border-electric-blue focus:outline-none focus:ring-1 focus:ring-electric-blue/30 transition-colors"
          value={formData.status}
          onChange={(e) => handleChange("status", e.target.value)}
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>

      <div className="flex items-center gap-3 border-t border-border/40 pt-6">
        <Button type="submit" variant="default" disabled={loading}>
          {loading ? "Saving..." : isEditing ? "Update Product" : "Create Product"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push("/admin/products")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
