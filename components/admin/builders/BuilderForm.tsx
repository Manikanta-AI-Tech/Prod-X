"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import {
  createBuilder,
  updateBuilder,
  getCohortOptions,
  getTeamOptions,
  type Builder,
  type BuilderInput,
  type BuilderStatus,
} from "@/lib/builders";

interface BuilderFormProps {
  builder?: Builder;
}

export function BuilderForm({ builder }: BuilderFormProps) {
  const router = useRouter();
  const isEditing = !!builder;
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cohortOptions = getCohortOptions();
  const teamOptions = getTeamOptions();

  const [form, setForm] = useState<BuilderInput>({
    full_name: builder?.full_name ?? "",
    email: builder?.email ?? "",
    cohort: builder?.cohort ?? cohortOptions[0] ?? "",
    team: builder?.team ?? teamOptions[0] ?? "",
    product: builder?.product ?? "",
    role: builder?.role ?? "",
    progress: builder?.progress ?? 0,
    status: builder?.status ?? "active",
    avatar_url: builder?.avatar_url ?? null,
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const errors: Record<string, string> = {};
    if (!form.full_name.trim()) errors.full_name = "Name is required";
    if (form.full_name.length > 120)
      errors.full_name = "Name must be 120 characters or less";
    if (!form.email.trim()) errors.email = "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errors.email = "Invalid email format";
    if (!form.cohort) errors.cohort = "Cohort is required";
    if (!form.team) errors.team = "Team is required";
    if (!form.role.trim()) errors.role = "Role is required";
    if ((form.progress ?? 0) < 0 || (form.progress ?? 0) > 100)
      errors.progress = "Progress must be 0–100";
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
        await updateBuilder(builder.id, form);
      } else {
        await createBuilder(form);
      }
      router.push("/admin/builders");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save builder"
      );
    } finally {
      setSaving(false);
    }
  }

  function handleChange(
    field: keyof BuilderInput,
    value: string | number | null
  ) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
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
        {/* Full Name */}
        <div>
          <label className={labelClass}>Full Name *</label>
          <input
            className={inputClass("full_name")}
            placeholder="Enter builder name"
            value={form.full_name}
            onChange={(e) => handleChange("full_name", e.target.value)}
          />
          {fieldErrors.full_name && (
            <p className="mt-1 text-xs text-red-400">
              {fieldErrors.full_name}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className={labelClass}>Email *</label>
          <input
            className={inputClass("email")}
            placeholder="builder@example.com"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />
          {fieldErrors.email && (
            <p className="mt-1 text-xs text-red-400">{fieldErrors.email}</p>
          )}
        </div>

        {/* Cohort */}
        <div>
          <label className={labelClass}>Cohort *</label>
          <select
            className={inputClass("cohort")}
            value={form.cohort}
            onChange={(e) => handleChange("cohort", e.target.value)}
          >
            <option value="">Select cohort</option>
            {cohortOptions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {fieldErrors.cohort && (
            <p className="mt-1 text-xs text-red-400">{fieldErrors.cohort}</p>
          )}
        </div>

        {/* Team */}
        <div>
          <label className={labelClass}>Team *</label>
          <select
            className={inputClass("team")}
            value={form.team}
            onChange={(e) => handleChange("team", e.target.value)}
          >
            <option value="">Select team</option>
            {teamOptions.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          {fieldErrors.team && (
            <p className="mt-1 text-xs text-red-400">{fieldErrors.team}</p>
          )}
        </div>

        {/* Product */}
        <div>
          <label className={labelClass}>Product</label>
          <input
            className={inputClass("product")}
            placeholder="Product name"
            value={form.product}
            onChange={(e) => handleChange("product", e.target.value)}
          />
        </div>

        {/* Role */}
        <div>
          <label className={labelClass}>Role *</label>
          <input
            className={inputClass("role")}
            placeholder="e.g. Fullstack Engineer"
            value={form.role}
            onChange={(e) => handleChange("role", e.target.value)}
          />
          {fieldErrors.role && (
            <p className="mt-1 text-xs text-red-400">{fieldErrors.role}</p>
          )}
        </div>

        {/* Status */}
        <div>
          <label className={labelClass}>Status</label>
          <select
            className={inputClass("status")}
            value={form.status}
            onChange={(e) =>
              handleChange("status", e.target.value as BuilderStatus)
            }
          >
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="paused">Paused</option>
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
            onChange={(e) =>
              handleChange(
                "progress",
                Math.min(100, Math.max(0, parseInt(e.target.value) || 0))
              )
            }
          />
          {fieldErrors.progress && (
            <p className="mt-1 text-xs text-red-400">
              {fieldErrors.progress}
            </p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 pt-4">
        <Button type="submit" variant="premium" disabled={saving}>
          {saving
            ? "Saving..."
            : isEditing
              ? "Update Builder"
              : "Create Builder"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/builders")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}