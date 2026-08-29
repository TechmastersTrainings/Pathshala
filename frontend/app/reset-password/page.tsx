"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { api } from "@/services/api";
import { 
  Lock, 
  AlertTriangle, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  KeyRound,
  Building2,
  RefreshCw
} from "lucide-react";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const uid = searchParams.get("uid") || "";
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!uid || !token) {
      setError("Invalid or missing password reset link. Please request a new link.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please re-enter your password.");
      return;
    }

    setIsLoading(true);
    try {
      await api.post("/auth/reset-password/", {
        uid,
        token,
        password
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to reset password. The link may have expired.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-slate-800 flex flex-col justify-center items-center px-4 py-12 relative selection:bg-indigo-600 selection:text-white">
      {/* Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[650px] h-[450px] bg-gradient-to-tr from-indigo-500/20 via-purple-400/15 to-pink-400/15 rounded-full blur-3xl animate-pulse-glow" />
      </div>

      <div className="absolute top-6 left-6 z-10">
        <Link 
          href="/login" 
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glass-panel text-sm font-bold text-slate-700 hover:text-indigo-600 hover:border-indigo-300 shadow-xs transition-all"
        >
          <ArrowLeft size={16} /> Back to Sign In
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
            Create New Password
          </h2>
          <p className="text-sm sm:text-base text-slate-500 mt-2 font-normal">
            Enter your new secure password below to regain access.
          </p>
        </div>

        {/* Main Glass Card */}
        <div className="glass-panel rounded-3xl p-8 sm:p-9 shadow-2xl relative overflow-hidden bg-white/85">
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

          {success ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4 space-y-5"
            >
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 size={36} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Password Updated!</h3>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                  Your password has been updated successfully. You can now sign in with your new credentials.
                </p>
              </div>
              <Link 
                href="/login" 
                className="w-full h-12 btn-primary rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
              >
                Go to Sign In <ArrowRight size={18} />
              </Link>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                    <Lock size={18} />
                  </span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full pl-11 pr-4 h-12 bg-slate-50/80 border border-slate-200 rounded-xl text-base text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium shadow-xs"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                    <KeyRound size={18} />
                  </span>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full pl-11 pr-4 h-12 bg-slate-50/80 border border-slate-200 rounded-xl text-base text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium shadow-xs"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 btn-primary disabled:opacity-50 text-base font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all"
              >
                {isLoading ? (
                  <>
                    <RefreshCw size={18} className="animate-spin" />
                    Updating Password...
                  </>
                ) : (
                  <>
                    Set New Password
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Corporate Footer */}
        <div className="text-center mt-8 text-[11px] font-semibold text-slate-600 flex items-center justify-center gap-1.5">
          <Building2 size={12} /> Techmasters Innovations Private Limited
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
