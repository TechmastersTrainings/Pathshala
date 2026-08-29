"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/services/api";
import { 
  Loader, 
  School, 
  CheckCircle, 
  XCircle, 
  AlertOctagon, 
  TrendingUp, 
  DollarSign, 
  FileText,
  AlertCircle
} from "lucide-react";

interface StatItem {
  label: string;
  value: string | number;
  change: string;
  icon: string;
}

interface SchoolItem {
  id: number;
  name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  school_type: string;
  status: 'PENDING' | 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'SUBSCRIPTION_EXPIRED';
  created_at: string;
}

interface PaymentLog {
  school_name: string;
  amount: number;
  date: string;
}

interface SubscriptionItem {
  id: number;
  school_name: string;
  plan_name: string;
  start_date: string;
  end_date: string;
  status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED' | 'PENDING';
}

export default function SuperAdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<StatItem[]>([]);
  const [schools, setSchools] = useState<SchoolItem[]>([]);
  const [payments, setPayments] = useState<PaymentLog[]>([]);
  const [subscriptions, setSubscriptions] = useState<SubscriptionItem[]>([]);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      const statsRes = await api.get("/analytics/dashboard/");
      setStats(statsRes.data.stats || []);
      setPayments(statsRes.data.recent_payments || []);

      const schoolsRes = await api.get("/schools/schools/");
      setSchools(schoolsRes.data);

      const subsRes = await api.get("/schools/subscriptions/");
      setSubscriptions(subsRes.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch dashboard metrics. Check DB connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleStatusChange = async (schoolId: number, action: 'approve' | 'suspend' | 'deactivate') => {
    setActionLoading(schoolId);
    try {
      const response = await api.post(`/schools/schools/${schoolId}/${action}/`);
      if (response.data.success) {
        // Refetch to update data immediately
        await fetchDashboardData();
      }
    } catch (err) {
      alert("Error changing school status.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleSubscriptionToggle = async (subId: number, currentStatus: string) => {
    setActionLoading(subId);
    try {
      const newStatus = currentStatus === 'ACTIVE' ? 'CANCELLED' : 'ACTIVE';
      await api.patch(`/schools/subscriptions/${subId}/`, { status: newStatus });
      await fetchDashboardData();
    } catch (err) {
      alert("Error changing subscription status.");
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <span className="px-2.5 py-0.5 rounded-full text-[14px] font-bold bg-green-500/10 text-green-400 border border-green-500/20">Active</span>;
      case "PENDING":
        return <span className="px-2.5 py-0.5 rounded-full text-[14px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">Pending Approval</span>;
      case "SUSPENDED":
        return <span className="px-2.5 py-0.5 rounded-full text-[14px] font-bold bg-[#EE313E]/10 text-[#EE313E] border border-[#EE313E]/20">Suspended</span>;
      case "INACTIVE":
        return <span className="px-2.5 py-0.5 rounded-full text-[14px] font-bold bg-slate-1000/10 text-slate-500 border border-gray-500/20">Inactive</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[14px] font-bold bg-slate-1000/10 text-slate-500 border border-gray-500/20">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center gap-2">
        <Loader className="animate-spin text-[#4753A4]" size={24} />
        <span className="text-[16px] text-slate-500">Loading analytics indicators...</span>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col gap-8">
      {/* Title */}
      <div>
        <h1 className="text-[24px] font-bold tracking-tight text-slate-800">Super Admin Dashboard</h1>
        <p className="text-[16px] text-slate-500 mt-1">Global monitor console for Pathshala SaaS ecosystems.</p>
      </div>

      {error && (
        <div className="p-4 rounded-md bg-[#EE313E]/10 border border-[#EE313E]/30 flex gap-3 text-[16px] text-[#EE313E]">
          <AlertCircle size={16} className="shrink-0" />
          <div>{error}</div>
        </div>
      )}

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="glass-card bg-white border border-slate-200 p-5 rounded-lg flex flex-col justify-between min-h-[110px]">
            <div className="flex items-center justify-between">
              <span className="text-[14px] uppercase font-bold tracking-wider text-slate-500">{stat.label}</span>
              <div className="w-7 h-7 bg-white border border-slate-200 rounded flex items-center justify-center text-[16px] text-slate-600">
                {idx === 0 && <School size={14} />}
                {idx === 1 && <CheckCircle size={14} className="text-green-400" />}
                {idx === 2 && <AlertOctagon size={14} className="text-amber-400" />}
                {idx === 3 && <DollarSign size={14} className="text-[#E47C44]" />}
                {idx === 4 && <FileText size={14} className="text-[#3D67A4]" />}
              </div>
            </div>
            <div className="mt-2">
              <div className="text-[24px] font-extrabold text-slate-800">{stat.value}</div>
              <div className="text-[13px] text-slate-600 mt-1 font-semibold">{stat.change}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Schools Table Panel */}
        <div className="lg:col-span-2 glass-card bg-white border border-slate-200 rounded-lg p-6 flex flex-col">
          <h3 className="text-[16px] font-bold uppercase tracking-wider text-slate-600 border-b border-slate-200 pb-3 mb-4">
            Registered Educational Institutions
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[16px] border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold h-10">
                  <th className="pb-3">School Name</th>
                  <th className="pb-3">Location</th>
                  <th className="pb-3">Type</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {schools.length === 0 ? (
                  <tr className="h-20 text-slate-500">
                    <td colSpan={5} className="text-center font-mono">No school tenants found in the database.</td>
                  </tr>
                ) : (
                  schools.map((school) => (
                    <tr key={school.id} className="border-b border-slate-200/50 h-12 text-slate-800 hover:bg-white/30 transition-colors">
                      <td className="py-2">
                        <div className="font-semibold">{school.name}</div>
                        <div className="text-[14px] text-slate-500">{school.email}</div>
                      </td>
                      <td className="py-2 text-slate-500">{school.city}, {school.state}</td>
                      <td className="py-2 text-slate-500">{school.school_type}</td>
                      <td className="py-2">{getStatusBadge(school.status)}</td>
                      <td className="py-2 text-right">
                        {actionLoading === school.id ? (
                          <Loader className="animate-spin inline text-[#4753A4]" size={14} />
                        ) : (
                          <div className="flex justify-end gap-2">
                            {school.status !== 'ACTIVE' && (
                              <button
                                onClick={() => handleStatusChange(school.id, 'approve')}
                                className="px-2 py-1 bg-green-600/10 hover:bg-green-600/20 text-green-400 border border-green-500/20 rounded text-[14px] font-bold cursor-pointer"
                              >
                                Approve
                              </button>
                            )}
                            {school.status === 'ACTIVE' && (
                              <button
                                onClick={() => handleStatusChange(school.id, 'suspend')}
                                className="px-2 py-1 bg-[#EE313E]/10 hover:bg-[#EE313E]/20 text-[#EE313E] border border-[#EE313E]/20 rounded text-[14px] font-bold cursor-pointer"
                              >
                                Suspend
                              </button>
                            )}
                            {school.status !== 'INACTIVE' && (
                              <button
                                onClick={() => handleStatusChange(school.id, 'deactivate')}
                                className="px-2 py-1 border border-slate-200 hover:border-gray-500 rounded text-[14px] font-semibold text-slate-500 cursor-pointer"
                              >
                                Disable
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Audit / Payments logs Panel */}
        <div className="glass-card bg-white border border-slate-200 rounded-lg p-6 flex flex-col">
          <h3 className="text-[16px] font-bold uppercase tracking-wider text-slate-600 border-b border-slate-200 pb-3 mb-4">
            Recent Subscription Receipts
          </h3>

          <div className="space-y-4 flex-1 overflow-y-auto">
            {payments.length === 0 ? (
              <div className="h-full flex items-center justify-center text-[16px] text-slate-500 font-mono">
                No recent transactions.
              </div>
            ) : (
              payments.map((p, idx) => (
                <div key={idx} className="p-3 bg-white border border-slate-200 rounded flex justify-between items-center">
                  <div>
                    <div className="text-[16px] font-bold truncate max-w-[150px]">{p.school_name}</div>
                    <div className="text-[13px] text-slate-500 mt-1">{new Date(p.date).toLocaleString()}</div>
                  </div>
                  <div className="text-[16px] font-extrabold text-green-400">
                    +₹{p.amount.toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Subscriptions Grid Split */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mt-2">
        {/* Subscriptions Table Panel */}
        <div className="glass-card bg-white border border-slate-200 rounded-lg p-6 flex flex-col">
          <h3 className="text-[16px] font-bold uppercase tracking-wider text-slate-600 border-b border-slate-200 pb-3 mb-4 flex justify-between">
            <span>Subscription Management</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[16px] border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold h-10">
                  <th className="pb-3">School Name</th>
                  <th className="pb-3">Plan</th>
                  <th className="pb-3">Start Date</th>
                  <th className="pb-3">End Date</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.length === 0 ? (
                  <tr className="h-20 text-slate-500">
                    <td colSpan={6} className="text-center font-mono">No subscriptions found.</td>
                  </tr>
                ) : (
                  subscriptions.map((sub) => (
                    <tr key={sub.id} className="border-b border-slate-200/50 h-12 text-slate-800 hover:bg-white/30 transition-colors">
                      <td className="py-2 font-semibold">{sub.school_name}</td>
                      <td className="py-2 text-slate-500">{sub.plan_name}</td>
                      <td className="py-2 text-slate-500">{sub.start_date}</td>
                      <td className="py-2 text-slate-500">{sub.end_date}</td>
                      <td className="py-2">{getStatusBadge(sub.status)}</td>
                      <td className="py-2 text-right">
                        {actionLoading === sub.id ? (
                          <Loader className="animate-spin inline text-[#4753A4]" size={14} />
                        ) : (
                          <button
                            onClick={() => handleSubscriptionToggle(sub.id, sub.status)}
                            className="px-2 py-1 border border-slate-200 hover:border-gray-500 rounded text-[14px] font-semibold text-slate-500 cursor-pointer"
                          >
                            Toggle Status
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
