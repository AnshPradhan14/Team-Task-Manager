"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Eye, EyeOff, UserPlus, Loader2, LayoutDashboard, Shield, User, ChevronDown } from "lucide-react";
import { signupUser } from "@/actions/auth";

const DESIGNATIONS = [
  "Project Manager",
  "Team Lead",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "UI/UX Designer",
  "QA Engineer",
  "DevOps Engineer",
  "Data Analyst",
  "Business Analyst",
  "Product Owner",
  "Scrum Master",
  "General",
];

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"ADMIN" | "MEMBER">("MEMBER");
  const [designation, setDesignation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (!designation) {
      setError("Please select a designation.");
      return;
    }

    setLoading(true);

    try {
      await signupUser({ name, email, password, role, designation });

      // Auto-login after successful signup
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
        setLoading(false);
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-12">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950" />
      <div className="absolute inset-0">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1.5s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 w-full max-w-lg px-4">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/25 mb-4">
            <LayoutDashboard className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Join Team Task
          </h1>
          <p className="text-indigo-200/60 mt-1">
            Create your account to get started
          </p>
        </div>

        <Card className="border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl shadow-black/20">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl text-white text-center">
              Create Account
            </CardTitle>
            <CardDescription className="text-indigo-200/50 text-center">
              Fill in your details to join your team
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-300 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-400 shrink-0" />
                  {error}
                </div>
              )}

              {/* Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-indigo-100/70">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-200"
                  placeholder="John Doe"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-indigo-100/70">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-200"
                  placeholder="you@example.com"
                />
              </div>

              {/* Role Selector */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-indigo-100/70">
                  Role
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole("MEMBER")}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-200 ${
                      role === "MEMBER"
                        ? "bg-indigo-500/20 border-indigo-500/50 text-white shadow-lg shadow-indigo-500/10"
                        : "bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white/70"
                    }`}
                  >
                    <User size={18} />
                    <div className="text-left">
                      <div className="text-sm font-semibold">Member</div>
                      <div className="text-xs opacity-60">Team member</div>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("ADMIN")}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-200 ${
                      role === "ADMIN"
                        ? "bg-amber-500/20 border-amber-500/50 text-white shadow-lg shadow-amber-500/10"
                        : "bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white/70"
                    }`}
                  >
                    <Shield size={18} />
                    <div className="text-left">
                      <div className="text-sm font-semibold">Admin</div>
                      <div className="text-xs opacity-60">Project lead</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Designation */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-indigo-100/70">
                  Designation
                </label>
                <div className="relative">
                  <select
                    required
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-200 appearance-none cursor-pointer"
                  >
                    <option value="" disabled className="bg-slate-900 text-white/50">
                      Select your designation
                    </option>
                    {DESIGNATIONS.map((d) => (
                      <option key={d} value={d} className="bg-slate-900 text-white">
                        {d}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={16}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-indigo-100/70">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-200 pr-12"
                    placeholder="Min. 6 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-indigo-100/70">
                  Confirm Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder:text-white/25 focus:outline-none focus:ring-2 transition-all duration-200 ${
                    confirmPassword && confirmPassword !== password
                      ? "border-red-500/50 focus:ring-red-500/50"
                      : "border-white/10 focus:ring-indigo-500/50 focus:border-indigo-500/50"
                  }`}
                  placeholder="Repeat password"
                />
                {confirmPassword && confirmPassword !== password && (
                  <p className="text-red-400 text-xs mt-1">Passwords do not match</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full py-3 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:shadow-indigo-500/40 hover:scale-[1.01] active:scale-[0.99] border-0 mt-2"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <span className="flex items-center gap-2">
                    <UserPlus size={18} />
                    Create Account
                  </span>
                )}
              </Button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-3 text-white/30 bg-transparent">
                    Already have an account?
                  </span>
                </div>
              </div>

              <Link href="/auth/login" className="block">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full py-3 h-12 border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white rounded-xl transition-all duration-200"
                >
                  Sign in instead
                </Button>
              </Link>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-white/20 text-xs mt-6">
          © {new Date().getFullYear()} Team Task Manager. Built for teams.
        </p>
      </div>
    </div>
  );
}
