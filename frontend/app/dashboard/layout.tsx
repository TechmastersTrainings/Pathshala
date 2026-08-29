"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { 
  LogOut, 
  User, 
  School, 
  Menu, 
  X, 
  Loader,
  LayoutDashboard,
  ShieldAlert
} from "lucide-react";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, initAuth, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [checking, setChecking] = useState(true);

  // Initialize auth state on mount
  useEffect(() => {
    async function loadAuth() {
      await initAuth();
      setChecking(false);
    }
    loadAuth();
  }, [initAuth]);

  // Auth checking logic
  useEffect(() => {
    if (!checking && !isAuthenticated) {
      router.push("/login");
    }
  }, [checking, isAuthenticated, router]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (isLoading || checking) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-center items-center gap-2">
        <Loader className="animate-spin text-[#7C3AED]" size={32} />
        <span className="text-[16px] text-slate-500">Loading secure environment...</span>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null; // Awaiting routing redirect
  }

  // Sidebar Links based on Role
  const getSidebarLinks = () => {
    switch (user.role) {
      case "SUPER_ADMIN":
        return [
          { label: "Overview", href: "/dashboard/super-admin", icon: LayoutDashboard },
        ];
      case "SCHOOL_ADMIN":
        return [
          { label: "Overview", href: "/dashboard/school-admin", icon: LayoutDashboard },
        ];
      case "FACULTY":
        return [
          { label: "Overview", href: "/dashboard/faculty", icon: LayoutDashboard },
        ];
      case "PARENT":
        return [
          { label: "Overview", href: "/dashboard/parent", icon: LayoutDashboard },
        ];
      default:
        return [];
    }
  };

  const links = getSidebarLinks();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col md:flex-row">
      {/* Mobile Header Navigation */}
      <header className="md:hidden h-16 border-b border-slate-200 bg-white px-4 flex items-center justify-between z-45">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-sky-500 text-white flex items-center justify-center font-bold text-slate-800 border border-slate-300/30">
            P
          </div>
          <span className="text-[18px] font-bold tracking-tight">PATHSHALA</span>
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 text-slate-800">
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* Sidebar - Desktop */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 transform md:translate-x-0 md:static transition-transform duration-250 flex flex-col justify-between ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div>
          {/* Logo Brand */}
          <div className="h-16 border-b border-slate-200 flex items-center gap-3 px-6">
            <div className="w-8 h-8 rounded-lg bg-sky-500 text-white flex items-center justify-center font-bold text-slate-800 border border-slate-300/30">
              P
            </div>
            <span className="text-[18px] font-bold tracking-tight text-slate-800">PATHSHALA</span>
          </div>

          {/* User Profile Summary */}
          <div className="p-4 border-b border-slate-200 flex items-center gap-3 bg-slate-50/40">
            <div className="w-9 h-9 bg-[#A855F7]/20 border border-[#A855F7]/40 rounded-full flex items-center justify-center text-[16px] font-bold text-slate-800">
              {user.first_name?.[0] || user.username?.[0]?.toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <div className="text-[16px] font-bold truncate text-slate-800">{user.first_name} {user.last_name || user.username}</div>
              <div className="text-[14px] text-slate-500 capitalize flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#EC4899]" />
                {user.role.replace("_", " ")}
              </div>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="p-4 space-y-1.5">
            {links.map((link, idx) => {
              const Icon = link.icon;
              return (
                <Link
                  key={idx}
                  href={link.href}
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-3 px-3 h-10 rounded-md bg-[#7C3AED]/10 hover:bg-[#7C3AED]/20 border border-[#7C3AED]/20 text-[16px] font-semibold text-slate-800 transition-all"
                >
                  <Icon size={16} className="text-slate-800" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Logout */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/20">
          {user.school_name && (
            <div className="mb-4 text-[13px] text-slate-800 truncate flex items-center gap-1.5">
              <School size={10} /> {user.school_name}
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full h-9 rounded-md border border-slate-200 hover:border-[#EF4444]/50 hover:bg-[#EF4444]/10 flex items-center justify-center gap-2 text-[16px] font-semibold text-slate-800 cursor-pointer transition-all"
          >
            <LogOut size={14} className="text-[#EF4444]" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Panel Content Area */}
      <main className="flex-1 overflow-x-hidden p-6 md:p-8 flex flex-col">
        {children}
      </main>
    </div>
  );
}
