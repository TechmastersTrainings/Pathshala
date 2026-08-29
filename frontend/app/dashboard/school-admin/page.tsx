"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/services/api";
import { 
  Loader, 
  Users, 
  BookOpen, 
  Calendar, 
  CreditCard, 
  Bell, 
  Bus, 
  UserCheck, 
  Plus, 
  Trash, 
  Award, 
  Check, 
  X,
  Volume2
} from "lucide-react";

interface ClassItem {
  id: number;
  name: string;
  section: string;
}

interface StudentItem {
  id: number;
  name: string;
  roll_number: string;
  admission_number: string;
  class_obj: number;
  class_name?: string;
  class_section?: string;
}

interface FacultyItem {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  employee_id: string;
  qualification: string;
  experience_years: number;
  status: 'PENDING' | 'ACTIVE' | 'INACTIVE' | 'REJECTED';
}

interface FeeItem {
  id: number;
  student_name: string;
  roll_number: string;
  class_name: string;
  class_section: string;
  amount_due: string;
  amount_paid: string;
  due_date: string;
  status: 'PAID' | 'PARTIAL' | 'UNPAID';
}

interface RouteItem {
  id: number;
  route_name: string;
  vehicle_number: string;
  driver_name: string;
  driver_phone: string;
}

interface ExamItem {
  id: number;
  name: string;
  exam_date: string;
}

interface HolidayItem {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
}

