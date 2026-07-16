"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import {
  createMentor,
  updateMentor,
  getExpertiseOptions,
  type Mentor,
  type MentorInput,
  type MentorStatus,
} from "@/lib/mentors";

interface MentorFormProps {
  mentor?: Mentor;
}

export function MentorForm({ mentor }: MentorFormProps) {
  const router = useRouter();
  const isEditing = !!mentor;
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expertiseOptions, setExpertiseOptions] = useState<string[]>([]);
  const [optionsLoaded, setOptionsLoaded] = useState(false);

  useEffect(() => {
    getExpertiseOptions().then((opts) => {
      setExpertiseOptions(opts);
      setOptionsLoaded(true);
    });
  }, []);

  const [form, setForm] = useState<MentorInput>(() => ({
    name: mentor?.name ?? "",
    email: mentor?.email ?? "",
    company: mentor?.company ?? "",
    designation: mentor?.designation ?? "",
    expertise: mentor?.expertise ?? "",
    bio: mentor?.bio ?? "",
    linkedin_url: mentor?.linkedin_url ?? null,
    avatar_url: mentor?.avatar_url ?? null,
    status: mentor?.status ?? "active",
  }));

  // Set default expertise once options loaded
  useEffect(() => {
    if (optionsLoaded && !mentor && !form.expertise && expertiseOptions.length > 0) {
      setForm((prev) => ({ ...prev, expertise: expertiseOptions[0] }));
    }
  }, [optionsLoaded, mentor, expertiseOptions, form.expertise]);

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const errors: Record<string, string> = {};
    if (!form.name.trim()) errors.name = "Name is required";
    if (form.name.length > 120) errors.name = "Name must be 120 characters or less";
    if (!form.email.trim()) errors.email = "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = "Invalid email format";
    if (!form.company.trim()) errors.company = "Company is required";
    if (!form.designation.trim()) errors.designation = "Designation is required";
    if (!form.expertise) errors.expertise = "Expertise is required";
    if (form.linkedin_url && !/^https?:\/\/.+/.test(form.linkedin_url)) errors.linkedin_url = "Must be a valid URL";
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
        await updateMentor(mentor.id, form);
      } else {
        await createMentor(form);
      }
      router.push("/admin/mentors");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save mentor");
    } finally {
      setSaving(false);
    }
  }

  function handleChange(field: keyof MentorInput, value: string | null) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });
    }
  }

  const inputClass = (field: string) =>
    `w-full rounded-xl border bg-background px-4 py-2.5 text-sm text-white outline-none transition focus:border-electric-blue ${fieldErrors[field] ? "border-red-500" : "border-border"}`;

  const labelClass = "block text-sm font-medium text-muted-foreground mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className={labelClass}>Full Name *</label>
          <input className={inputClass("name")} placeholder="Mentor name" value={form.name} onChange={(e) => handleChange("name", e.target.value)} />
          {fieldErrors.name && <p className="mt-1 text-xs text-red-400">{fieldErrors.name}</p>}
        </div>
        <div>
          <label className={labelClass}>Email *</label>
          <input className={inputClass("email")} placeholder="mentor@example.com" value={form.email} onChange={(e) => handleChange("email", e.target.value)} />
          {fieldErrors.email && <p className="mt-1 text-xs text-red-400">{fieldErrors.email}</p>}
        </div>

        <div>
          <label className={labelClass}>Company *</label>
          <input className={inputClass("company")} placeholder="Company name" value={form.company} onChange={(e) => handleChange("company", e.target.value)} />
          {fieldErrors.company && <p className="mt-1 text-xs text-red-400">{fieldErrors.company}</p>}
        </div>
        <div>
          <label className={labelClass}>Designation *</label>
          <input className={inputClass("designation")} placeholder="e.g. Lead Mentor" value={form.designation} onChange={(e) => handleChange("designation", e.target.value)} />
          {fieldErrors.designation && <p className="mt-1 text-xs text-red-400">{fieldErrors.designation}</p>}
        </div>

        <div>
          <label className={labelClass}>Expertise *</label>
          <select className={inputClass("expertise")} value={form.expertise} onChange={(e) => handleChange("expertise", e.target.value)}>
            <option value="">Select expertise</option>
            {expertiseOptions.map((e) => (<option key={e} value={e}>{e}</option>))}
          </select>
          {fieldErrors.expertise && <p className="mt-1 text-xs text-red-400">{fieldErrors.expertise}</p>}
        </div>
        <div>
          <label className={labelClass}>Status</label>
          <select className={inputClass("status")} value={form.status} onChange={(e) => handleChange("status", e.target.value as MentorStatus)}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className={labelClass}>Bio *</label>
          <textarea className={`${inputClass("bio")} min-h-[100px] resize-y`} placeholder="Mentor biography..." value={form.bio} onChange={(e) => handleChange("bio", e.target.value)} />
        </div>

        <div>
          <label className={labelClass}>LinkedIn URL</label>
          <input className={inputClass("linkedin_url")} placeholder="https://linkedin.com/in/..." value={form.linkedin_url ?? ""} onChange={(e) => handleChange("linkedin_url", e.target.value || null)} />
          {fieldErrors.linkedin_url && <p className="mt-1 text-xs text-red-400">{fieldErrors.linkedin_url}</p>}
        </div>
        <div>
          <label className={labelClass}>Avatar URL</label>
          <input className={inputClass("avatar_url")} placeholder="https://example.com/avatar.png" value={form.avatar_url ?? ""} onChange={(e) => handleChange("avatar_url", e.target.value || null)} />
        </div>
      </div>

      <div className="flex items-center gap-4 pt-4">
        <Button type="submit" variant="premium" disabled={saving}>
          {saving ? "Saving..." : isEditing ? "Update Mentor" : "Create Mentor"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/mentors")}>Cancel</Button>
      </div>
    </form>
  );
}