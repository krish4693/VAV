"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import {
  inputClass, labelClass, emptyForm,
  JOB_ROLES, SALARY_TYPES, EDUCATION, EXPERIENCE, JOB_TYPES, JOB_LEVELS, COUNTRIES, CITIES,
  SectionHeading, SelectField, DateField,
  type JobFormData,
} from "@/components/dashboard/JobFormFields";

interface JobResponse {
  _id: string;
  title: string;
  tags?: string[];
  jobRole?: string;
  minSalary?: number;
  maxSalary?: number;
  salaryType?: string;
  educationLevel?: string;
  experienceLevel?: string;
  jobType?: string;
  jobLevel?: string;
  expirationDate?: string;
  country?: string;
  city?: string;
  fullyRemote?: boolean;
  description: string;
}

function toInputDate(dateStr?: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function toFormData(job: JobResponse): JobFormData {
  return {
    title: job.title ?? "",
    tags: job.tags?.join(", ") ?? "",
    jobRole: job.jobRole ?? "",
    minSalary: job.minSalary != null ? String(job.minSalary) : "",
    maxSalary: job.maxSalary != null ? String(job.maxSalary) : "",
    salaryType: job.salaryType ?? "",
    educationLevel: job.educationLevel ?? "",
    experienceLevel: job.experienceLevel ?? "",
    jobType: job.jobType ?? "",
    jobLevel: job.jobLevel ?? "",
    expirationDate: toInputDate(job.expirationDate),
    country: job.country ?? "",
    city: job.city ?? "",
    fullyRemote: job.fullyRemote ?? false,
    description: job.description ?? "",
  };
}

export default function EditJobPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [form, setForm] = useState<JobFormData>(emptyForm);
  const [fetching, setFetching] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch<{ job: JobResponse }>(`/api/jobs/${id}`)
      .then((data) => setForm(toFormData(data.job)))
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load job"))
      .finally(() => setFetching(false));
  }, [id]);

  const update = (key: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError("");
  };

  const handleSave = async () => {
    setError("");
    if (!form.title.trim()) { setError("Job title is required"); return; }
    if (!form.jobRole) { setError("Job role is required"); return; }
    if (!form.description.trim()) { setError("Job description is required"); return; }

    setSaving(true);
    try {
      await apiFetch(`/api/jobs/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          title: form.title.trim(),
          tags: form.tags.trim() ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
          jobRole: form.jobRole,
          minSalary: form.minSalary ? Number(form.minSalary) : undefined,
          maxSalary: form.maxSalary ? Number(form.maxSalary) : undefined,
          salaryType: form.salaryType || undefined,
          educationLevel: form.educationLevel || undefined,
          experienceLevel: form.experienceLevel || undefined,
          jobType: form.jobType || undefined,
          jobLevel: form.jobLevel || undefined,
          expirationDate: form.expirationDate || undefined,
          country: form.country || undefined,
          city: form.city || undefined,
          fullyRemote: form.fullyRemote,
          description: form.description.trim(),
        }),
      });
      router.push(`/dashboard/jobs/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update job");
    } finally {
      setSaving(false);
    }
  };

  if (fetching) return <p className="text-sm text-gray-500">Loading…</p>;

  return (
    <div className="max-w-5xl">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Edit Job Details</h1>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="rounded-md bg-[#4640DE] px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save"}
        </button>
      </div>

      {error && (
        <p className="mb-6 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
      )}

      <div className="space-y-8">
        <div className="grid grid-cols-3 gap-5">
          <div>
            <label htmlFor="jobTitle" className={labelClass}>Job Title</label>
            <input id="jobTitle" type="text" className={inputClass} value={form.title} onChange={(e) => update("title", e.target.value)} />
          </div>
          <div>
            <label htmlFor="tags" className={labelClass}>Tags</label>
            <input id="tags" type="text" className={inputClass} placeholder="e.g. React, Node" value={form.tags} onChange={(e) => update("tags", e.target.value)} />
          </div>
          <SelectField label="Job Role" id="jobRole" options={JOB_ROLES} value={form.jobRole} onChange={(v) => update("jobRole", v)} />
        </div>

        <div>
          <SectionHeading>Salary</SectionHeading>
          <div className="grid grid-cols-3 gap-5">
            <div>
              <label htmlFor="minSalary" className={labelClass}>Min Salary</label>
              <div className="flex overflow-hidden rounded-md border border-gray-300 focus-within:border-[#4640DE] focus-within:ring-1 focus-within:ring-[#4640DE]">
                <input id="minSalary" type="number" className="flex-1 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder-gray-300 focus:outline-none" value={form.minSalary} onChange={(e) => update("minSalary", e.target.value)} />
                <span className="flex items-center border-l border-gray-300 bg-gray-100 px-3 py-2.5 text-sm font-medium text-gray-500">USD</span>
              </div>
            </div>
            <div>
              <label htmlFor="maxSalary" className={labelClass}>Max Salary</label>
              <div className="flex overflow-hidden rounded-md border border-gray-300 focus-within:border-[#4640DE] focus-within:ring-1 focus-within:ring-[#4640DE]">
                <input id="maxSalary" type="number" className="flex-1 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder-gray-300 focus:outline-none" value={form.maxSalary} onChange={(e) => update("maxSalary", e.target.value)} />
                <span className="flex items-center border-l border-gray-300 bg-gray-100 px-3 py-2.5 text-sm font-medium text-gray-500">USD</span>
              </div>
            </div>
            <SelectField label="Salary Type" id="salaryType" options={SALARY_TYPES} value={form.salaryType} onChange={(v) => update("salaryType", v)} />
          </div>
        </div>

        <div>
          <SectionHeading>Advance Information</SectionHeading>
          <div className="grid grid-cols-3 gap-5">
            <SelectField label="Education Level" id="education" options={EDUCATION} value={form.educationLevel} onChange={(v) => update("educationLevel", v)} />
            <SelectField label="Experience Level" id="experience" options={EXPERIENCE} value={form.experienceLevel} onChange={(v) => update("experienceLevel", v)} />
            <SelectField label="Job Type" id="jobType" options={JOB_TYPES} value={form.jobType} onChange={(v) => update("jobType", v)} />
          </div>
          <div className="mt-5 grid grid-cols-3 gap-5">
            <SelectField label="Job Level" id="jobLevel" options={JOB_LEVELS} value={form.jobLevel} onChange={(v) => update("jobLevel", v)} />
            <DateField label="Expiration Date" id="expirationDate" value={form.expirationDate} onChange={(v) => update("expirationDate", v)} />
          </div>
        </div>

        <div>
          <SectionHeading>Location</SectionHeading>
          <div className="grid grid-cols-2 gap-5">
            <SelectField label="Country" id="country" options={COUNTRIES} value={form.country} onChange={(v) => update("country", v)} />
            <SelectField label="City" id="city" options={CITIES} value={form.city} onChange={(v) => update("city", v)} />
          </div>
          <label className="mt-4 flex cursor-pointer items-center gap-2.5 text-sm text-gray-600">
            <input type="checkbox" checked={form.fullyRemote} onChange={(e) => update("fullyRemote", e.target.checked)} className="h-4 w-4 rounded border-gray-300 accent-[#4640DE]" />
            Fully remote position
          </label>
        </div>

        <div>
          <SectionHeading>Job Descriptions</SectionHeading>
          <textarea id="description" rows={6} className="w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder-gray-300 focus:border-[#4640DE] focus:outline-none focus:ring-1 focus:ring-[#4640DE] resize-none" placeholder="Add job description" value={form.description} onChange={(e) => update("description", e.target.value)} />
        </div>
      </div>
    </div>
  );
}
