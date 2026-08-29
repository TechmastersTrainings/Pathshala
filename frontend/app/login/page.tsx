"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/useAuthStore";
import { api } from "@/services/api";
import { 
  Lock, 
  Mail, 
  AlertTriangle, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  KeyRound,
  Building2,
  RefreshCw
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuthStore();
  
  // State
  const [mode, setMode] = useState<"login" | "forgot">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [devResetUrl, setDevResetUrl] = useState<string | null>(null);
  const [isSubmittingForgot, setIsSubmittingForgot] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    
    if (!username || !password) {
      setError("Please fill in both your email/username and password.");
      return;
    }

    try {
      const result = await login({ username, password });
      if (result.success) {
        const role = result.user.role;
        if (role === "SUPER_ADMIN") {
          router.push("/dashboard/super-admin");
        } else if (role === "SCHOOL_ADMIN") {
          router.push("/dashboard/school-admin");
        } else if (role === "FACULTY") {
          router.push("/dashboard/faculty");
        } else if (role === "PARENT") {
          router.push("/dashboard/parent");
        } else {
          router.push("/dashboard");
        }
      }
    } catch (err: any) {
      setError(err.detail || "Invalid login credentials. Please check your credentials.");
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setDevResetUrl(null);

    if (!forgotEmail) {
      setError("Please enter your registered email address.");
      return;
    }

    setIsSubmittingForgot(true);
    try {
      const res = await api.post("/auth/forgot-password/", { email: forgotEmail });
      setSuccessMessage(res.data.message || "Password reset link sent! Check your inbox.");
      if (res.data.dev_reset_url) {
        setDevResetUrl(res.data.dev_reset_url);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to process password reset. Please try again.");
    } finally {
      setIsSubmittingForgot(false);
    }
  };

  return (
    <div className="min-h-screen text-slate-800 flex flex-col justify-center items-center px-4 py-12 relative selection:bg-indigo-600 selection:text-white">
      {/* Dynamic Animated Ambient Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[650px] h-[450px] bg-gradient-to-tr from-indigo-500/20 via-purple-400/15 to-pink-400/15 rounded-full blur-3xl animate-pulse-glow" />
      </div>

      <div className="absolute top-6 left-6 z-10">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glass-panel text-sm font-bold text-slate-700 hover:text-indigo-600 hover:border-indigo-300 shadow-xs transition-all"
        >
          <ArrowLeft size={16} /> Back to Home
        </Link>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center justify-center mb-4 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
              P
            </div>
          </Link>
          <h2 className="text-3xl font-black tracking-tight text-slate-900">
            {mode === "login" ? "Sign In to Pathshala" : "Reset Your Password"}
          </h2>
          <p className="text-sm sm:text-base text-slate-500 mt-2 font-normal">
            {mode === "login" 
              ? "Enter your credentials to access your ERP portal dashboard." 
              : "Enter your registered email address to receive a secure password reset link."}
          </p>
        </div>

        {/* Main Glass Card */}
        <div className="glass-panel rounded-3xl p-8 sm:p-9 shadow-2xl relative overflow-hidden bg-white/85">
          {/* Error Alert */}
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 flex gap-3 text-sm text-rose-700 font-medium"
            >
              <AlertTriangle size={18} className="shrink-0 text-rose-600 mt-0.5" />
              <div>{error}</div>
            </motion.div>
          )}

          {/* Success Alert */}
          {successMessage && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col gap-2 text-sm text-emerald-800 font-medium"
            >
              <div className="flex gap-2.5 items-center font-bold text-emerald-900">
                <CheckCircle2 size={18} className="shrink-0 text-emerald-600" />
                <span>Request Dispatched</span>
              </div>
              <p className="text-emerald-700 text-xs sm:text-sm">{successMessage}</p>
              {devResetUrl && (
                <div className="mt-2 pt-2 border-t border-emerald-200 text-xs">
                  <span className="font-bold">Dev Quick-Link: </span>
                  <Link href={devResetUrl.replace('http://localhost:3000', '')} className="text-indigo-600 underline break-all font-semibold">
                    Open Reset Page
                  </Link>
                </div>
              )}
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {mode === "login" ? (
              <motion.form 
                key="login-form"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.25 }}
                onSubmit={handleLoginSubmit} 
                className="space-y-5"
              >
                {/* Username / Email */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                    Email Address or Username
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                      <Mail size={18} />
                    </span>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="admin@school.com"
                      className="w-full pl-11 pr-4 h-12 bg-slate-50/80 border border-slate-200 rounded-xl text-base text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium shadow-xs"
                      required
                    />
                  </div>
                </div>

                {/* Password with Aligned "Forgot password?" */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setError(null);
                        setSuccessMessage(null);
                        setForgotEmail(username.includes("@") ? username : "");
                        setMode("forgot");
                      }}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:underline transition-colors cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                      <Lock size={18} />
                    </span>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-11 pr-4 h-12 bg-slate-50/80 border border-slate-200 rounded-xl text-base text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium shadow-xs"
                      required
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 btn-primary disabled:opacity-50 text-base font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw size={18} className="animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </motion.form>
            ) : (
              <motion.form 
                key="forgot-form"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.25 }}
                onSubmit={handleForgotSubmit} 
                className="space-y-5"
              >
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                    Registered Email Address
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                      <Mail size={18} />
                    </span>
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="your.email@school.com"
                      className="w-full pl-11 pr-4 h-12 bg-slate-50/80 border border-slate-200 rounded-xl text-base text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium shadow-xs"
                      required
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    We will send a secure password reset link to this email address.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingForgot}
                  className="w-full h-12 btn-primary disabled:opacity-50 text-base font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all"
                >
                  {isSubmittingForgot ? (
                    <>
                      <RefreshCw size={18} className="animate-spin" />
                      Dispatching Reset Link...
                    </>
                  ) : (
                    <>
                      Send Reset Instructions
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setError(null);
                      setSuccessMessage(null);
                      setMode("login");
                    }}
                    className="text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft size={15} /> Return to Sign In
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        {/* Corporate Footer */}
        <div className="text-center mt-8 space-y-2">
          <div className="text-sm text-slate-600 font-medium">
            Need to onboard a new institution?{" "}
            <Link href="/register" className="text-indigo-600 hover:text-indigo-700 hover:underline font-bold">
              Register School
            </Link>
          </div>
          <div className="text-[11px] font-semibold text-slate-600 flex items-center justify-center gap-1.5 pt-1">
            <Building2 size={12} /> Techmasters Innovations Private Limited
          </div>
        </div>
      </div>
    </div>
  );
}
