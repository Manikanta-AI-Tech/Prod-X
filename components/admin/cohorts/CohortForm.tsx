"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import {
  createCohort,
  updateCohort,
  type Cohort,
  type CohortInput,
  type CohortStatus,
} from "@/lib/cohorts";

interface CohortFormProps {
  cohort?: Cohort;
}

export function CohortForm({ cohort }: CohortFormProps) {
  const router = useRouter();
  const isEditing = !!cohort;
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<CohortInput>({
    name: cohort?.name ?? "",
    batch_year: cohort?.batch_year ?? new Date().getFullYear(),
    description: cohort?.description ?? "",
    start_date: cohort?.start_date ?? "",
    end_date: cohort?.end_date ?? "",
    status: cohort?.status ?? "upcoming",
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const errors: Record<string, string> = {};
    if (!form.name.trim()) errors.name = "Name is required";
    if (form.name.length > 120) errors.name = "Name must be 120 characters or less";
    if (!form.batch_year) errors.batch_year = "Batch year is required";
    if (!form.start_date) errors.start_date = "Start date is required";
    if (!form.end_date) errors.end_date = "End date is required";
    if (form.start_date && form.end_date && form.start_date > form.end_date) {
      errors.end_date = "End date must be after start date";
    }
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
      await updateCohort(cohort.id, form);
    } else {
      await createCohort(form);
    }

    router.push("/admin/cohorts");
    router.refresh();

  } catch (err: any) {
    console.error("CREATE COHORT ERROR:", err);

    setError(
      JSON.stringify(err, null, 2) ||
      err?.message ||
      "Failed to save cohort"
    );
  } finally {
    setSaving(false);
  }
}

  function handleChange(
    field: keyof CohortInput,
    value: string | number
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
        {/* Name */}
        <div className="md:col-span-2">
          <label className={labelClass}>Cohort Name *</label>
          <input
            className={inputClass("name")}
            placeholder="e.g. Prod[X] Cohort 2026"
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
            placeholder="A brief description of the cohort"
            value={form.description ?? ""}
            onChange={(e) => handleChange("description", e.target.value)}
          />
        </div>

        {/* Batch Year */}
        <div>
          <label className={labelClass}>Batch Year *</label>
          <input
            type="number"
            min={2020}
            max={2030}
            className={inputClass("batch_year")}
            value={form.batch_year}
            onChange={(e) =>
              handleChange("batch_year", parseInt(e.target.value) || 2026)
            }
          />
          {fieldErrors.batch_year && (
            <p className="mt-1 text-xs text-red-400">
              {fieldErrors.batch_year}
            </p>
          )}
        </div>

        {/* Status */}
        <div>
          <label className={labelClass}>Status</label>
          <select
            className={inputClass("status")}
            value={form.status}
            onChange={(e) =>
              handleChange("status", e.target.value as CohortStatus)
            }
          >
            <option value="upcoming">Upcoming</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Start Date */}
        <div>
          <label className={labelClass}>Start Date *</label>
          <input
            type="date"
            className={inputClass("start_date")}
            value={form.start_date}
            onChange={(e) => handleChange("start_date", e.target.value)}
          />
          {fieldErrors.start_date && (
            <p className="mt-1 text-xs text-red-400">
              {fieldErrors.start_date}
            </p>
          )}
        </div>

        {/* End Date */}
        <div>
          <label className={labelClass}>End Date *</label>
          <input
            type="date"
            className={inputClass("end_date")}
            value={form.end_date}
            onChange={(e) => handleChange("end_date", e.target.value)}
          />
          {fieldErrors.end_date && (
            <p className="mt-1 text-xs text-red-400">
              {fieldErrors.end_date}
            </p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 pt-4">
        <Button type="submit" variant="premium" disabled={saving}>
          {saving ? "Saving..." : isEditing ? "Update Cohort" : "Create Cohort"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/cohorts")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}