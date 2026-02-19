"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import AuthLogo from "@/components/auth/AuthLogo";
import EyeToggle from "@/components/auth/EyeToggle";
import AuthDivider from "@/components/auth/AuthDivider";
import SocialButtons from "@/components/auth/SocialButtons";
import AuthRightPanel from "@/components/auth/AuthRightPanel";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const registered = searchParams.get("registered") === "1";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim()) { setError("Email is required"); return; }
    if (!password) { setError("Password is required"); return; }
    setLoading(true);
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* ── Left panel ── */}
      <div className="flex w-full flex-col justify-center bg-white px-10 py-12 md:w-1/2 lg:px-16">
        <AuthLogo />

        {/* Heading */}
        <div className="mt-14">
          <h1
            className="text-[32px] font-medium leading-[100%] tracking-normal align-middle"
            style={{ fontFamily: "var(--font-poppins), sans-serif", color: "#434348" }}
          >
            Log In to{" "}
            <span className="relative inline-block align-middle">
              JobPilot
              <span
                className="absolute -bottom-1 left-0 h-[6px] w-full rounded-sm"
                style={{ background: "#FFB836", zIndex: -1 }}
              />
            </span>
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-semibold text-[#4640DE] hover:underline">
              Sign Up
            </Link>
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {registered && (
            <p className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
              Account created. Please log in.
            </p>
          )}
          {error && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Username or Email Address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-[#4640DE] focus:outline-none focus:ring-1 focus:ring-[#4640DE]"
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
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-4 py-2.5 pr-10 text-sm text-gray-900 placeholder-gray-400 focus:border-[#4640DE] focus:outline-none focus:ring-1 focus:ring-[#4640DE]"
              />
              <EyeToggle show={showPassword} onToggle={() => setShowPassword(!showPassword)} />
            </div>
            <div className="mt-1.5 flex justify-end">
              <Link href="/forgot-password" className="text-xs text-gray-500 underline hover:text-gray-700">
                Forget your password
              </Link>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#4640DE] py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Log In"}
          </button>
        </form>

        <AuthDivider />
        <SocialButtons action="login" />
      </div>

      {/* ── Right panel ── */}
      <AuthRightPanel />
    </div>
  );
}
