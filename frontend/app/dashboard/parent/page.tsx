"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/services/api";
import { 
  Loader, 
  Award, 
  Calendar, 
  CreditCard, 
  User, 
  BookOpen, 
  AlertCircle,
  Clock
} from "lucide-react";

interface ChildSummary {
  id: number;
  name: string;
  roll_number: string;
  class_name: string;
  attendance_rate: string;
  pending_fee: number;
  avg_marks: number;
}

interface GradeRecord {
  id: number;
  exam_name: string;
  subject_name: string;
  marks_obtained: string;
  max_marks: string;
  remarks: string;
}

interface AttendanceRecord {
  id: number;
  date: string;
  status: string;
}

interface FeeRecord {
  id: number;
  amount_due: string;
  amount_paid: string;
  due_date: string;
  status: string;
}

export default function ParentDashboard() {
  const [loading, setLoading] = useState(true);
  const [children, setChildren] = useState<ChildSummary[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<number | null>(null);
  
  // Roster details
  const [results, setResults] = useState<GradeRecord[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [fees, setFees] = useState<FeeRecord[]>([]);
  
  const [activeSubTab, setActiveSubTab] = useState<"grades" | "attendance" | "fees">("grades");
  const [error, setError] = useState<string | null>(null);

  const fetchParentData = async () => {
    try {
      const dashboardRes = await api.get("/analytics/dashboard/");
      const kids = dashboardRes.data.children || [];
      setChildren(kids);
      
      if (kids.length > 0) {
        setSelectedChildId(kids[0].id);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParentData();
  }, []);

  // Fetch specific details when selected child changes
  useEffect(() => {
    if (!selectedChildId) return;

    async function fetchChildDetails() {
      try {
        // Fetch Results
        const resRes = await api.get(`/results/records/?student_id=${selectedChildId}`);
        setResults(resRes.data.filter((r: any) => r.student === selectedChildId));

        // Fetch Attendance
        const attRes = await api.get(`/attendance/records/?student_id=${selectedChildId}`);
        setAttendance(attRes.data.filter((a: any) => a.student === selectedChildId));

        // Fetch Fees
        const feeRes = await api.get(`/fees/records/?student_id=${selectedChildId}`);
        setFees(feeRes.data.filter((f: any) => f.student === selectedChildId));
      } catch (err) {
        console.error("Error fetching child details", err);
      }
    }
    
    fetchChildDetails();
  }, [selectedChildId]);

  const getSelectedChild = () => {
    return children.find(c => c.id === selectedChildId);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PAID":
        return <span className="px-2.5 py-0.5 rounded-full text-[14px] font-bold bg-green-500/10 text-green-400 border border-green-500/20">Paid</span>;
      case "PARTIAL":
        return <span className="px-2.5 py-0.5 rounded-full text-[14px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">Partial</span>;
      case "UNPAID":
        return <span className="px-2.5 py-0.5 rounded-full text-[14px] font-bold bg-[#EE313E]/10 text-[#EE313E] border border-[#EE313E]/20">Unpaid</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[14px] font-bold bg-slate-1000/10 text-slate-500 border border-gray-500/20">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center gap-2">
        <Loader className="animate-spin text-[#4753A4]" size={24} />
        <span className="text-[16px] text-slate-500">Loading student metrics tracker...</span>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col gap-8">
      {/* Title */}
      <div>
        <h1 className="text-[24px] font-bold tracking-tight text-slate-800">Parent Portal Console</h1>
        <p className="text-[16px] text-slate-500 mt-1">Review academic progress and check bills for your children.</p>
      </div>

      {error && (
        <div className="p-4 rounded-md bg-[#EE313E]/10 border border-[#EE313E]/30 flex gap-3 text-[16px] text-[#EE313E]">
          <AlertCircle size={16} className="shrink-0" />
          <div>{error}</div>
        </div>
      )}

      {children.length === 0 ? (
        <div className="glass-card bg-white border border-slate-200 rounded-lg p-8 text-center text-[16px] text-slate-500 font-mono">
          No student profiles are currently mapped to this parent account. Check with your school admin.
        </div>
      ) : (
        <div className="space-y-6">
          {/* Child Selector Row */}
          <div className="flex items-center gap-3 bg-white border border-slate-200 p-4 rounded-lg">
            <span className="text-[16px] font-bold text-slate-500">Selected Child:</span>
            <div className="flex flex-wrap gap-2">
              {children.map((child) => (
                <button
                  key={child.id}
                  onClick={() => setSelectedChildId(child.id)}
                  className={`px-4 py-2 rounded-md flex items-center gap-2 text-[16px] font-semibold border transition-all cursor-pointer ${selectedChildId === child.id ? "bg-sky-500 text-white border-slate-300 text-slate-800" : "border-slate-200 bg-white hover:bg-white"}`}
                >
                  <User size={12} className="text-slate-600" />
                  {child.name} ({child.class_name})
                </button>
              ))}
            </div>
          </div>

          {/* Quick Stats Summary */}
          {getSelectedChild() && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="glass-card bg-white border border-slate-200 p-5 rounded-lg">
                <span className="text-[14px] uppercase font-bold tracking-wider text-slate-500 block mb-1">Roster Attendance</span>
                <span className="text-[28px] font-extrabold text-slate-800">{getSelectedChild()?.attendance_rate}</span>
                <span className="text-[13px] text-slate-600 block mt-1">Class presence ratio</span>
              </div>
              <div className="glass-card bg-white border border-slate-200 p-5 rounded-lg">
                <span className="text-[14px] uppercase font-bold tracking-wider text-slate-500 block mb-1">Grade Average</span>
                <span className="text-[28px] font-extrabold text-slate-800">{getSelectedChild()?.avg_marks}%</span>
                <span className="text-[13px] text-slate-600 block mt-1">Average scored results</span>
              </div>
              <div className="glass-card bg-white border border-slate-200 p-5 rounded-lg">
                <span className="text-[14px] uppercase font-bold tracking-wider text-slate-500 block mb-1">Tuition Dues</span>
                <span className="text-[28px] font-extrabold text-[#EE313E]">₹{getSelectedChild()?.pending_fee?.toLocaleString()}</span>
                <span className="text-[13px] text-slate-600 block mt-1">Outstanding bills balance</span>
              </div>
            </div>
          )}

          {/* Detail Tab Menu */}
          <div className="glass-card bg-white border border-slate-200 rounded-lg p-6 flex-1 flex flex-col">
            <div className="flex gap-2 border-b border-slate-200 pb-2 mb-6">
              {[
                { id: "grades", label: "Gradebook Scores", icon: Award },
                { id: "attendance", label: "Attendance Calendar", icon: Calendar },
                { id: "fees", label: "Tuition Invoices", icon: CreditCard }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveSubTab(tab.id as any)}
                    className={`px-3 py-1.5 rounded-md flex items-center gap-2 text-[16px] font-semibold transition-all cursor-pointer ${activeSubTab === tab.id ? "bg-sky-500 text-white text-slate-800" : "text-slate-500 hover:text-slate-800"}`}
                  >
                    <Icon size={12} className="text-slate-600" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* GRADES TAB */}
            {activeSubTab === "grades" && (
              <div className="space-y-4">
                {results.length === 0 ? (
                  <div className="text-[16px] text-slate-500 font-mono p-4 text-center">No exam results published yet.</div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {results.map((res) => (
                      <div key={res.id} className="p-4 bg-white border border-slate-200 rounded-lg text-[16px] space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[18px] font-bold text-slate-800">{res.subject_name}</span>
                          <span className="px-2 py-0.5 rounded bg-sky-500 text-white/20 border border-[#4753A4]/30 text-slate-800 font-mono text-[13px] uppercase">{res.exam_name}</span>
                        </div>
                        <div className="border-t border-slate-200/50 pt-2 text-slate-500 space-y-1">
                          <div className="flex items-center justify-between">
                            <span>Score obtained:</span>
                            <span className="font-extrabold text-green-400">{res.marks_obtained} / {res.max_marks}</span>
                          </div>
                          {res.remarks && (
                            <div className="text-[14px] text-slate-500 italic mt-1 font-mono">
                              Remarks: {res.remarks}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ATTENDANCE TAB */}
            {activeSubTab === "attendance" && (
              <div className="space-y-2">
                {attendance.length === 0 ? (
                  <div className="text-[16px] text-slate-500 font-mono p-4 text-center">No attendance records found.</div>
                ) : (
                  <div className="max-h-[300px] overflow-y-auto space-y-2">
                    {attendance.map((att) => (
                      <div key={att.id} className="p-3 bg-white border border-slate-200 rounded flex justify-between items-center text-[16px]">
                        <span className="font-semibold text-slate-800">{new Date(att.date).toLocaleDateString()}</span>
                        {att.status === 'PRESENT' && <span className="px-2.5 py-0.5 rounded-full text-[13px] font-bold bg-green-500/10 text-green-400 border border-green-500/20">Present</span>}
                        {att.status === 'ABSENT' && <span className="px-2.5 py-0.5 rounded-full text-[13px] font-bold bg-[#EE313E]/10 text-[#EE313E] border border-[#EE313E]/20">Absent</span>}
                        {att.status === 'LATE' && <span className="px-2.5 py-0.5 rounded-full text-[13px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">Late</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* FEES BILLING TAB */}
            {activeSubTab === "fees" && (
              <div className="space-y-4">
                {fees.length === 0 ? (
                  <div className="text-[16px] text-slate-500 font-mono p-4 text-center">No invoices generated for this student.</div>
                ) : (
                  <div className="space-y-3">
                    {fees.map((fee) => (
                      <div key={fee.id} className="p-4 bg-white border border-slate-200 rounded-lg text-[16px] flex justify-between items-center">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[18px] font-bold text-slate-800">Tuition & Operations Fee</span>
                            {getStatusBadge(fee.status)}
                          </div>
                          <div className="text-[14px] text-slate-500">Due Deadline: {new Date(fee.due_date).toLocaleDateString()}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-[18px] font-extrabold text-slate-800">₹{parseFloat(fee.amount_due).toLocaleString()}</div>
                          <div className="text-[14px] text-green-400">Paid: ₹{parseFloat(fee.amount_paid).toLocaleString()}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
