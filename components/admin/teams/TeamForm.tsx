"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import {
  createTeam,
  updateTeam,
  listCohortOptions,
  listProductOptions,
  listMentorOptions,
  type Team,
  type TeamInput,
  type TeamStatus,
} from "@/lib/teams";

interface TeamFormProps {
  team?: Team;
}

export function TeamForm({ team }: TeamFormProps) {
  const router = useRouter();
  const isEditing = !!team;
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [cohorts, setCohorts] = useState<{ id: string; name: string }[]>([]);
  const [products, setProducts] = useState<{ id: string; name: string }[]>([]);
  const [mentors, setMentors] = useState<{ id: string; name: string }[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  const [form, setForm] = useState<TeamInput>({
    name: team?.name ?? "",
    cohort_id: team?.cohort_id ?? null,
    product_id: team?.product_id ?? null,
    mentor_id: team?.mentor_id ?? null,
    description: team?.description ?? "",
    progress: team?.progress ?? 0,
    status: team?.status ?? "active",
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    async function loadOptions() {
      try {
        const [cohortData, productData, mentorData] = await Promise.all([
          listCohortOptions(),
          listProductOptions(),
          listMentorOptions(),
        ]);
        setCohorts(cohortData);
        setProducts(productData);
        setMentors(mentorData);
      } catch {
        // Options are non-critical; form can still be submitted
      } finally {
        setLoadingOptions(false);
      }
    }
    loadOptions();
  }, []);

  function validate(): boolean {
    const errors: Record<string, string> = {};
    if (!form.name.trim()) errors.name = "Name is required";
    if (form.name.length > 120) errors.name = "Name must be 120 characters or less";
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
        await updateTeam(team.id, form);
      } else {
        await createTeam(form);
      }
      router.push("/admin/teams");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save team");
    } finally {
      setSaving(false);
    }
  }

  function handleChange(field: keyof TeamInput, value: string | number | null) {
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

  const selectClass = (field: string) =>
    `w-full rounded-xl border bg-background px-4 py-2.5 text-sm text-white outline-none transition focus:border-electric-blue ${
      fieldErrors[field] ? "border-red-500" : "border-border"
    }`;

  if (loadingOptions) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-electric-blue border-t-transparent" />
      </div>
    );
  }

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
          <label className={labelClass}>Team Name *</label>
          <input
            className={inputClass("name")}
            placeholder="e.g. Team Alpha"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
          {fieldErrors.name && (
            <p className="mt-1 text-xs text-red-400">{fieldErrors.name}</p>
          )}
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className={labelClass}>Description</label>
          <textarea
            className={`${inputClass("description")} min-h-[80px] resize-y`}
            placeholder="What is this team building?"
            value={form.description ?? ""}
            onChange={(e) => handleChange("description", e.target.value)}
          />
        </div>

        {/* Cohort */}
        <div>
          <label className={labelClass}>Cohort</label>
          <select
            className={selectClass("cohort_id")}
            value={form.cohort_id ?? ""}
            onChange={(e) =>
              handleChange("cohort_id", e.target.value || null)
            }
          >
            <option value="">No cohort</option>
            {cohorts.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Product */}
        <div>
          <label className={labelClass}>Product</label>
          <select
            className={selectClass("product_id")}
            value={form.product_id ?? ""}
            onChange={(e) =>
              handleChange("product_id", e.target.value || null)
            }
          >
            <option value="">No product</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Mentor */}
        <div>
          <label className={labelClass}>Mentor</label>
          <select
            className={selectClass("mentor_id")}
            value={form.mentor_id ?? ""}
            onChange={(e) =>
              handleChange("mentor_id", e.target.value || null)
            }
          >
            <option value="">No mentor</option>
            {mentors.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <label className={labelClass}>Status</label>
          <select
            className={selectClass("status")}
            value={form.status}
            onChange={(e) =>
              handleChange("status", e.target.value as TeamStatus)
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
          {saving ? "Saving..." : isEditing ? "Update Team" : "Create Team"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/teams")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}