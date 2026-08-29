"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/services/api";
import { 
  Building, 
  User, 
  Lock, 
  CreditCard, 
  Check, 
  ChevronRight, 
  ChevronLeft,
  Loader,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Building2,
  Sparkles,
  ShieldCheck,
  Zap,
  Phone,
  Mail,
  MapPin,
  Globe,
  Award
} from "lucide-react";

interface Plan {
  id: number;
  name: string;
  price: string;
  duration_days: number;
  max_students: number;
  max_faculty: number;
  description: string;
}

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Step navigation
  const [step, setStep] = useState(1);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // School Info State
  const [schoolName, setSchoolName] = useState("");
  const [schoolEmail, setSchoolEmail] = useState("");
  const [schoolPhone, setSchoolPhone] = useState("");
  const [schoolAddress, setSchoolAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [schoolType, setSchoolType] = useState("PRIMARY");
  
  // Optional Fields
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [description, setDescription] = useState("");
  
  // Admin Info State
  const [adminFullName, setAdminFullName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPhone, setAdminPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Subscription Info State
  const [selectedPlanId, setSelectedPlanId] = useState<number>(1);
  const [durationMonths, setDurationMonths] = useState<number>(1);
  
  // Payment Modal State
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [registering, setRegistering] = useState(false);

  // Fetch Plans from API on mount
  useEffect(() => {
    async function fetchPlans() {
      try {
        const response = await api.get("/schools/plans/");
        setPlans(response.data);
        
        const urlPlanId = searchParams.get("plan_id");
        if (urlPlanId) {
          setSelectedPlanId(parseInt(urlPlanId));
        } else if (response.data.length > 0) {
          setSelectedPlanId(response.data[0].id);
        }
      } catch (err) {
        console.warn("Could not fetch plans from API, using fallback data.");
        setPlans([
          { id: 1, name: "Starter Plan", price: "4999.00", duration_days: 30, max_students: 300, max_faculty: 15, description: "Perfect for single-cohort academies or small primary institutions." },
          { id: 2, name: "Professional Plan", price: "9999.00", duration_days: 30, max_students: 1000, max_faculty: 50, description: "Designed for mid-sized educational secondary schools." },
          { id: 3, name: "Enterprise Plan", price: "19999.00", duration_days: 30, max_students: 99999, max_faculty: 9999, description: "Tailored for large school networks and universities." }
        ]);
        const urlPlanId = searchParams.get("plan_id");
        setSelectedPlanId(urlPlanId ? parseInt(urlPlanId) : 1);
      } finally {
        setLoadingPlans(false);
      }
    }
    fetchPlans();
  }, [searchParams]);

  // Form validations for Step 1
  const validateStep1 = () => {
    if (!schoolName || !schoolEmail || !schoolPhone || !schoolAddress || !city || !state || !pincode || !schoolType) {
      setError("Please fill in all mandatory School Information fields.");
      return false;
    }
    setError(null);
    return true;
  };

  // Form validations for Step 2
  const validateStep2 = () => {
    if (!adminFullName || !adminEmail || !adminPhone || !password || !confirmPassword) {
      setError("Please fill in all mandatory Admin Account fields.");
      return false;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match. Please re-enter.");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return false;
    }
    setError(null);
    return true;
  };

  // Launch Payment Gateway Dialog
  const handleCheckout = () => {
    setError(null);
    setPaymentModalOpen(true);
  };

  // Simulate Razorpay Test Payment Success
  const handlePaymentVerify = async () => {
    setRegistering(true);
    
    const razorpay_payment_id = `pay_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const razorpay_order_id = `order_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const razorpay_signature = `sig_${Math.random().toString(36).substr(2, 12).toUpperCase()}`;
    
    const requestData = {
      school_name: schoolName,
      school_email: schoolEmail,
      school_phone: schoolPhone,
      school_address: schoolAddress,
      city,
      state,
      pincode,
      school_type: schoolType,
      website_url: websiteUrl || null,
      description: description || null,
      
      admin_full_name: adminFullName,
      admin_email: adminEmail,
      admin_phone: adminPhone,
      password,
      confirm_password: confirmPassword,
      
      plan_id: selectedPlanId,
      subscription_duration_months: durationMonths,
      
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature
    };

    try {
      const response = await api.post("/auth/register/", requestData);
      if (response.data.success) {
        setPaymentSuccess(true);
      }
    } catch (err: any) {
      setPaymentModalOpen(false);
      setError(err.school_email?.[0] || err.admin_email?.[0] || err.detail || "School registration failed. Ensure emails are unique.");
    } finally {
      setRegistering(false);
    }
  };

  const getActivePlan = () => {
    return plans.find(p => p.id === selectedPlanId) || plans[0];
  };

  const getPlanPrice = () => {
    const plan = getActivePlan();
    if (!plan) return 0;
    const basePrice = parseFloat(plan.price);
    if (durationMonths === 6) return basePrice * 6 * 0.95;
    if (durationMonths === 12) return basePrice * 12 * 0.8;
    return basePrice * durationMonths;
  };

  if (paymentSuccess) {
    return (
      <div className="min-h-screen text-slate-800 flex flex-col justify-center items-center px-4 relative selection:bg-indigo-600 selection:text-white">
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[650px] h-[450px] bg-gradient-to-tr from-emerald-500/20 via-teal-400/15 to-indigo-400/15 rounded-full blur-3xl animate-pulse-glow" />
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-lg glass-panel rounded-3xl p-8 sm:p-10 text-center shadow-2xl relative z-10 bg-white/90"
        >
          <div className="w-20 h-20 bg-emerald-100 border border-emerald-200 rounded-3xl flex items-center justify-center mx-auto mb-6 text-emerald-600 shadow-inner">
            <CheckCircle2 size={44} />
          </div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3">
            Activation Completed
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-3">Welcome to Pathshala ERP!</h2>
          <p className="text-sm sm:text-base text-slate-600 mb-8 leading-relaxed">
            Your institution <span className="font-bold text-slate-900">{schoolName}</span> and administrative portal have been provisioned and activated successfully.
          </p>
          
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left mb-8 space-y-2 text-xs sm:text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Admin Username:</span>
              <span className="font-bold text-slate-800">{adminEmail}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Selected Plan:</span>
              <span className="font-bold text-indigo-600">{getActivePlan()?.name}</span>
            </div>
          </div>

          <Link 
            href="/login" 
            className="w-full h-12 btn-primary rounded-xl text-base font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25"
          >
            Access Admin Dashboard <ArrowRight size={18} />
          </Link>
          
          <div className="mt-6 text-[11px] font-semibold text-slate-500 flex items-center justify-center gap-1.5">
            <Building2 size={13} /> Powered by Techmasters Innovations Private Limited
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-slate-800 flex flex-col items-center py-12 px-4 relative selection:bg-indigo-600 selection:text-white">
      {/* Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[750px] h-[500px] bg-gradient-to-tr from-indigo-500/15 via-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse-glow" />
      </div>

      <div className="absolute top-6 left-6 z-10">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glass-panel text-sm font-bold text-slate-700 hover:text-indigo-600 hover:border-indigo-300 shadow-xs transition-all"
        >
          <ArrowLeft size={16} /> Back to Home
        </Link>
      </div>

      <div className="w-full max-w-3xl relative z-10 pt-4">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center justify-center mb-3 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
              P
            </div>
          </Link>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
            Register Your Institution
          </h1>
          <p className="text-sm sm:text-base text-slate-500 mt-2 font-normal">
            Deploy Pathshala ERP by Techmasters Innovations in 3 simple steps.
          </p>
        </div>

        {/* Steps Indicator */}
        <div className="flex justify-between items-center mb-8 px-6 max-w-md mx-auto">
          {[
            { num: 1, label: "School Info" },
            { num: 2, label: "Admin Account" },
            { num: 3, label: "Subscription" }
          ].map((s) => (
            <div key={s.num} className="flex items-center">
              <div className={`w-9 h-9 rounded-2xl border flex items-center justify-center text-sm font-bold transition-all shadow-xs ${
                step >= s.num 
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20" 
                  : "border-slate-300 bg-white text-slate-500"
              }`}>
                {step > s.num ? <Check size={16} strokeWidth={3} /> : s.num}
              </div>
              {s.num < 3 && (
                <div className={`h-1 w-16 sm:w-24 mx-2 rounded-full transition-all ${
                  step > s.num ? "bg-indigo-600" : "bg-slate-200"
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Error Alert */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 flex gap-3 text-sm text-rose-700 font-medium shadow-xs"
          >
            <AlertTriangle size={18} className="shrink-0 text-rose-600 mt-0.5" />
            <div>{error}</div>
          </motion.div>
        )}

        {/* Form Container */}
        <div className="glass-panel rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden bg-white/90">
          <AnimatePresence mode="wait">
            {/* Step 1: School Information */}
            {step === 1 && (
              <motion.div 
                key="step-1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-2 pb-3 border-b border-slate-200 text-slate-900 font-black text-lg">
                  <Building size={20} className="text-indigo-600" />
                  <span>1. Institutional Details</span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">School Name *</label>
                    <input
                      type="text"
                      value={schoolName}
                      onChange={(e) => setSchoolName(e.target.value)}
                      placeholder="Grand International Academy"
                      className="w-full h-11 px-4 bg-slate-50/80 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">School Email Address *</label>
                    <input
                      type="email"
                      value={schoolEmail}
                      onChange={(e) => setSchoolEmail(e.target.value)}
                      placeholder="contact@school.com"
                      className="w-full h-11 px-4 bg-slate-50/80 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">School Phone *</label>
                    <input
                      type="tel"
                      value={schoolPhone}
                      onChange={(e) => setSchoolPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full h-11 px-4 bg-slate-50/80 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">School Level *</label>
                    <select
                      value={schoolType}
                      onChange={(e) => setSchoolType(e.target.value)}
                      className="w-full h-11 px-4 bg-slate-50/80 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium"
                    >
                      <option value="PRIMARY">Primary School (K-5)</option>
                      <option value="SECONDARY">Secondary School (6-10)</option>
                      <option value="HIGHER_SECONDARY">Higher Secondary School (11-12)</option>
                      <option value="K12">K-12 Academy</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Campus Address *</label>
                  <textarea
                    value={schoolAddress}
                    onChange={(e) => setSchoolAddress(e.target.value)}
                    placeholder="Plot 42, Knowledge Park III..."
                    rows={2}
                    className="w-full p-3.5 bg-slate-50/80 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium"
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">City *</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Bidar"
                      className="w-full h-11 px-4 bg-slate-50/80 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">State *</label>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="Karnataka"
                      className="w-full h-11 px-4 bg-slate-50/80 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Pincode *</label>
                    <input
                      type="text"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      placeholder="585401"
                      className="w-full h-11 px-4 bg-slate-50/80 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Official Website (Optional)</label>
                  <input
                    type="url"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="https://schoolacademy.com"
                    className="w-full h-11 px-4 bg-slate-50/80 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium"
                  />
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => validateStep1() && setStep(2)}
                    className="btn-primary px-7 py-3 rounded-xl text-sm font-bold flex items-center gap-2 cursor-pointer shadow-md shadow-indigo-500/20"
                  >
                    Continue to Admin Setup <ChevronRight size={16} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 2: School Admin Info */}
            {step === 2 && (
              <motion.div 
                key="step-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-2 pb-3 border-b border-slate-200 text-slate-900 font-black text-lg">
                  <User size={20} className="text-indigo-600" />
                  <span>2. Primary School Admin Account</span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Admin Full Name *</label>
                    <input
                      type="text"
                      value={adminFullName}
                      onChange={(e) => setAdminFullName(e.target.value)}
                      placeholder="Dr. Rajesh Sharma"
                      className="w-full h-11 px-4 bg-slate-50/80 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Admin Phone Number *</label>
                    <input
                      type="tel"
                      value={adminPhone}
                      onChange={(e) => setAdminPhone(e.target.value)}
                      placeholder="+91 98807 68222"
                      className="w-full h-11 px-4 bg-slate-50/80 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Admin Login Email *</label>
                  <input
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="principal@school.com"
                    className="w-full h-11 px-4 bg-slate-50/80 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium"
                    required
                  />
                  <p className="text-xs text-slate-500 mt-1.5">This email address will be used to log in to the School Admin dashboard.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Password *</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full h-11 px-4 bg-slate-50/80 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Confirm Password *</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      className="w-full h-11 px-4 bg-slate-50/80 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="btn-glass px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <ChevronLeft size={16} /> Back
                  </button>
                  <button
                    type="button"
                    onClick={() => validateStep2() && setStep(3)}
                    className="btn-primary px-7 py-3 rounded-xl text-sm font-bold flex items-center gap-2 cursor-pointer shadow-md shadow-indigo-500/20"
                  >
                    Continue to Plan Selection <ChevronRight size={16} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Subscription & Plans */}
            {step === 3 && (
              <motion.div 
                key="step-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-2 pb-3 border-b border-slate-200 text-slate-900 font-black text-lg">
                  <CreditCard size={20} className="text-indigo-600" />
                  <span>3. Subscription Tier & Checkout</span>
                </div>
                
                {loadingPlans ? (
                  <div className="h-40 flex items-center justify-center gap-2">
                    <Loader className="animate-spin text-indigo-600" />
                    <span className="text-sm font-semibold text-slate-600">Loading plan options...</span>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {/* Plan Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {plans.map((p) => {
                        const isSelected = selectedPlanId === p.id;
                        return (
                          <div
                            key={p.id}
                            onClick={() => setSelectedPlanId(p.id)}
                            className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                              isSelected 
                                ? "border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-500/20 shadow-md shadow-indigo-500/10" 
                                : "border-slate-200 bg-slate-50/80 hover:border-slate-300"
                            }`}
                          >
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-black text-slate-900 text-base">{p.name}</span>
                                {isSelected && (
                                  <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">
                                    <Check size={12} strokeWidth={3} />
                                  </div>
                                )}
                              </div>
                              <div className="text-2xl font-black text-indigo-600 mb-2">
                                ₹{parseFloat(p.price).toLocaleString()}
                                <span className="text-xs text-slate-500 font-normal">/mo</span>
                              </div>
                              <p className="text-xs text-slate-600 leading-relaxed">{p.description}</p>
                            </div>
                            <div className="mt-4 pt-3 border-t border-slate-200/80 text-xs font-bold text-slate-700">
                              {p.max_students === 99999 ? "Unlimited" : p.max_students} Students Max
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Duration Picker */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">
                        Subscription Duration
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { label: "1 Month", val: 1, discount: "Standard" },
                          { label: "6 Months", val: 6, discount: "5% Off" },
                          { label: "12 Months", val: 12, discount: "20% Off" }
                        ].map((dur) => (
                          <button
                            key={dur.val}
                            type="button"
                            onClick={() => setDurationMonths(dur.val)}
                            className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex flex-col items-center gap-0.5 ${
                              durationMonths === dur.val 
                                ? "bg-white border-indigo-600 text-indigo-700 shadow-sm ring-1 ring-indigo-500/30" 
                                : "bg-white/60 border-slate-200 text-slate-600 hover:bg-white"
                            }`}
                          >
                            <span>{dur.label}</span>
                            <span className="text-[10px] text-emerald-600 font-semibold">{dur.discount}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Summary Card */}
                    <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border border-indigo-200 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block">Total Due Today</span>
                        <span className="text-xl font-black text-slate-900">
                          {getActivePlan()?.name} ({durationMonths} Month{durationMonths > 1 ? "s" : ""})
                        </span>
                      </div>
                      <div className="text-3xl font-black text-slate-900">
                        ₹{getPlanPrice().toLocaleString()}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-between pt-4 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="btn-glass px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <ChevronLeft size={16} /> Back
                  </button>
                  <button
                    type="button"
                    onClick={handleCheckout}
                    className="btn-primary px-8 py-3 rounded-xl text-sm font-bold flex items-center gap-2 cursor-pointer shadow-lg shadow-indigo-500/25"
                  >
                    Proceed to Payment <ChevronRight size={16} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Corporate Trust Footer */}
        <div className="text-center mt-8 space-y-1 text-xs text-slate-500 font-medium">
          <div className="flex items-center justify-center gap-1.5 font-bold text-slate-700">
            <Building2 size={13} className="text-indigo-600" /> Techmasters Innovations Private Limited
          </div>
          <p>By registering, you agree to our Master SaaS SLA and Privacy Terms.</p>
        </div>
      </div>

      {/* Razorpay Mock Modal Dialog with Frosted Glass */}
      <AnimatePresence>
        {paymentModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm glass-panel rounded-3xl p-7 shadow-2xl bg-white relative overflow-hidden"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-5">
                <span className="text-xs font-black tracking-wider text-slate-700">RAZORPAY TEST GATEWAY</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold font-mono">
                  TEST MODE
                </span>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <span className="text-xs text-slate-500 uppercase tracking-wider block font-bold">Merchant</span>
                  <span className="text-base font-extrabold text-slate-900">Techmasters Innovations Pvt. Ltd.</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div>
                    <span className="text-xs text-slate-500 block font-bold">Plan</span>
                    <span className="text-sm font-black text-slate-900">{getActivePlan()?.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-500 block font-bold">Amount</span>
                    <span className="text-lg font-black text-indigo-600">₹{getPlanPrice().toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handlePaymentVerify}
                  disabled={registering}
                  className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
                >
                  {registering ? (
                    <>
                      <Loader className="animate-spin" size={16} /> Verifying Transaction...
                    </>
                  ) : (
                    "Simulate Successful Payment"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentModalOpen(false)}
                  disabled={registering}
                  className="w-full h-11 btn-glass text-xs font-bold rounded-xl flex items-center justify-center transition-all cursor-pointer"
                >
                  Cancel Transaction
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col justify-center items-center gap-3">
        <Loader className="animate-spin text-indigo-600" size={28} />
        <span className="text-sm font-semibold text-slate-600">Loading onboarding portal...</span>
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
}
