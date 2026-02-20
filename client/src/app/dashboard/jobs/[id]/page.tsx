"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/lib/api";

interface Job {
  _id: string;
  title: string;
  description: string;
  jobRole?: string;
  jobType?: string;
  jobLevel?: string;
  minSalary?: number;
  maxSalary?: number;
  salaryType?: string;
  country?: string;
  city?: string;
  expirationDate?: string;
  createdAt: string;
  experienceLevel?: string;
  educationLevel?: string;
  fullyRemote?: boolean;
}

function fmt(dateStr?: string) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function OverviewItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[#4640DE]">{icon}</span>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="whitespace-nowrap text-sm font-semibold text-gray-900">{value}</p>
    </div>
  );
}

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    apiFetch<{ job: Job }>(`/api/jobs/${id}`)
      .then((data) => setJob(data.job))
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load job"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDeleteClick = () => setShowDeleteModal(true);

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    try {
      await apiFetch(`/api/jobs/${id}`, { method: "DELETE" });
      router.push("/dashboard/jobs");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete job");
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (loading) return <p className="text-sm text-gray-500">Loading…</p>;
  if (error) return <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>;
  if (!job) return null;

  const location = [job.city, job.country].filter(Boolean).join(", ") || "—";
  const salaryLabel =
    job.minSalary && job.maxSalary
      ? `$${job.minSalary.toLocaleString()} – $${job.maxSalary.toLocaleString()}`
      : job.minSalary
      ? `From $${job.minSalary.toLocaleString()}`
      : job.maxSalary
      ? `Up to $${job.maxSalary.toLocaleString()}`
      : "—";

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Job Details</h1>
        <div className="flex items-center gap-3">
          <button onClick={handleDeleteClick} disabled={deleting} title="Delete job" className="flex h-10 w-10 items-center justify-center rounded-lg border border-red-200 text-red-500 transition-colors hover:bg-red-50 disabled:opacity-50">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6M14 11v6" />
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
            </svg>
          </button>
          <Link
            href={`/dashboard/jobs/${job._id}/edit`}
            className="rounded-lg bg-[#4640DE] px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Edit Job
          </Link>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="flex gap-6">
        {/* Left */}
        <div className="min-w-0 flex-1">
          <h2 className="text-xl font-bold text-gray-900">{job.title}</h2>
          <p className="mt-3 text-sm leading-relaxed text-gray-600 whitespace-pre-wrap">{job.description}</p>
        </div>

        {/* Right */}
        <div className="min-w-[420px] flex-shrink-0 space-y-4">
          {/* Salary card */}
          <div className="rounded-xl border border-gray-200 p-5">
            <div className="flex items-stretch gap-0">
              <div className="flex flex-1 flex-col items-center justify-center text-center">
                <p className="text-sm text-gray-500">Salary (USD)</p>
                <p className="mt-1 whitespace-nowrap text-lg font-bold text-[#0BA02C]">{salaryLabel}</p>
                {job.salaryType && (
                  <p className="mt-0.5 text-xs text-gray-400">{job.salaryType} salary</p>
                )}
              </div>
              <div className="w-px shrink-0 bg-gray-200" />
              <div className="flex flex-1 flex-col items-center justify-center text-center">
                <div className="text-[#4640DE]">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                </div>
                <p className="mt-1 text-xs text-gray-400">Job Location</p>
                <p className="whitespace-nowrap text-sm font-semibold text-gray-900">{location}</p>
              </div>
            </div>
          </div>

          {/* Job Overview card */}
          <div className="rounded-xl border border-gray-200 p-5">
            <h3 className="mb-4 text-base font-bold text-gray-900">Job Overview</h3>
            <div className="grid grid-cols-3 gap-5">
              <OverviewItem
                label="Job Posted"
                value={fmt(job.createdAt)}
                icon={
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                }
              />
              <OverviewItem
                label="Job Expires on"
                value={fmt(job.expirationDate)}
                icon={
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                }
              />
              <OverviewItem
                label="Job Level"
                value={job.jobLevel || "—"}
                icon={
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 2 7 12 12 22 7 12 2" />
                    <polyline points="2 17 12 22 22 17" />
                    <polyline points="2 12 12 17 22 12" />
                  </svg>
                }
              />
              <OverviewItem
                label="Experience"
                value={job.experienceLevel || "—"}
                icon={
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                  </svg>
                }
              />
              <OverviewItem
                label="Education"
                value={job.educationLevel || "—"}
                icon={
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                    <path d="M6 12v5c3 3 9 3 12 0v-5" />
                  </svg>
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* Delete Job modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 pt-[58px]" onClick={() => !deleting && setShowDeleteModal(false)}>
          <div
            className="w-full max-w-[360px] rounded-2xl bg-white px-6 pb-6 pt-5 shadow-xl"
            style={{ fontFamily: "var(--font-poppins), Poppins, sans-serif" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold text-[#25324B]">Delete Job</h3>
            <p className="mt-1.5 text-sm text-gray-500">Are you sure you want to delete this job?</p>
            <hr className="mt-4 border-gray-200" />
            <div className="mt-5 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
                className="min-w-[110px] rounded-full border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="min-w-[110px] rounded-full bg-[#E8452E] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#d63d27] disabled:opacity-50"
              >
                {deleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
