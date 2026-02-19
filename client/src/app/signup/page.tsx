"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import AuthLogo from "@/components/auth/AuthLogo";
import EyeToggle from "@/components/auth/EyeToggle";
import AuthDivider from "@/components/auth/AuthDivider";
import SocialButtons from "@/components/auth/SocialButtons";
import AuthRightPanel from "@/components/auth/AuthRightPanel";

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!fullName.trim()) { setError("Full name is required"); return; }
    if (!username.trim()) { setError("Username is required"); return; }
    if (!email.trim()) { setError("Email is required"); return; }
    if (!password) { setError("Password is required"); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters"); return; }
    if (password !== confirmPassword) { setError("Passwords do not match"); return; }
    setLoading(true);
    try {
      await signup({ fullName, username, email, password });
      router.push("/login?registered=1");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "mt-1.5 w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-[#4640DE] focus:outline-none focus:ring-1 focus:ring-[#4640DE]";

  return (
    <div className="flex min-h-screen bg-white">
      {/* ── Left panel ── */}
      <div className="flex w-full flex-col justify-center bg-white px-10 py-12 md:w-1/2 lg:px-16">
        <AuthLogo />

        {/* Heading */}
        <div className="mt-10">
          <h1
            className="text-[32px] font-medium leading-[100%] tracking-normal text-gray-900"
            style={{ fontFamily: "var(--font-poppins), sans-serif" }}
          >
            Welcome to JobPilot
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-gray-900 underline hover:text-[#4640DE]">
              Log in
            </Link>
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {error && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          {/* Full Name + Username — side by side */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                autoComplete="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative mt-1.5">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-4 py-2.5 pr-10 text-sm text-gray-900 placeholder-gray-400 focus:border-[#4640DE] focus:outline-none focus:ring-1 focus:ring-[#4640DE]"
              />
              <EyeToggle show={showPassword} onToggle={() => setShowPassword(!showPassword)} />
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <div className="relative mt-1.5">
              <input
                id="confirmPassword"
                type={showConfirm ? "text" : "password"}
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-4 py-2.5 pr-10 text-sm text-gray-900 placeholder-gray-400 focus:border-[#4640DE] focus:outline-none focus:ring-1 focus:ring-[#4640DE]"
              />
              <EyeToggle show={showConfirm} onToggle={() => setShowConfirm(!showConfirm)} />
            </div>
          </div>

          {/* Terms */}
          <p className="text-sm text-gray-500">
            By creating an account, you agree to the{" "}
            <Link href="/terms" className="underline text-gray-700 hover:text-[#4640DE]">
              Terms of use
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline text-gray-700 hover:text-[#4640DE]">
              Privacy Policy.
            </Link>
          </p>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#4640DE] py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Creating account…" : "Sign Up"}
          </button>
        </form>

        <AuthDivider />
        <SocialButtons action="signup" />
      </div>

      {/* ── Right panel ── */}
      <AuthRightPanel />
    </div>
  );
}
