"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

interface Job {
  _id: string;
  title: string;
  jobType?: string;
  expirationDate?: string;
  createdAt: string;
}

function getStatus(expirationDate?: string): "Active" | "Expired" {
  if (!expirationDate) return "Active";
  return new Date(expirationDate) > new Date() ? "Active" : "Expired";
}

function getRemaining(expirationDate?: string): string {
  if (!expirationDate) return "No expiry";
  const diff = Math.ceil((new Date(expirationDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  if (diff <= 0) {
    return new Date(expirationDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  }
  return `${diff} days remaining`;
}

function StatusBadge({ status }: { status: string }) {
  if (status === "Active") {
    return (
      <span className="flex items-center gap-1.5 text-sm font-medium text-green-600">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="9 12 11 14 15 10" />
        </svg>
        Active
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1.5 text-sm font-medium text-orange-500">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      Expired
    </span>
  );
}

function ApplicationsCell({ count }: { count: number }) {
  return (
    <span className="flex items-center gap-1.5 text-sm text-gray-600">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
      {count} Applications
    </span>
  );
}

export default function MyJobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch<{ jobs: Job[] }>("/api/jobs")
      .then((data) => setJobs(data.jobs))
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load jobs"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">My Jobs</h1>

      {error && (
        <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
      )}

      {loading && <p className="text-sm text-gray-500">Loading…</p>}

      {!loading && !error && jobs.length === 0 && (
        <p className="rounded-md border border-gray-200 bg-gray-50 px-4 py-8 text-center text-gray-500">
          No jobs yet.{" "}
          <Link href="/dashboard/post-job" className="font-medium text-[#4640DE] hover:underline">
            Post your first job
          </Link>
        </p>
      )}

      {!loading && jobs.length > 0 && (
        <div className="overflow-hidden rounded-lg border border-gray-200">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-5 py-3.5 text-xs font-medium text-gray-500">Jobs</th>
                <th className="px-5 py-3.5 text-xs font-medium text-gray-500">Status</th>
                <th className="px-5 py-3.5 text-xs font-medium text-gray-500">Applications</th>
                <th className="px-5 py-3.5 text-xs font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => {
                const status = getStatus(job.expirationDate);
                const remaining = getRemaining(job.expirationDate);
                return (
                  <tr key={job._id} className="border-b border-gray-100">
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-gray-900">{job.title}</p>
                      <p className="mt-0.5 text-xs text-gray-400">
                        {job.jobType || "—"} &nbsp;•&nbsp; {remaining}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={status} />
                    </td>
                    <td className="px-5 py-4">
                      <ApplicationsCell count={0} />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => router.push(`/dashboard/jobs/${job._id}`)}
                          className="rounded-full bg-[#EBEBFF] px-4 py-1.5 text-sm font-medium text-[#4640DE] transition-colors hover:bg-[#dcdcff]"
                        >
                          View Job
                        </button>
                        <button className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <circle cx="12" cy="5" r="1.5" />
                            <circle cx="12" cy="12" r="1.5" />
                            <circle cx="12" cy="19" r="1.5" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