export default function SchoolAdminDashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "students" | "faculty" | "classes" | "fees" | "transport" | "alerts" | "exams" | "holidays">("overview");
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<any>(null);
  
  // Lists
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [faculty, setFaculty] = useState<FacultyItem[]>([]);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [fees, setFees] = useState<FeeItem[]>([]);
  const [routes, setRoutes] = useState<RouteItem[]>([]);
  const [exams, setExams] = useState<ExamItem[]>([]);
  const [holidays, setHolidays] = useState<HolidayItem[]>([]);
  
  // Loading sub-indicators
  const [subLoading, setSubLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form inputs
  const [newStudent, setNewStudent] = useState({ name: "", roll_number: "", admission_number: "", class_id: "" });
  const [newClass, setNewClass] = useState({ name: "", section: "" });
  const [newRoute, setNewRoute] = useState({ route_name: "", vehicle_number: "", driver_name: "", driver_phone: "" });
  const [newFee, setNewFee] = useState({ student_id: "", amount_due: "", due_date: "" });
  const [newAlert, setNewAlert] = useState({ title: "", message: "", recipient_role: "ALL" });
  
  const [newFaculty, setNewFaculty] = useState({ first_name: "", last_name: "", email: "", password: "", employee_id: "", qualification: "", experience_years: "" });
  
  const [newExam, setNewExam] = useState({ name: "", exam_date: "" });
  const [newHoliday, setNewHoliday] = useState({ name: "", start_date: "", end_date: "" });
  
  const [paymentAmount, setPaymentAmount] = useState<{ [key: number]: string }>({});

  const loadAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch Analytics
      const analRes = await api.get("/analytics/dashboard/");
      setAnalytics(analRes.data);

      // 2. Fetch Classes
      const classRes = await api.get("/students/classes/");
      setClasses(classRes.data);

      // 3. Fetch Students
      const studRes = await api.get("/students/students/");
      setStudents(studRes.data);

      // 4. Fetch Faculty
      const facRes = await api.get("/faculty/profiles/");
      setFaculty(facRes.data);

      // 5. Fetch Fees
      const feeRes = await api.get("/fees/records/");
      setFees(feeRes.data);

      // 6. Fetch Transport Routes
      const transRes = await api.get("/transport/routes/");
      setRoutes(transRes.data);

      // 7. Fetch Exams
      const examRes = await api.get("/exams/records/");
      setExams(examRes.data);

      // 8. Fetch Holidays
      const holRes = await api.get("/holidays/records/");
      setHolidays(holRes.data);
    } catch (err) {
      console.error(err);
      setError("Error synchronizing databases. Ensure settings are active.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // CRUD actions
  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.name || !newStudent.roll_number || !newStudent.admission_number || !newStudent.class_id) {
      alert("All fields are required.");
      return;
    }
    setSubLoading(true);
    try {
      await api.post("/students/students/", {
        name: newStudent.name,
        roll_number: newStudent.roll_number,
        admission_number: newStudent.admission_number,
        class_obj: parseInt(newStudent.class_id)
      });
      setNewStudent({ name: "", roll_number: "", admission_number: "", class_id: "" });
      await loadAllData();
    } catch (err) {
      alert("Error adding student. Admission numbers must be unique.");
    } finally {
      setSubLoading(false);
    }
  };

  const handleDeleteStudent = async (id: number) => {
    if (!confirm("Are you sure you want to delete this student record?")) return;
    setSubLoading(true);
    try {
      await api.delete(`/students/students/${id}/`);
      await loadAllData();
    } catch (err) {
      alert("Error deleting student.");
    } finally {
      setSubLoading(false);
    }
  };

  const handleFacultyAction = async (id: number, action: 'approve' | 'reject' | 'toggle_status') => {
    setSubLoading(true);
    try {
      await api.post(`/faculty/profiles/${id}/${action}/`);
      await loadAllData();
    } catch (err) {
      alert("Error updating teacher status.");
    } finally {
      setSubLoading(false);
    }
  };

  const handleAddFaculty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFaculty.first_name || !newFaculty.email || !newFaculty.password || !newFaculty.employee_id) return;
    setSubLoading(true);
    try {
      await api.post("/faculty/profiles/", {
        ...newFaculty,
        experience_years: parseInt(newFaculty.experience_years) || 0
      });
      setNewFaculty({ first_name: "", last_name: "", email: "", password: "", employee_id: "", qualification: "", experience_years: "" });
      await loadAllData();
    } catch (err) {
      alert("Error creating faculty account. Email or Employee ID might be in use.");
    } finally {
      setSubLoading(false);
    }
  };

  const handleAddClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClass.name || !newClass.section) return;
    setSubLoading(true);
    try {
      await api.post("/students/classes/", newClass);
      setNewClass({ name: "", section: "" });
      await loadAllData();
    } catch (err) {
      alert("Error creating class. Name and section combinations must be unique.");
    } finally {
      setSubLoading(false);
    }
  };

  const handleAddRoute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoute.route_name || !newRoute.vehicle_number || !newRoute.driver_name || !newRoute.driver_phone) return;
    setSubLoading(true);
    try {
      await api.post("/transport/routes/", newRoute);
      setNewRoute({ route_name: "", vehicle_number: "", driver_name: "", driver_phone: "" });
      await loadAllData();
    } catch (err) {
      alert("Error adding route.");
    } finally {
      setSubLoading(false);
    }
  };

  const handleAddFee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFee.student_id || !newFee.amount_due || !newFee.due_date) return;
    setSubLoading(true);
    try {
      await api.post("/fees/records/", {
        student: parseInt(newFee.student_id),
        amount_due: newFee.amount_due,
        due_date: newFee.due_date
      });
      setNewFee({ student_id: "", amount_due: "", due_date: "" });
      await loadAllData();
    } catch (err) {
      alert("Error adding fee bill.");
    } finally {
      setSubLoading(false);
    }
  };

  const handleCollectPayment = async (feeId: number) => {
    const amount = paymentAmount[feeId];
    if (!amount) return;
    setSubLoading(true);
    try {
      await api.post(`/fees/records/${feeId}/collect_payment/`, {
        amount_paid: amount
      });
      setPaymentAmount(prev => ({ ...prev, [feeId]: "" }));
      await loadAllData();
    } catch (err) {
      alert("Error collecting payment.");
    } finally {
      setSubLoading(false);
    }
  };

  const handleSendAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAlert.title || !newAlert.message) return;
    setSubLoading(true);
    try {
      await api.post("/notifications/records/", newAlert);
      setNewAlert({ title: "", message: "", recipient_role: "ALL" });
      alert("Notice broadcast sent successfully!");
    } catch (err) {
      alert("Error posting notification.");
    } finally {
      setSubLoading(false);
    }
  };

  const handleAddExam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExam.name || !newExam.exam_date) return;
    setSubLoading(true);
    try {
      await api.post("/exams/records/", newExam);
      setNewExam({ name: "", exam_date: "" });
      await loadAllData();
    } catch (err) {
      alert("Error adding exam.");
    } finally {
      setSubLoading(false);
    }
  };

  const handleAddHoliday = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHoliday.name || !newHoliday.start_date || !newHoliday.end_date) return;
    setSubLoading(true);
    try {
      await api.post("/holidays/records/", newHoliday);
      setNewHoliday({ name: "", start_date: "", end_date: "" });
      await loadAllData();
    } catch (err) {
      alert("Error adding holiday.");
    } finally {
      setSubLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center gap-2">
        <Loader className="animate-spin text-[#4753A4]" size={24} />
        <span className="text-[16px] text-slate-500">Loading school analytics dashboard...</span>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col gap-8">
      {/* Header bar with subloading states */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[24px] font-bold tracking-tight text-slate-800">School Admin Console</h1>
          <p className="text-[16px] text-slate-500 mt-1">
            Managing school: <span className="text-slate-600 font-bold">{analytics?.school_name}</span>
          </p>
        </div>
        {subLoading && (
          <div className="flex items-center gap-2 text-[16px] text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-full">
            <Loader className="animate-spin text-[#4753A4]" size={12} /> Syncing...
          </div>
        )}
      </div>

      {/* Tabs Menu */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        {[
          { id: "overview", label: "Overview", icon: BookOpen },
          { id: "students", label: "Students", icon: Users },
          { id: "faculty", label: "Faculty", icon: UserCheck },
          { id: "classes", label: "Classes", icon: Calendar },
          { id: "fees", label: "Fees", icon: CreditCard },
          { id: "transport", label: "Transport", icon: Bus },
          { id: "alerts", label: "Alerts", icon: Bell },
          { id: "exams", label: "Exams", icon: Award },
          { id: "holidays", label: "Holidays", icon: Calendar }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-md flex items-center gap-2 text-[16px] font-semibold border transition-all cursor-pointer ${activeTab === tab.id ? "bg-sky-500 text-white border-slate-300 text-slate-800" : "border-slate-200 bg-white hover:bg-[#1E2235]"}`}
            >
              <Icon size={14} className="text-slate-600" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* OVERVIEW PANEL */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {analytics?.stats?.map((stat: any, idx: number) => (
              <div key={idx} className="glass-card bg-white border border-slate-200 p-5 rounded-lg flex flex-col justify-between min-h-[110px]">
                <span className="text-[14px] uppercase font-bold tracking-wider text-slate-500">{stat.label}</span>
                <div className="mt-2">
                  <div className="text-[24px] font-extrabold text-slate-800">{stat.value}</div>
                  <div className="text-[13px] text-slate-600 mt-1 font-semibold">{stat.change}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Quick Summary Class Count */}
            <div className="glass-card bg-white border border-slate-200 rounded-lg p-6">
              <h3 className="text-[16px] font-bold uppercase tracking-wider text-slate-600 border-b border-slate-200 pb-3 mb-4">Class Roster Summary</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {classes.length === 0 ? (
                  <div className="text-[16px] text-slate-500 font-mono">No cohorts configured yet.</div>
                ) : (
                  classes.map((cls) => {
                    const count = students.filter(s => s.class_obj === cls.id).length;
                    return (
                      <div key={cls.id} className="p-3 bg-white border border-slate-200 rounded flex justify-between items-center text-[16px]">
                        <span className="font-semibold">{cls.name} (Section {cls.section})</span>
                        <span className="px-2 py-0.5 rounded bg-sky-500 text-white/20 border border-[#4753A4]/30 text-slate-800 font-mono">{count} Students</span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Quick Pending Approvals */}
            <div className="glass-card bg-white border border-slate-200 rounded-lg p-6">
              <h3 className="text-[16px] font-bold uppercase tracking-wider text-slate-600 border-b border-slate-200 pb-3 mb-4">Pending Faculty Registrations</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {faculty.filter(f => f.status === 'PENDING').length === 0 ? (
                  <div className="text-[16px] text-slate-500 font-mono">No pending applications at this time.</div>
                ) : (
                  faculty.filter(f => f.status === 'PENDING').map((fac) => (
                    <div key={fac.id} className="p-3 bg-white border border-slate-200 rounded flex justify-between items-center text-[16px]">
                      <div>
                        <div className="font-semibold">{fac.first_name} {fac.last_name || fac.username}</div>
                        <div className="text-[14px] text-slate-500">{fac.employee_id} • {fac.qualification}</div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleFacultyAction(fac.id, 'approve')}
                          className="p-1 px-2.5 bg-green-600/10 text-green-400 border border-green-500/20 hover:bg-green-600/20 rounded font-bold cursor-pointer"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleFacultyAction(fac.id, 'reject')}
                          className="p-1 px-2.5 bg-[#EE313E]/10 text-[#EE313E] border border-[#EE313E]/20 hover:bg-[#EE313E]/20 rounded font-bold cursor-pointer"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STUDENTS DIRECTORY */}
      {activeTab === "students" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* List panel */}
          <div className="lg:col-span-2 glass-card bg-white border border-slate-200 rounded-lg p-6">
            <h3 className="text-[16px] font-bold uppercase tracking-wider text-slate-600 border-b border-slate-200 pb-3 mb-4">Student Registry Directory</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[16px]">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-semibold h-10">
                    <th>Name</th>
                    <th>Roll No</th>
                    <th>Admission No</th>
                    <th>Cohort Class</th>
                    <th className="text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {students.length === 0 ? (
                    <tr className="h-20 text-slate-500">
                      <td colSpan={5} className="text-center font-mono">No students registered yet.</td>
                    </tr>
                  ) : (
                    students.map((student) => (
                      <tr key={student.id} className="border-b border-slate-200/50 h-12 text-slate-800">
                        <td className="font-semibold">{student.name}</td>
                        <td className="font-mono text-slate-500">{student.roll_number}</td>
                        <td className="font-mono text-slate-500">{student.admission_number}</td>
                        <td className="text-slate-500">{student.class_name}-{student.class_section}</td>
                        <td className="text-right">
                          <button
                            onClick={() => handleDeleteStudent(student.id)}
                            className="p-1 bg-[#EE313E]/10 hover:bg-[#EE313E]/20 text-[#EE313E] border border-[#EE313E]/20 rounded cursor-pointer"
                          >
                            <Trash size={12} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Creation panel */}
          <div className="glass-card bg-white border border-slate-200 rounded-lg p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-[16px] font-bold uppercase tracking-wider text-slate-600 border-b border-slate-200 pb-3 mb-4">Admit New Student</h3>
              <form onSubmit={handleAddStudent} className="space-y-4">
                <div>
                  <label className="block text-[14px] font-semibold text-slate-500 mb-1">Student Full Name *</label>
                  <input
                    type="text"
                    value={newStudent.name}
                    onChange={(e) => setNewStudent(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Sachin Kumar"
                    className="w-full h-9 px-3 bg-white border border-slate-200 rounded text-[16px] focus:outline-none focus:border-slate-300"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[14px] font-semibold text-slate-500 mb-1">Roll Number *</label>
                  <input
                    type="text"
                    value={newStudent.roll_number}
                    onChange={(e) => setNewStudent(prev => ({ ...prev, roll_number: e.target.value }))}
                    placeholder="2026-A45"
                    className="w-full h-9 px-3 bg-white border border-slate-200 rounded text-[16px] focus:outline-none focus:border-slate-300"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[14px] font-semibold text-slate-500 mb-1">Admission Number *</label>
                  <input
                    type="text"
                    value={newStudent.admission_number}
                    onChange={(e) => setNewStudent(prev => ({ ...prev, admission_number: e.target.value }))}
                    placeholder="ADM99238"
                    className="w-full h-9 px-3 bg-white border border-slate-200 rounded text-[16px] focus:outline-none focus:border-slate-300"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[14px] font-semibold text-slate-500 mb-1">Assign Class Cohort *</label>
                  <select
                    value={newStudent.class_id}
                    onChange={(e) => setNewStudent(prev => ({ ...prev, class_id: e.target.value }))}
                    className="w-full h-9 px-2 bg-white border border-slate-200 rounded text-[16px] focus:outline-none focus:border-slate-300"
                    required
                  >
                    <option value="">-- Choose Class --</option>
                    {classes.map(c => (
                      <option key={c.id} value={c.id}>{c.name} - {c.section}</option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full h-9 mt-4 bg-sky-500 text-white hover:bg-sky-600 text-[16px] font-semibold rounded border border-slate-300 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Plus size={14} /> Register Admission
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* FACULTY MEMBERS APPROVAL & CREATION */}
      {activeTab === "faculty" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass-card bg-white border border-slate-200 rounded-lg p-6">
            <h3 className="text-[16px] font-bold uppercase tracking-wider text-slate-600 border-b border-slate-200 pb-3 mb-4">Faculty registry & Approval workflow</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[16px]">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-semibold h-10">
                    <th>Full Name</th>
                    <th>Employee ID</th>
                    <th>Qualification</th>
                    <th>Experience</th>
                    <th>Status</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {faculty.length === 0 ? (
                    <tr className="h-20 text-slate-500">
                      <td colSpan={6} className="text-center font-mono">No teacher profiles registered.</td>
                    </tr>
                  ) : (
                    faculty.map((fac) => (
                      <tr key={fac.id} className="border-b border-slate-200/50 h-12 text-slate-800">
                        <td>
                          <div className="font-semibold">{fac.first_name} {fac.last_name || fac.username}</div>
                          <div className="text-[14px] text-slate-500">{fac.email}</div>
                        </td>
                        <td className="font-mono text-slate-500">{fac.employee_id}</td>
                        <td>{fac.qualification}</td>
                        <td>{fac.experience_years} Years</td>
                        <td>
                          {fac.status === 'ACTIVE' && <span className="px-2 py-0.5 rounded text-[13px] font-bold bg-green-500/10 text-green-400 border border-green-500/20">Active</span>}
                          {fac.status === 'PENDING' && <span className="px-2 py-0.5 rounded text-[13px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">Pending Admin Approval</span>}
                          {fac.status === 'INACTIVE' && <span className="px-2 py-0.5 rounded text-[13px] font-bold bg-slate-1000/10 text-slate-500 border border-gray-500/20">Inactive</span>}
                          {fac.status === 'REJECTED' && <span className="px-2 py-0.5 rounded text-[13px] font-bold bg-red-500/10 text-red-400 border border-red-500/20">Rejected</span>}
                        </td>
                        <td className="text-right">
                          <div className="flex justify-end gap-2">
                            {fac.status === 'PENDING' && (
                              <>
                                <button
                                  onClick={() => handleFacultyAction(fac.id, 'approve')}
                                  className="px-2 h-7 bg-green-600/10 hover:bg-green-600/20 text-green-400 border border-green-500/20 rounded text-[14px] font-semibold cursor-pointer"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleFacultyAction(fac.id, 'reject')}
                                  className="px-2 h-7 bg-[#EE313E]/10 hover:bg-[#EE313E]/20 text-[#EE313E] border border-[#EE313E]/20 rounded text-[14px] font-semibold cursor-pointer"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                            {fac.status !== 'PENDING' && fac.status !== 'REJECTED' && (
                              <button
                                onClick={() => handleFacultyAction(fac.id, 'toggle_status')}
                                className={`px-2 h-7 rounded text-[14px] font-semibold border cursor-pointer ${fac.status === 'ACTIVE' ? "border-[#EE313E]/30 text-[#EE313E] hover:bg-[#EE313E]/10" : "border-green-500/30 text-green-400 hover:bg-green-500/10"}`}
                              >
                                {fac.status === 'ACTIVE' ? "Suspend" : "Activate"}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Creation panel */}
          <div className="glass-card bg-white border border-slate-200 rounded-lg p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-[16px] font-bold uppercase tracking-wider text-slate-600 border-b border-slate-200 pb-3 mb-4">Onboard New Faculty</h3>
              <form onSubmit={handleAddFaculty} className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[14px] font-semibold text-slate-500 mb-1">First Name *</label>
                    <input
                      type="text"
                      value={newFaculty.first_name}
                      onChange={(e) => setNewFaculty(prev => ({ ...prev, first_name: e.target.value }))}
                      className="w-full h-9 px-3 bg-white border border-slate-200 rounded text-[16px] focus:outline-none focus:border-slate-300"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[14px] font-semibold text-slate-500 mb-1">Last Name</label>
                    <input
                      type="text"
                      value={newFaculty.last_name}
                      onChange={(e) => setNewFaculty(prev => ({ ...prev, last_name: e.target.value }))}
                      className="w-full h-9 px-3 bg-white border border-slate-200 rounded text-[16px] focus:outline-none focus:border-slate-300"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[14px] font-semibold text-slate-500 mb-1">Email Address *</label>
                  <input
                    type="email"
                    value={newFaculty.email}
                    onChange={(e) => setNewFaculty(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full h-9 px-3 bg-white border border-slate-200 rounded text-[16px] focus:outline-none focus:border-slate-300"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[14px] font-semibold text-slate-500 mb-1">Login Password *</label>
                  <input
                    type="password"
                    value={newFaculty.password}
                    onChange={(e) => setNewFaculty(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Enter starting password"
                    className="w-full h-9 px-3 bg-white border border-slate-200 rounded text-[16px] focus:outline-none focus:border-slate-300"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[14px] font-semibold text-slate-500 mb-1">Employee ID *</label>
                  <input
                    type="text"
                    value={newFaculty.employee_id}
                    onChange={(e) => setNewFaculty(prev => ({ ...prev, employee_id: e.target.value }))}
                    className="w-full h-9 px-3 bg-white border border-slate-200 rounded text-[16px] focus:outline-none focus:border-slate-300"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[14px] font-semibold text-slate-500 mb-1">Qualification</label>
                    <input
                      type="text"
                      value={newFaculty.qualification}
                      onChange={(e) => setNewFaculty(prev => ({ ...prev, qualification: e.target.value }))}
                      className="w-full h-9 px-3 bg-white border border-slate-200 rounded text-[16px] focus:outline-none focus:border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block text-[14px] font-semibold text-slate-500 mb-1">Experience (Years)</label>
                    <input
                      type="number"
                      value={newFaculty.experience_years}
                      onChange={(e) => setNewFaculty(prev => ({ ...prev, experience_years: e.target.value }))}
                      className="w-full h-9 px-3 bg-white border border-slate-200 rounded text-[16px] focus:outline-none focus:border-slate-300"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full h-9 mt-4 bg-sky-500 text-white hover:bg-sky-600 text-[16px] font-semibold rounded border border-slate-300 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Plus size={14} /> Register Faculty
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* CLASSROOM COHORTS SETUP */}
      {activeTab === "classes" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass-card bg-white border border-slate-200 rounded-lg p-6">
            <h3 className="text-[16px] font-bold uppercase tracking-wider text-slate-600 border-b border-slate-200 pb-3 mb-4">Configured Classroom Cohorts</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {classes.length === 0 ? (
                <div className="col-span-2 text-[16px] text-slate-500 font-mono">No cohorts configured yet. Setup using the pane on the right.</div>
              ) : (
                classes.map((c) => (
                  <div key={c.id} className="p-4 bg-white border border-slate-200 rounded-lg flex items-center justify-between">
                    <div>
                      <div className="text-[18px] font-bold text-slate-800">{c.name}</div>
                      <div className="text-[14px] text-slate-500 mt-1 uppercase tracking-wider">Section {c.section}</div>
                    </div>
                    <span className="text-[14px] text-slate-600 font-bold bg-sky-50 px-2 py-1 rounded">Cohort active</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="glass-card bg-white border border-slate-200 rounded-lg p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-[16px] font-bold uppercase tracking-wider text-slate-600 border-b border-slate-200 pb-3 mb-4">Create Classroom Cohort</h3>
              <form onSubmit={handleAddClass} className="space-y-4">
                <div>
                  <label className="block text-[14px] font-semibold text-slate-500 mb-1">Class Code Name *</label>
                  <input
                    type="text"
                    value={newClass.name}
                    onChange={(e) => setNewClass(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Class 10"
                    className="w-full h-9 px-3 bg-white border border-slate-200 rounded text-[16px] focus:outline-none focus:border-slate-300"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[14px] font-semibold text-slate-500 mb-1">Section Identifier *</label>
                  <input
                    type="text"
                    value={newClass.section}
                    onChange={(e) => setNewClass(prev => ({ ...prev, section: e.target.value }))}
                    placeholder="A / B / Delta"
                    className="w-full h-9 px-3 bg-white border border-slate-200 rounded text-[16px] focus:outline-none focus:border-slate-300"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full h-9 mt-4 bg-sky-500 text-white hover:bg-sky-600 text-[16px] font-semibold rounded border border-slate-300 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Plus size={14} /> Add Cohort
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* TUITION FEES MANAGER */}
      {activeTab === "fees" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass-card bg-white border border-slate-200 rounded-lg p-6">
            <h3 className="text-[16px] font-bold uppercase tracking-wider text-slate-600 border-b border-slate-200 pb-3 mb-4">Student Invoices & Bills</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[16px]">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-semibold h-10">
                    <th>Student Details</th>
                    <th>Cohort Class</th>
                    <th>Due Amount</th>
                    <th>Paid</th>
                    <th>Status</th>
                    <th className="text-right">Record Payment</th>
                  </tr>
                </thead>
                <tbody>
                  {fees.length === 0 ? (
                    <tr className="h-20 text-slate-500">
                      <td colSpan={6} className="text-center font-mono">No bills generated.</td>
                    </tr>
                  ) : (
                    fees.map((fee) => (
                      <tr key={fee.id} className="border-b border-slate-200/50 h-12 text-slate-800">
                        <td>
                          <div className="font-semibold">{fee.student_name}</div>
                          <div className="text-[13px] text-slate-500 font-mono">{fee.roll_number}</div>
                        </td>
                        <td className="text-slate-500">{fee.class_name}-{fee.class_section}</td>
                        <td className="font-mono text-slate-500">₹{parseFloat(fee.amount_due).toLocaleString()}</td>
                        <td className="font-mono text-green-400">₹{parseFloat(fee.amount_paid).toLocaleString()}</td>
                        <td>
                          {fee.status === 'PAID' && <span className="px-2 py-0.5 rounded text-[13px] font-bold bg-green-500/10 text-green-400 border border-green-500/20">Paid</span>}
                          {fee.status === 'PARTIAL' && <span className="px-2 py-0.5 rounded text-[13px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">Partial</span>}
                          {fee.status === 'UNPAID' && <span className="px-2 py-0.5 rounded text-[13px] font-bold bg-[#EE313E]/10 text-[#EE313E] border border-[#EE313E]/20">Unpaid</span>}
                        </td>
                        <td className="text-right py-2">
                          {fee.status !== 'PAID' && (
                            <div className="flex justify-end items-center gap-1">
                              <input
                                type="number"
                                value={paymentAmount[fee.id] || ""}
                                onChange={(e) => setPaymentAmount(prev => ({ ...prev, [fee.id]: e.target.value }))}
                                placeholder="Amount"
                                className="w-16 h-7 px-1 bg-white border border-slate-200 rounded text-[14px] text-slate-800 text-right focus:outline-none"
                              />
                              <button
                                onClick={() => handleCollectPayment(fee.id)}
                                className="px-2 h-7 bg-green-600/10 hover:bg-green-600/20 text-green-400 border border-green-500/20 rounded text-[14px] font-semibold cursor-pointer"
                              >
                                Collect
                              </button>
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

          <div className="glass-card bg-white border border-slate-200 rounded-lg p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-[16px] font-bold uppercase tracking-wider text-slate-600 border-b border-slate-200 pb-3 mb-4">Generate Student Invoice</h3>
              <form onSubmit={handleAddFee} className="space-y-4">
                <div>
                  <label className="block text-[14px] font-semibold text-slate-500 mb-1">Select Student *</label>
                  <select
                    value={newFee.student_id}
                    onChange={(e) => setNewFee(prev => ({ ...prev, student_id: e.target.value }))}
                    className="w-full h-9 px-2 bg-white border border-slate-200 rounded text-[16px] focus:outline-none"
                    required
                  >
                    <option value="">-- Choose Student --</option>
                    {students.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.roll_number})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[14px] font-semibold text-slate-500 mb-1">Due Amount (INR) *</label>
                  <input
                    type="number"
                    value={newFee.amount_due}
                    onChange={(e) => setNewFee(prev => ({ ...prev, amount_due: e.target.value }))}
                    placeholder="12500"
                    className="w-full h-9 px-3 bg-white border border-slate-200 rounded text-[16px] focus:outline-none focus:border-slate-300"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[14px] font-semibold text-slate-500 mb-1">Payment Due Date *</label>
                  <input
                    type="date"
                    value={newFee.due_date}
                    onChange={(e) => setNewFee(prev => ({ ...prev, due_date: e.target.value }))}
                    className="w-full h-9 px-3 bg-white border border-slate-200 rounded text-[16px] focus:outline-none focus:border-slate-300"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full h-9 mt-4 bg-sky-500 text-white hover:bg-sky-600 text-[16px] font-semibold rounded border border-slate-300 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Plus size={14} /> Create Invoice
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* TRANSPORT BUS ROUTES */}
      {activeTab === "transport" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass-card bg-white border border-slate-200 rounded-lg p-6">
            <h3 className="text-[16px] font-bold uppercase tracking-wider text-slate-600 border-b border-slate-200 pb-3 mb-4">School Bus Fleet Routes</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {routes.length === 0 ? (
                <div className="col-span-2 text-[16px] text-slate-500 font-mono">No fleet vehicles configured yet.</div>
              ) : (
                routes.map((r) => (
                  <div key={r.id} className="p-4 bg-white border border-slate-200 rounded-lg text-[16px] space-y-2">
                    <div className="flex items-center gap-2 text-[18px] font-bold text-slate-800">
                      <Bus size={16} className="text-[#E47C44]" />
                      {r.route_name}
                    </div>
                    <div className="border-t border-slate-200/50 pt-2 text-slate-500 space-y-1">
                      <div>Plate: <span className="font-mono text-slate-800">{r.vehicle_number}</span></div>
                      <div>Driver: <span className="text-slate-800 font-medium">{r.driver_name}</span> ({r.driver_phone})</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="glass-card bg-white border border-slate-200 rounded-lg p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-[16px] font-bold uppercase tracking-wider text-slate-600 border-b border-slate-200 pb-3 mb-4">Add Bus Route Details</h3>
              <form onSubmit={handleAddRoute} className="space-y-4">
                <div>
                  <label className="block text-[14px] font-semibold text-slate-500 mb-1">Route Name *</label>
                  <input
                    type="text"
                    value={newRoute.route_name}
                    onChange={(e) => setNewRoute(prev => ({ ...prev, route_name: e.target.value }))}
                    placeholder="Route B4 - South Extension"
                    className="w-full h-9 px-3 bg-white border border-slate-200 rounded text-[16px] focus:outline-none focus:border-slate-300"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[14px] font-semibold text-slate-500 mb-1">Vehicle Plate Number *</label>
                  <input
                    type="text"
                    value={newRoute.vehicle_number}
                    onChange={(e) => setNewRoute(prev => ({ ...prev, vehicle_number: e.target.value }))}
                    placeholder="DL 3C AB 9988"
                    className="w-full h-9 px-3 bg-white border border-slate-200 rounded text-[16px] focus:outline-none focus:border-slate-300"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[14px] font-semibold text-slate-500 mb-1">Driver Full Name *</label>
                  <input
                    type="text"
                    value={newRoute.driver_name}
                    onChange={(e) => setNewRoute(prev => ({ ...prev, driver_name: e.target.value }))}
                    placeholder="Rajesh Kumar"
                    className="w-full h-9 px-3 bg-white border border-slate-200 rounded text-[16px] focus:outline-none focus:border-slate-300"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[14px] font-semibold text-slate-500 mb-1">Driver Contact Phone *</label>
                  <input
                    type="tel"
                    value={newRoute.driver_phone}
                    onChange={(e) => setNewRoute(prev => ({ ...prev, driver_phone: e.target.value }))}
                    placeholder="+91 91111 22222"
                    className="w-full h-9 px-3 bg-white border border-slate-200 rounded text-[16px] focus:outline-none focus:border-slate-300"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full h-9 mt-4 bg-sky-500 text-white hover:bg-sky-600 text-[16px] font-semibold rounded border border-slate-300 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Plus size={14} /> Add Route
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* BROADCAST ALERTS PANEL */}
      {activeTab === "alerts" && (
        <div className="max-w-2xl mx-auto w-full glass-card bg-white border border-slate-200 rounded-lg p-6">
          <h3 className="text-[16px] font-bold uppercase tracking-wider text-slate-600 border-b border-slate-200 pb-3 mb-4 flex items-center gap-2">
            <Volume2 size={16} /> Broadcast School Announcement
          </h3>

          <form onSubmit={handleSendAlert} className="space-y-4 pt-2">
            <div>
              <label className="block text-[14px] font-semibold text-slate-500 mb-1">Notice Heading *</label>
              <input
                type="text"
                value={newAlert.title}
                onChange={(e) => setNewAlert(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Summer Vacation Schedules 2026"
                className="w-full h-10 px-3 bg-white border border-slate-200 rounded text-[16px] text-slate-800 focus:outline-none focus:border-slate-300"
                required
              />
            </div>

            <div>
              <label className="block text-[14px] font-semibold text-slate-500 mb-1">Target Recipient Scope *</label>
              <select
                value={newAlert.recipient_role}
                onChange={(e) => setNewAlert(prev => ({ ...prev, recipient_role: e.target.value }))}
                className="w-full h-10 px-2 bg-white border border-slate-200 rounded text-[16px] focus:outline-none focus:border-slate-300"
              >
                <option value="ALL">Everyone (All School Accounts)</option>
                <option value="FACULTY">Faculty Members Only</option>
                <option value="PARENT">Parents Portal Only</option>
              </select>
            </div>

            <div>
              <label className="block text-[14px] font-semibold text-slate-500 mb-1">Detailed Message *</label>
              <textarea
                value={newAlert.message}
                onChange={(e) => setNewAlert(prev => ({ ...prev, message: e.target.value }))}
                placeholder="This is to notify all parents and staff that the school will remain closed from..."
                rows={4}
                className="w-full p-3 bg-white border border-slate-200 rounded text-[16px] text-slate-800 focus:outline-none focus:border-slate-300"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full h-11 mt-4 bg-sky-500 text-white hover:bg-sky-600 text-[16px] font-semibold rounded border border-slate-300 flex items-center justify-center gap-1.5 transition-all cursor-pointer animate-pulse"
            >
              <Bell size={14} /> Send Broadcast Notice
            </button>
          </form>
        </div>
      )}
      {/* EXAMS PANEL */}
      {activeTab === "exams" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass-card bg-white border border-slate-200 rounded-lg p-6">
            <h3 className="text-[16px] font-bold uppercase tracking-wider text-slate-600 border-b border-slate-200 pb-3 mb-4">Exam Schedules</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[16px]">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-semibold h-10">
                    <th>Exam Name</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {exams.length === 0 ? (
                    <tr className="h-20 text-slate-500">
                      <td colSpan={2} className="text-center font-mono">No exams scheduled yet.</td>
                    </tr>
                  ) : (
                    exams.map((exam) => (
                      <tr key={exam.id} className="border-b border-slate-200/50 h-12 text-slate-800 hover:bg-white/30">
                        <td className="font-semibold">{exam.name}</td>
                        <td className="text-slate-500">{exam.exam_date}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="glass-card bg-white border border-slate-200 rounded-lg p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-[16px] font-bold uppercase tracking-wider text-slate-600 border-b border-slate-200 pb-3 mb-4">Schedule Exam</h3>
              <form onSubmit={handleAddExam} className="space-y-4">
                <div>
                  <label className="block text-[14px] font-semibold text-slate-500 mb-1">Exam Name *</label>
                  <input
                    type="text"
                    value={newExam.name}
                    onChange={(e) => setNewExam(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Mid Terms 2026"
                    className="w-full h-9 px-3 bg-white border border-slate-200 rounded text-[16px] focus:outline-none focus:border-slate-300"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[14px] font-semibold text-slate-500 mb-1">Date *</label>
                  <input
                    type="date"
                    value={newExam.exam_date}
                    onChange={(e) => setNewExam(prev => ({ ...prev, exam_date: e.target.value }))}
                    className="w-full h-9 px-3 bg-white border border-slate-200 rounded text-[16px] focus:outline-none focus:border-slate-300"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full h-9 mt-4 bg-sky-500 text-white hover:bg-sky-600 text-[16px] font-semibold rounded border border-slate-300 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Plus size={14} /> Schedule Exam
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* HOLIDAYS PANEL */}
      {activeTab === "holidays" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass-card bg-white border border-slate-200 rounded-lg p-6">
            <h3 className="text-[16px] font-bold uppercase tracking-wider text-slate-600 border-b border-slate-200 pb-3 mb-4">School Holidays</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[16px]">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-semibold h-10">
                    <th>Holiday Name</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                  </tr>
                </thead>
                <tbody>
                  {holidays.length === 0 ? (
                    <tr className="h-20 text-slate-500">
                      <td colSpan={3} className="text-center font-mono">No holidays scheduled yet.</td>
                    </tr>
                  ) : (
                    holidays.map((holiday) => (
                      <tr key={holiday.id} className="border-b border-slate-200/50 h-12 text-slate-800 hover:bg-white/30">
                        <td className="font-semibold">{holiday.name}</td>
                        <td className="text-slate-500">{holiday.start_date}</td>
                        <td className="text-slate-500">{holiday.end_date}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="glass-card bg-white border border-slate-200 rounded-lg p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-[16px] font-bold uppercase tracking-wider text-slate-600 border-b border-slate-200 pb-3 mb-4">Add Holiday</h3>
              <form onSubmit={handleAddHoliday} className="space-y-4">
                <div>
                  <label className="block text-[14px] font-semibold text-slate-500 mb-1">Holiday Name *</label>
                  <input
                    type="text"
                    value={newHoliday.name}
                    onChange={(e) => setNewHoliday(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Diwali Break"
                    className="w-full h-9 px-3 bg-white border border-slate-200 rounded text-[16px] focus:outline-none focus:border-slate-300"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[14px] font-semibold text-slate-500 mb-1">Start Date *</label>
                  <input
                    type="date"
                    value={newHoliday.start_date}
                    onChange={(e) => setNewHoliday(prev => ({ ...prev, start_date: e.target.value }))}
                    className="w-full h-9 px-3 bg-white border border-slate-200 rounded text-[16px] focus:outline-none focus:border-slate-300"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[14px] font-semibold text-slate-500 mb-1">End Date *</label>
                  <input
                    type="date"
                    value={newHoliday.end_date}
                    onChange={(e) => setNewHoliday(prev => ({ ...prev, end_date: e.target.value }))}
                    className="w-full h-9 px-3 bg-white border border-slate-200 rounded text-[16px] focus:outline-none focus:border-slate-300"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full h-9 mt-4 bg-sky-500 text-white hover:bg-sky-600 text-[16px] font-semibold rounded border border-slate-300 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Plus size={14} /> Add Holiday
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
