"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, 
  Users, 
  Calendar, 
  CreditCard, 
  CheckCircle, 
  ShieldCheck, 
  Bus, 
  Bell, 
  Award, 
  UserCheck,
  ChevronDown,
  ArrowRight,
  Menu,
  X,
  Lock,
  Server,
  Database,
  KeyRound,
  Sparkles,
  Layers,
  Check,
  GraduationCap,
  School as SchoolIcon,
  Shield,
  Laptop,
  Zap,
  Globe,
  CheckCircle2,
  Building2,
  Compass,
  Cpu,
  BadgeCheck
} from "lucide-react";

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [pricingDuration, setPricingDuration] = useState<"monthly" | "yearly">("monthly");
  const [activeRoleTab, setActiveRoleTab] = useState<number>(0);
  const [activeModulePreview, setActiveModulePreview] = useState<number>(0);

  const modules = [
    {
      id: "academics",
      label: "Academic Management",
      icon: Users,
      headline: "Comprehensive Student & Cohort Lifecycle",
      description: "Manage admissions, roll numbers, document vaults, class rosters, and parent contacts seamlessly.",
      highlights: ["Automated roll indexing", "Dynamic cohort promotion", "Digital document archives", "Guardian mapping"]
    },
    {
      id: "attendance",
      label: "Attendance Roster",
      icon: UserCheck,
      headline: "One-Touch Digital Roll Call & Alert System",
      description: "Faculty record daily attendance in seconds; parents receive instant automated SMS/email absence alerts.",
      highlights: ["Device-agnostic marking", "Real-time absence broadcasts", "Monthly ledger summaries", "Audit report generation"]
    },
    {
      id: "exams",
      label: "Examinations & Grading",
      icon: Award,
      headline: "Intelligent Evaluation Schedules & Report Cards",
      description: "Schedule subject tests, input mark criteria, auto-calculate grade rankings, and print beautiful report cards.",
      highlights: ["Custom grading rubrics", "Automated percentile calculation", "Digital report card generation", "Parent signature tracking"]
    },
    {
      id: "finance",
      label: "Fee Collection",
      icon: CreditCard,
      headline: "Integrated Invoicing & Tuition Ledgers",
      description: "Automate invoice generation, accept online payments, track overdue balances, and reconcile bank accounts.",
      highlights: ["Custom fee schedule rules", "Online payment integration", "Defaulter list reminders", "Instant digital receipts"]
    }
  ];

  const features = [
    {
      title: "Student Lifecycle Management",
      desc: "Complete academic records from enrollment to graduation. Manage student rosters, admission documents, and guardian details securely.",
      icon: Users,
      badge: "Academics",
      accentBg: "bg-blue-50 text-blue-600 border-blue-200/80"
    },
    {
      title: "Real-Time Attendance Roster",
      desc: "Instant marking for educators with automated absence logging and instant notification dispatches to parents.",
      icon: UserCheck,
      badge: "Automated",
      accentBg: "bg-emerald-50 text-emerald-600 border-emerald-200/80"
    },
    {
      title: "Exams & Automated Gradebooks",
      desc: "Define evaluation schedules, enter subject scores, auto-compute ranks and percentiles, and generate instant printable reports.",
      icon: Award,
      badge: "Evaluation",
      accentBg: "bg-purple-50 text-purple-600 border-purple-200/80"
    },
    {
      title: "Fee Billing & Ledger Audits",
      desc: "Automate fee schedule generation, track student invoice statuses, reconcile online payments, and view overdue balances.",
      icon: CreditCard,
      badge: "Finance",
      accentBg: "bg-amber-50 text-amber-600 border-amber-200/80"
    },
    {
      title: "Faculty & Staff Allocation",
      desc: "Manage teacher profiles, assign subjects to specific classroom sections, and coordinate staff workloads effortlessly.",
      icon: BookOpen,
      badge: "Staffing",
      accentBg: "bg-indigo-50 text-indigo-600 border-indigo-200/80"
    },
    {
      title: "Dedicated Parent Portal",
      desc: "Secure read-only portal for parents to track daily attendance, test performance, homework, and fee payments in real time.",
      icon: ShieldCheck,
      badge: "Portals",
      accentBg: "bg-cyan-50 text-cyan-600 border-cyan-200/80"
    },
    {
      title: "Conflict-Free Timetables",
      desc: "Organize classroom periods, teacher subject hours, and break intervals with automatic conflict detection.",
      icon: Calendar,
      badge: "Operations",
      accentBg: "bg-teal-50 text-teal-600 border-teal-200/80"
    },
    {
      title: "Broadcast & Circular Alerts",
      desc: "Instantly broadcast official circulars, event calendars, holiday notices, and emergency updates to all stakeholders.",
      icon: Bell,
      badge: "Alerts",
      accentBg: "bg-rose-50 text-rose-600 border-rose-200/80"
    },
    {
      title: "Transport Fleet Management",
      desc: "Map student bus routes, coordinate driver contact details, manage vehicle registrations, and verify route assignments.",
      icon: Bus,
      badge: "Logistics",
      accentBg: "bg-orange-50 text-orange-600 border-orange-200/80"
    }
  ];

  const roleProfiles = [
    {
      title: "Super Admin",
      tagline: "Ecosystem Governance & Management",
      icon: Shield,
      badgeColor: "bg-purple-100 text-purple-700 border-purple-200",
      desc: "Full governance over the multi-tenant SaaS ecosystem. Super admins provision and activate institutions, configure subscription tiers, audit transaction ledgers, and monitor global system logs.",
      capabilities: [
        "Multi-School Onboarding & Lifecycle Control",
        "Subscription & Plan Configuration",
        "Payment Gateway & Invoice Auditing",
        "System Log Monitoring & Health Checks"
      ]
    },
    {
      title: "School Admin",
      tagline: "Institutional Controller & Operations",
      icon: SchoolIcon,
      badgeColor: "bg-indigo-100 text-indigo-700 border-indigo-200",
      desc: "Centralized workspace for school principals and managers. Oversee student admissions, approve faculty credentials, generate class timetables, and monitor real-time tuition fee collections.",
      capabilities: [
        "Comprehensive Student & Faculty Records",
        "Tuition Fee Invoicing & Ledger Tracking",
        "Class Cohort & Timetable Scheduling",
        "Official Circulars & Academic Calendars"
      ]
    },
    {
      title: "Faculty Staff",
      tagline: "Classroom Coordination & Grades",
      icon: GraduationCap,
      badgeColor: "bg-sky-100 text-sky-700 border-sky-200",
      desc: "Streamlined workflow for teachers. Mark daily classroom rosters in seconds, input examination scores, review allocated subjects, and publish student remarks seamlessly.",
      capabilities: [
        "One-Click Roster Attendance Marking",
        "Exam Marks Entry & Digital Scorecards",
        "Personal Teaching Schedule Access",
        "Student Academic Remarks & Logs"
      ]
    },
    {
      title: "Parents & Students",
      tagline: "Transparent Engagement & Insights",
      icon: Laptop,
      badgeColor: "bg-emerald-100 text-emerald-700 border-emerald-200",
      desc: "Clean, accessible portal for guardians and students. Monitor daily attendance records, review scorecard performance, inspect upcoming schedules, and clear school fees securely online.",
      capabilities: [
        "Daily Attendance & Absence Status",
        "Digital Report Cards & Score Trends",
        "Online Tuition Invoicing & Receipts",
        "School Notices & Holiday Notifications"
      ]
    }
  ];

  const architectureHighlights = [
    {
      icon: Lock,
      title: "Strict Tenant Isolation",
      desc: "Every database query is strictly partitioned by unique school identifiers, ensuring absolute tenant privacy and zero data leakage.",
      glow: "bg-blue-50 text-blue-600 border border-blue-200/80"
    },
    {
      icon: KeyRound,
      title: "Granular RBAC Security",
      desc: "Role-based access tokens with JWT signature verification guarantee users access only their assigned operational domains.",
      glow: "bg-purple-50 text-purple-600 border border-purple-200/80"
    },
    {
      icon: Server,
      title: "High-Performance REST APIs",
      desc: "Optimized Django REST endpoints paired with client-side caching deliver sub-second data synchronization across all devices.",
      glow: "bg-cyan-50 text-cyan-600 border border-cyan-200/80"
    },
    {
      icon: Database,
      title: "ACID Relational Integrity",
      desc: "MySQL relational engine with transactional integrity, foreign key consistency, soft-deletion protection, and automatic backups.",
      glow: "bg-emerald-50 text-emerald-600 border border-emerald-200/80"
    }
  ];

  const pricingPlans = [
    {
      name: "Starter Plan",
      priceMonthly: 4999,
      priceYearly: 49990,
      desc: "Ideal for single-cohort academies, primary schools, and boutique learning centers.",
      studentsLimit: "Up to 300 Students",
      facultyLimit: "Up to 15 Faculty Staff",
      features: [
        "Student & Parent Profiles",
        "Daily Attendance Roster Marking",
        "Class & Subject Cohort Planner",
        "Timetable Schedule Creator",
        "Announcements & Holiday Alerts",
        "Standard Email Support"
      ],
      popular: false
    },
    {
      name: "Professional Plan",
      priceMonthly: 9999,
      priceYearly: 99990,
      desc: "Comprehensive solution designed for growing secondary schools and large institutions.",
      studentsLimit: "Up to 1,000 Students",
      facultyLimit: "Up to 50 Faculty Staff",
      features: [
        "Everything in Starter Plan",
        "Exam Scheduling & Digital Gradebooks",
        "Tuition Fee Ledger & Payment Tracking",
        "Transport Fleet & Route Manager",
        "All 4 Role-Specific Portal Accounts",
        "System Log Audits & Export Options",
        "Priority Support Assistance"
      ],
      popular: true
    },
    {
      name: "Enterprise Plan",
      priceMonthly: 19999,
      priceYearly: 199990,
      desc: "Engineered for large multi-branch school networks and collegiate institutions.",
      studentsLimit: "Unlimited Students",
      facultyLimit: "Unlimited Faculty Staff",
      features: [
        "Everything in Professional Plan",
        "Multi-Branch Unified Dashboard",
        "Custom Feature Activations & Roles",
        "Advanced Analytics & Trend Reports",
        "Automated Database Backups",
        "Dedicated Account Specialist",
        "24/7 Priority Phone & Email Support"
      ],
      popular: false
    }
  ];

  const faqs = [
    {
      q: "How does the multi-tenant architecture ensure our school data is isolated?",
      a: "Pathshala enforces multi-tenancy at the core middleware and database layers. Every database query automatically filters records using the unique school_id token context, making cross-tenant data access structurally impossible."
    },
    {
      q: "Can school administrators customize faculty roles and classroom assignments?",
      a: "Yes. School Admins have full flexibility to configure classes, sections, and subjects, and assign faculty members to specific classroom subjects with personalized role permissions."
    },
    {
      q: "Is there a setup fee or long-term contract requirement?",
      a: "No. Pathshala operates on a transparent subscription model (monthly or discounted annual billing). You can activate your plan immediately with zero hidden implementation charges and scale on demand."
    },
    {
      q: "What permissions do parents have in the portal?",
      a: "The parent portal is strictly read-only for academic and administrative records (attendance, marks, schedules, circulars) and provides secure access to view and pay school fee invoices online."
    },
    {
      q: "How easy is it to onboard faculty and students into the system?",
      a: "School Admins can quickly register students and faculty via simple administrative workflows or batch onboarding to have an entire school cohort operational in minutes."
    }
  ];

  return (
    <div className="flex-1 text-slate-800 flex flex-col font-sans selection:bg-indigo-600 selection:text-white relative">
      {/* Dynamic Animated Ambient Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-500/15 via-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute top-1/3 -right-32 w-[500px] h-[500px] bg-gradient-to-br from-cyan-400/15 via-blue-400/10 to-indigo-400/10 rounded-full blur-3xl animate-float-reverse" />
        <div className="absolute -bottom-32 left-1/3 w-[600px] h-[600px] bg-gradient-to-tr from-purple-400/10 via-pink-400/10 to-amber-300/10 rounded-full blur-3xl animate-pulse-glow" />
      </div>

      {/* Top Corporate Attribution Banner */}
      <div className="relative z-50 bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-950 text-white text-xs py-2 px-4 text-center font-medium flex items-center justify-center gap-2 shadow-sm border-b border-white/10">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/30 border border-indigo-400/40 text-[11px] font-bold text-indigo-200">
          <Building2 size={12} className="text-amber-300" />
          A Product of Techmasters Innovations Private Limited
        </span>
        <span className="hidden md:inline text-indigo-200/60">•</span>
        <span className="hidden md:inline text-indigo-100 text-xs">Enterprise Multi-Tenant Cloud ERP Active</span>
      </div>

      {/* Sticky Navigation */}
      <header className="sticky top-0 z-40 glass-nav transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 text-white flex items-center justify-center font-black text-lg shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-all">
              P
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-tight text-slate-900 leading-none">PATHSHALA</span>
              <span className="text-[9px] font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent uppercase tracking-widest mt-0.5">
                By Techmasters Innovations
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {[
              { label: "Features", href: "#features" },
              { label: "Simulator", href: "#simulator" },
              { label: "Role Portals", href: "#roles" },
              { label: "Architecture", href: "#architecture" },
              { label: "Pricing", href: "#pricing" },
              { label: "FAQ", href: "#faq" }
            ].map((item, idx) => (
              <a 
                key={idx}
                href={item.href} 
                className="text-xs font-bold text-slate-600 hover:text-indigo-600 transition-colors relative py-1"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2.5">
            <Link 
              href="/login" 
              className="px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:text-indigo-600 hover:bg-white/80 rounded-lg transition-all border border-transparent hover:border-slate-200"
            >
              Sign In
            </Link>
            <Link 
              href="/register" 
              className="btn-primary px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5"
            >
              Get Started
              <ArrowRight size={13} />
            </Link>
          </div>

          <button 
            className="md:hidden p-2 text-slate-700 hover:bg-white/80 rounded-lg border border-slate-200" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="md:hidden border-t border-slate-200/80 bg-white/95 backdrop-blur-2xl px-5 py-5 space-y-3 shadow-xl text-xs font-bold"
            >
              <div className="pb-2 border-b border-slate-100 text-indigo-600 flex items-center gap-1.5">
                <Building2 size={13} /> Techmasters Innovations Private Limited
              </div>
              <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 text-slate-800 hover:text-indigo-600">Features</a>
              <a href="#simulator" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 text-slate-800 hover:text-indigo-600">Live Simulator</a>
              <a href="#roles" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 text-slate-800 hover:text-indigo-600">Role Portals</a>
              <a href="#architecture" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 text-slate-800 hover:text-indigo-600">Architecture</a>
              <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 text-slate-800 hover:text-indigo-600">Pricing</a>
              <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 text-slate-800 hover:text-indigo-600">FAQ</a>
              <div className="pt-3 border-t border-slate-200 flex flex-col gap-2">
                <Link href="/login" className="w-full h-9 rounded-lg flex items-center justify-center border border-slate-200 text-slate-800 font-bold hover:bg-slate-50">
                  Sign In
                </Link>
                <Link href="/register" className="w-full h-9 btn-primary rounded-lg flex items-center justify-center text-white font-bold">
                  Get Started
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-24 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel text-xs font-bold mb-6 shadow-xs"
          >
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
            <span className="text-slate-800">Techmasters Innovations Product</span>
            <span className="text-slate-300">|</span>
            <span className="text-indigo-600">Multi-Tenant Cloud ERP</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-[1.15] text-slate-900"
          >
            Intelligent School Management, <br className="hidden sm:inline" />
            <span className="gradient-text-vibrant">Remarkably Simplified.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-5 text-sm sm:text-base md:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal"
          >
            Empowering schools, educators, students, and parents with seamless admissions, real-time attendance, digital gradebooks, fee automation, and fleet logistics.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5"
          >
            <Link 
              href="/register" 
              className="w-full sm:w-auto px-7 py-3 btn-primary rounded-xl text-sm font-bold flex items-center justify-center gap-2 group shadow-lg shadow-indigo-500/20"
            >
              Start Free Trial
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <a 
              href="#simulator" 
              className="w-full sm:w-auto px-7 py-3 btn-glass rounded-xl text-sm font-bold flex items-center justify-center gap-2 text-slate-700"
            >
              <Compass size={16} className="text-indigo-600" />
              Explore Live Simulator
            </a>
          </motion.div>

          {/* Corporate Trust Badge */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 pt-8 border-t border-slate-200/60 max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-3 text-xs font-semibold text-slate-500"
          >
            <div className="flex items-center gap-1.5 text-slate-700">
              <BadgeCheck className="w-4 h-4 text-indigo-600" />
              <span>Engineered by Techmasters Innovations Private Limited</span>
            </div>
            <span className="hidden sm:inline">•</span>
            <div className="flex items-center gap-1.5 text-slate-700">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Enterprise RBAC & Multi-Tenant Isolation</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Interactive Glass Simulator Section */}
      <section id="simulator" className="py-16 md:py-24 relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-3 border border-indigo-100">
              <Cpu size={13} className="text-indigo-600" /> Interactive Platform Tour
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
              Experience the Modular Power of Pathshala
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-slate-600">
              Click through the modules below to inspect how Pathshala coordinates daily school operations.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Module Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6">
              {modules.map((mod, idx) => {
                const IconComp = mod.icon;
                const isActive = activeModulePreview === idx;
                return (
                  <button
                    key={mod.id}
                    onClick={() => setActiveModulePreview(idx)}
                    className={`p-3 rounded-xl glass-panel text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                      isActive 
                        ? "border-indigo-500 ring-2 ring-indigo-500/20 bg-white/95 shadow-md shadow-indigo-500/10" 
                        : "hover:bg-white/80 opacity-85"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      isActive ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600"
                    }`}>
                      <IconComp size={16} />
                    </div>
                    <span className="font-bold text-xs text-slate-800 leading-tight">
                      {mod.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Active Module Glass Showcase */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeModulePreview}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="glass-panel rounded-2xl p-6 sm:p-8 border border-white/80 bg-white/90 shadow-xl relative overflow-hidden"
              >
                <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
                      Module Details
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                      {modules[activeModulePreview].headline}
                    </h3>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                      {modules[activeModulePreview].description}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                      {modules[activeModulePreview].highlights.map((hl, hIdx) => (
                        <div key={hIdx} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                          <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                          <span>{hl}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="w-full md:w-72 p-5 rounded-xl bg-gradient-to-br from-indigo-900 to-slate-950 text-white shadow-lg relative overflow-hidden shrink-0">
                    <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300">Live Status</span>
                      <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Integrated
                      </span>
                    </div>
                    <p className="text-[11px] text-indigo-200 mb-3.5 leading-relaxed font-mono">
                      Techmasters Innovations Multi-Tenant Isolation Engine: Online (School ID Verified)
                    </p>
                    <Link
                      href="/register"
                      className="w-full py-2 rounded-lg bg-white text-indigo-950 hover:bg-slate-100 text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                    >
                      Deploy Module <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24 relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-3 border border-indigo-100">
              <Zap size={13} className="text-indigo-600" /> Platform Features
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
              Purpose-Built for Every Operational Need
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-slate-600">
              Eliminate disconnected spreadsheets and legacy software. Manage your institution with dedicated, modular workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {features.map((feat, idx) => {
              const IconComp = feat.icon;
              return (
                <motion.div 
                  key={idx} 
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: idx * 0.04 }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="glass-panel p-6 rounded-2xl flex flex-col justify-between group relative overflow-hidden"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center border shadow-xs transition-transform duration-300 group-hover:scale-105 ${feat.accentBg}`}>
                        <IconComp className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/90 border border-slate-200/80 text-slate-600 shadow-xs">
                        {feat.badge}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                      {feat.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                      {feat.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Roles Showcase */}
      <section id="roles" className="py-16 md:py-24 relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-purple-50 text-purple-700 text-xs font-bold uppercase tracking-wider mb-3 border border-purple-100">
              <Shield size={13} className="text-purple-600" /> Role-Based Access Control
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
              Dedicated Portals for Every Stakeholder
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-slate-600">
              Tailored user experiences designed specifically for administrators, educators, and guardians.
            </p>
          </div>

          {/* Interactive Role Switcher */}
          <div className="flex justify-center mb-8 overflow-x-auto pb-2">
            <div className="inline-flex glass-panel p-1.5 rounded-xl gap-1 shadow-xs">
              {roleProfiles.map((role, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveRoleTab(idx)}
                  className={`relative px-4 sm:px-5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all whitespace-nowrap z-10 cursor-pointer ${
                    activeRoleTab === idx 
                      ? "text-slate-900" 
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {activeRoleTab === idx && (
                    <motion.div
                      layoutId="activeRoleTabIndicator"
                      className="absolute inset-0 bg-white rounded-lg shadow-sm border border-slate-200/80"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{role.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Active Role Showcase Card */}
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeRoleTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="max-w-3xl mx-auto glass-panel rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden bg-white/90"
            >
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="flex-1">
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider mb-3 border ${roleProfiles[activeRoleTab].badgeColor}`}>
                    {roleProfiles[activeRoleTab].tagline}
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3">
                    {roleProfiles[activeRoleTab].title} Portal
                  </h3>
                  <p className="text-slate-600 leading-relaxed text-xs sm:text-sm mb-6">
                    {roleProfiles[activeRoleTab].desc}
                  </p>
                  <Link
                    href="/register"
                    className="btn-primary inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-xs font-bold shadow-sm"
                  >
                    Access Portal Options <ArrowRight size={14} />
                  </Link>
                </div>

                <div className="w-full md:w-72 bg-slate-50/90 border border-slate-200/90 rounded-xl p-5 shrink-0 shadow-xs">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-3.5 flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-indigo-600" /> Key Permissions
                  </h4>
                  <div className="space-y-2.5">
                    {roleProfiles[activeRoleTab].capabilities.map((cap, cIdx) => (
                      <motion.div 
                        key={cIdx} 
                        initial={{ opacity: 0, x: 8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: cIdx * 0.06 }}
                        className="flex items-start gap-2 text-xs text-slate-700 font-semibold"
                      >
                        <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                          <Check size={10} strokeWidth={3} />
                        </div>
                        <span>{cap}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Architecture & Security */}
      <section id="architecture" className="py-16 md:py-24 relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-teal-50 text-teal-700 text-xs font-bold uppercase tracking-wider mb-3 border border-teal-100">
              <Globe size={13} className="text-teal-600" /> Enterprise Reliability
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
              Engineered by Techmasters Innovations
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-slate-600">
              Built on proven architectural standards to protect institutional data privacy and ensure continuous uptime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {architectureHighlights.map((arch, idx) => {
              const IconComp = arch.icon;
              return (
                <motion.div 
                  key={idx} 
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: idx * 0.06 }}
                  whileHover={{ y: -3, transition: { duration: 0.2 } }}
                  className="glass-panel rounded-2xl p-6 flex gap-4 items-start hover:border-indigo-300 transition-all bg-white/85"
                >
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${arch.glow}`}>
                    <IconComp className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 mb-1.5">{arch.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">{arch.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 md:py-24 relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-3 border border-indigo-100">
              <CreditCard size={13} className="text-indigo-600" /> Transparent Pricing
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
              Predictable Plans for Every Scale
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-slate-600">
              No hidden fees. Select the plan tailored for your institution and upgrade whenever you expand.
            </p>
            
            {/* Billing Switcher */}
            <div className="inline-flex items-center glass-panel p-1 rounded-xl mt-8 shadow-inner">
              <button 
                onClick={() => setPricingDuration("monthly")}
                className={`relative px-5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  pricingDuration === "monthly" 
                    ? "text-slate-900" 
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {pricingDuration === "monthly" && (
                  <motion.div
                    layoutId="pricingDurationIndicator"
                    className="absolute inset-0 bg-white rounded-lg shadow-xs border border-slate-200/80"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">Monthly Billing</span>
              </button>
              <button 
                onClick={() => setPricingDuration("yearly")}
                className={`relative px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  pricingDuration === "yearly" 
                    ? "text-slate-900" 
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {pricingDuration === "yearly" && (
                  <motion.div
                    layoutId="pricingDurationIndicator"
                    className="absolute inset-0 bg-white rounded-lg shadow-xs border border-slate-200/80"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  Annual Billing
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-1.5 py-0.5 rounded-full shadow-xs">
                    Save 20%
                  </span>
                </span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            {pricingPlans.map((plan, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className={`glass-panel rounded-2xl p-6 sm:p-7 flex flex-col justify-between relative transition-all bg-white/90 ${
                  plan.popular 
                    ? "border-2 border-indigo-600 ring-2 ring-indigo-500/15 shadow-xl shadow-indigo-500/15 lg:-translate-y-2" 
                    : "shadow-md hover:border-slate-300"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-4 py-0.5 text-[11px] font-black rounded-full uppercase tracking-wider text-white shadow-md">
                    ✨ Recommended
                  </div>
                )}
                
                <div>
                  <h3 className="text-xl font-black text-slate-900 mb-1">{plan.name}</h3>
                  <p className="text-xs text-slate-500 mb-4 min-h-[32px] leading-relaxed">{plan.desc}</p>
                  
                  <div className="flex items-baseline mb-4 gap-1.5 pb-4 border-b border-slate-100">
                    <span className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                      ₹{pricingDuration === "monthly" ? plan.priceMonthly.toLocaleString() : plan.priceYearly.toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-500 font-bold">/{pricingDuration === "monthly" ? "month" : "year"}</span>
                  </div>

                  <div className="space-y-2 pb-4 border-b border-slate-100 mb-4">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 flex items-center gap-1.5">
                      <Users size={13} /> {plan.studentsLimit}
                    </div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-purple-700 flex items-center gap-1.5">
                      <GraduationCap size={13} /> {plan.facultyLimit}
                    </div>
                  </div>

                  <ul className="space-y-2.5 text-xs text-slate-600">
                    {plan.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2">
                        <CheckCircle size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                        <span className="font-medium">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 pt-3">
                  <Link 
                    href={{
                      pathname: '/register',
                      query: { plan_id: idx + 1, duration: pricingDuration }
                    }} 
                    className={`w-full h-10 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                      plan.popular 
                        ? "btn-primary shadow-sm" 
                        : "btn-glass text-slate-800 hover:border-indigo-300"
                    }`}
                  >
                    Select {plan.name}
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 md:py-24 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-3 border border-indigo-100">
            Questions & Answers
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-slate-600">
            Everything you need to know about Pathshala ERP setup, isolation, and capabilities.
          </p>
        </div>

        <div className="space-y-3.5">
          {faqs.map((faq, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.04 }}
              className="glass-panel rounded-xl overflow-hidden shadow-xs hover:border-indigo-300 transition-colors bg-white/90"
            >
              <button 
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full px-5 py-4 flex items-center justify-between text-left font-bold text-slate-900 hover:text-indigo-600 focus:outline-none cursor-pointer"
              >
                <span className="text-sm sm:text-base">{faq.q}</span>
                <ChevronDown 
                  size={18} 
                  className={`text-slate-500 transition-transform duration-250 shrink-0 ml-3 ${activeFaq === idx ? "rotate-180 text-indigo-600" : ""}`} 
                />
              </button>
              
              <AnimatePresence>
                {activeFaq === idx && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-4 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-200/60 font-normal">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="bg-gradient-to-br from-indigo-950 via-slate-950 to-purple-950 text-white py-16 md:py-20 text-center relative overflow-hidden z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] pointer-events-none" />
        
        <div className="max-w-3xl mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-[11px] font-bold mb-4 backdrop-blur-md border border-white/15 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Empowering Modern Education
          </motion.div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Ready to Modernize Your School Administration?
          </h2>
          <p className="mt-4 text-xs sm:text-sm md:text-base text-indigo-200 max-w-xl mx-auto leading-relaxed font-normal">
            Join educational institutions transforming their campus operations with Pathshala ERP. Onboard today.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-3">
            <Link 
              href="/register" 
              className="w-full sm:w-auto px-7 py-3 bg-white text-indigo-950 hover:bg-slate-100 rounded-xl text-sm font-bold shadow-lg shadow-black/20 transition-all hover:scale-105"
            >
              Get Started Now
            </Link>
            <a 
              href="#pricing" 
              className="w-full sm:w-auto px-7 py-3 border border-white/25 hover:border-white/50 text-white rounded-xl text-sm font-bold transition-all hover:bg-white/5"
            >
              View Plan Options
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-300 border-t border-slate-800/80 py-12 relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 via-purple-600 to-pink-500 text-white flex items-center justify-center font-bold text-base shadow-sm">
                P
              </div>
              <span className="text-lg font-bold tracking-tight text-white">PATHSHALA</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-normal">
              Cloud-native multi-tenant ERP platform powering modern educational workflows with security, reliability, and precision.
            </p>
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-indigo-300 font-semibold flex items-center gap-1.5">
              <Building2 size={14} className="text-amber-400 shrink-0" />
              <span>A product of Techmasters Innovations Private Limited</span>
            </div>
          </div>

          <div>
            <h4 className="text-[11px] uppercase tracking-widest font-bold text-white mb-3.5">Platform</h4>
            <ul className="space-y-2 text-xs text-slate-400 font-medium">
              <li><a href="#features" className="hover:text-white transition-colors">Features & Modules</a></li>
              <li><a href="#simulator" className="hover:text-white transition-colors">Platform Simulator</a></li>
              <li><a href="#roles" className="hover:text-white transition-colors">Role Portals</a></li>
              <li><a href="#architecture" className="hover:text-white transition-colors">Architecture & Security</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Pricing Plans</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] uppercase tracking-widest font-bold text-white mb-3.5">Resources</h4>
            <ul className="space-y-2 text-xs text-slate-400 font-medium">
              <li><a href="#faq" className="hover:text-white transition-colors">Frequently Asked Questions</a></li>
              <li><Link href="/login" className="hover:text-white transition-colors">Portal Login</Link></li>
              <li><Link href="/register" className="hover:text-white transition-colors">Institution Registration</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms & Privacy</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] uppercase tracking-widest font-bold text-white mb-3.5">Contact</h4>
            <ul className="space-y-2 text-xs text-slate-400 leading-relaxed font-normal">
              <li className="font-semibold text-slate-200">Techmasters Innovations Pvt. Ltd.</li>
              <li>Support: Techmastersinnovations@gmail.com</li>
              <li>Phone: +91 9880768222</li>
              <li>Location: Bidar, Karnataka, India</li>
            </ul>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 font-medium">
          <span>&copy; {new Date().getFullYear()} Techmasters Innovations Private Limited. All rights reserved.</span>
          <div className="flex gap-4 mt-3 sm:mt-0">
            <span className="text-slate-400">Pathshala ERP v2.0 Enterprise</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
