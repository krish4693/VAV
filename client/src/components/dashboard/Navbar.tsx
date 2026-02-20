import Link from "next/link";
import AuthLogo from "@/components/auth/AuthLogo";

export default function DashboardNavbar() {
  return (
    <header className="flex h-[82px] flex-shrink-0 items-center justify-between border-b border-gray-200 bg-white px-8">
      <AuthLogo />
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/post-job"
          className="rounded-full border border-[#4640DE] px-5 py-2 text-sm font-medium text-[#4640DE] transition-colors hover:bg-[#4640DE] hover:text-white"
        >
          Post a Job
        </Link>
        {/* Avatar placeholder */}
        <div className="h-10 w-10 rounded-full bg-[#E05C9B]" />
      </div>
    </header>
  );
}
