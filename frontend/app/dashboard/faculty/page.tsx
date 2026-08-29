"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/services/api";
import {
  Users,
  GraduationCap,
  Trash2,
  Plus, 
  Loader, 
  UserCheck, 
  Award, 
  Calendar, 
  Check, 
  BookOpen, 
  Clock, 
  ListTodo
} from "lucide-react";

interface AssignmentItem {
  id: number;
  subject: number;
  subject_name: string;
  class_obj: number;
  class_name: string;
  class_section: string;
}

interface StudentItem {
  id: number;
  name: string;
  roll_number: string;
  class_obj: number;
}

interface ExamItem {
  id: number;
  name: string;
  class_obj: number;
  class_name: string;
  subject_name: string;
  max_marks: string;
}

interface TimetableItem {
  id: number;
  class_name: string;
  class_section: string;
  subject_name: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
}

export default function FacultyDashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "attendance" | "grading" | "timetable" | "exams" | "students" | "classes">("overview");
  const [loading, setLoading] = useState(true);

  const [classes, setClasses] = useState<any[]>([]);
  const [allAttendance, setAllAttendance] = useState<any[]>([]);
  const [allResults, setAllResults] = useState<any[]>([]);
  
  // Exam Management
  const [newExam, setNewExam] = useState({ name: "", class_obj: "", subject_name: "", max_marks: "" });

  const [subLoading, setSubLoading] = useState(false);
  
  // Faculty Data
  const [assignments, setAssignments] = useState<AssignmentItem[]>([]);
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [exams, setExams] = useState<ExamItem[]>([]);
  const [timetable, setTimetable] = useState<TimetableItem[]>([]);
  
  // Attendance Mark State
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedAttendanceClass, setSelectedAttendanceClass] = useState("");
  const [attendanceRecords, setAttendanceRecords] = useState<{ [studentId: number]: 'PRESENT' | 'ABSENT' | 'LATE' }>({});

  // Grading State
  const [selectedGradingExam, setSelectedGradingExam] = useState("");
  const [gradesData, setGradesData] = useState<{ [studentId: number]: { marks: string; remarks: string } }>({});

  const loadFacultyData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Assignments
      const assignRes = await api.get("/faculty/assignments/my_assignments/");
      setAssignments(assignRes.data);

      // 2. Fetch Students
      const studRes = await api.get("/students/students/");
      setStudents(studRes.data);

      // 3. Fetch Exams
      const examRes = await api.get("/exams/records/");
      setExams(examRes.data);

      // 4. Fetch Timetable
      const timeRes = await api.get("/system_settings/timetable/");
      setTimetable(timeRes.data);

      // 5. Fetch Classes
      const classRes = await api.get("/schools/classes/");
      setClasses(classRes.data);

      // 6. Fetch Existing Attendance
      const attRes = await api.get("/attendance/records/");
      setAllAttendance(attRes.data);

      // 7. Fetch Existing Results
      const resRes = await api.get("/results/records/");
      setAllResults(resRes.data);

    } catch (err) {
      console.error("Error loading faculty data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFacultyData();
  }, []);

  // Filter students based on selected attendance class
  const getAttendanceStudents = () => {
    if (!selectedAttendanceClass) return [];
    return students.filter(s => s.class_obj === parseInt(selectedAttendanceClass));
  };

  // Preset attendance based on existing records or default to PRESENT
  useEffect(() => {
    if (selectedAttendanceClass && attendanceDate) {
      const classStudents = getAttendanceStudents();
      const initialRecords: { [key: number]: 'PRESENT' | 'ABSENT' | 'LATE' } = {};
      
      classStudents.forEach(s => {
        // Check if there is an existing record for this date and student
        const existing = allAttendance.find(a => a.student === s.id && a.date === attendanceDate);
        if (existing) {
          initialRecords[s.id] = existing.status;
        } else {
          initialRecords[s.id] = 'PRESENT';
        }
      });
      setAttendanceRecords(initialRecords);
    }
  }, [selectedAttendanceClass, attendanceDate, allAttendance]);

  const handleAttendanceChange = (studentId: number, status: 'PRESENT' | 'ABSENT' | 'LATE') => {
    setAttendanceRecords(prev => ({ ...prev, [studentId]: status }));
  };

  const submitAttendance = async () => {
    if (!selectedAttendanceClass || !attendanceDate) return;
    setSubLoading(true);
    
    const recordsPayload = Object.entries(attendanceRecords).map(([studentId, status]) => ({
      student_id: parseInt(studentId),
      status
    }));

    try {
      const response = await api.post("/attendance/records/bulk_mark/", {
        date: attendanceDate,
        records: recordsPayload
      });
      if (response.data.success) {
        alert("Daily attendance submitted successfully!");
      }
    } catch (err) {
      alert("Error submitting attendance roster.");
    } finally {
      setSubLoading(false);
    }
  };

  // Filter students for grading based on the exam's target class
  const getGradingStudents = () => {
    if (!selectedGradingExam) return [];
    const exam = exams.find(e => e.id === parseInt(selectedGradingExam));
    if (!exam) return [];
    return students.filter(s => s.class_obj === exam.class_obj);
  };

  // Preset grading records based on existing results
  useEffect(() => {
    if (selectedGradingExam) {
      const gradingStudents = getGradingStudents();
      const initialGrades: { [key: number]: { marks: string; remarks: string } } = {};
      
      gradingStudents.forEach(s => {
        const existing = allResults.find(r => r.student === s.id && r.exam_id === parseInt(selectedGradingExam));
        if (existing) {
          initialGrades[s.id] = { marks: existing.marks_obtained.toString(), remarks: existing.remarks || "" };
        } else {
          initialGrades[s.id] = { marks: "", remarks: "" };
        }
      });
      setGradesData(initialGrades);
    }
  }, [selectedGradingExam, allResults]);


  const handleCreateExam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExam.name || !newExam.class_obj || !newExam.subject_name || !newExam.max_marks) return;
    setSubLoading(true);
    try {
      await api.post("/exams/records/", {
        name: newExam.name,
        class_obj: parseInt(newExam.class_obj),
        subject_name: newExam.subject_name,
        max_marks: parseFloat(newExam.max_marks),
        exam_date: new Date().toISOString().split('T')[0]
      });
      setNewExam({ name: "", class_obj: "", subject_name: "", max_marks: "" });
      await loadFacultyData();
    } catch (err) {
      alert("Error creating exam");
    } finally {
      setSubLoading(false);
    }
  };

  const handleDeleteExam = async (id: number) => {
    if (!confirm("Are you sure you want to delete this exam?")) return;
    setSubLoading(true);
    try {
      await api.delete(`/exams/records/${id}/`);
      await loadFacultyData();
    } catch (err) {
      alert("Error deleting exam");
    } finally {
      setSubLoading(false);
    }
  };

  const handleGradeChange = (studentId: number, field: 'marks' | 'remarks', value: string) => {
    setGradesData(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value
      }
    }));
  };

  const submitGrades = async () => {
    if (!selectedGradingExam) return;
    setSubLoading(true);
    
    const marksPayload = Object.entries(gradesData).map(([studentId, data]) => ({
      student_id: parseInt(studentId),
      marks_obtained: parseFloat(data.marks || "0"),
      remarks: data.remarks
    }));

    try {
      const response = await api.post("/results/records/bulk_submit/", {
        exam_id: parseInt(selectedGradingExam),
        marks: marksPayload
      });
      if (response.data.success) {
        alert("Exam grades saved and published successfully!");
      }
    } catch (err) {
      alert("Error saving exam grade ledger.");
    } finally {
      setSubLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center gap-2">
        <Loader className="animate-spin text-[#4753A4]" size={24} />
        <span className="text-[16px] text-slate-500">Loading educator profile workspace...</span>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col gap-8">
      {/* Header Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[24px] font-bold tracking-tight text-slate-800">Faculty Workspace Console</h1>
          <p className="text-[16px] text-slate-500 mt-1">Configure classes, marking rosters, and grade exam scorecards.</p>
        </div>
        {subLoading && (
          <div className="flex items-center gap-2 text-[16px] text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-full animate-pulse">
            <Loader className="animate-spin text-[#4753A4]" size={12} /> Syncing marks...
          </div>
        )}
      </div>

      {/* Tabs Menu */}
      <div className="flex gap-2 border-b border-slate-200 pb-2">
        {[
          { id: "overview", label: "Overview Info", icon: BookOpen },
          { id: "attendance", label: "Roster Attendance", icon: UserCheck },
          { id: "grading", label: "Gradebook Entry", icon: Award },
          { id: "exams", label: "Exams Mgmt", icon: ListTodo },
          { id: "timetable", label: "Weekly Schedule", icon: Calendar },
          { id: "students", label: "Students DB", icon: Users },
          { id: "classes", label: "Classes DB", icon: GraduationCap }
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-card bg-white border border-slate-200 p-5 rounded-lg">
              <span className="text-[14px] uppercase font-bold tracking-wider text-slate-500 block mb-1">Subject Assignments</span>
              <span className="text-[28px] font-extrabold text-slate-800">{assignments.length}</span>
              <span className="text-[13px] text-slate-600 block mt-1">Active class topics</span>
            </div>
            <div className="glass-card bg-white border border-slate-200 p-5 rounded-lg">
              <span className="text-[14px] uppercase font-bold tracking-wider text-slate-500 block mb-1">Classes Handled</span>
              <span className="text-[28px] font-extrabold text-slate-800">
                {new Set(assignments.map(a => a.class_obj)).size}
              </span>
              <span className="text-[13px] text-slate-600 block mt-1">Unique standard sections</span>
            </div>
            <div className="glass-card bg-white border border-slate-200 p-5 rounded-lg">
              <span className="text-[14px] uppercase font-bold tracking-wider text-slate-500 block mb-1">Scheduled Hours</span>
              <span className="text-[28px] font-extrabold text-slate-800">{timetable.length}</span>
              <span className="text-[13px] text-slate-600 block mt-1">Weekly slots configured</span>
            </div>
          </div>

          {/* Subject Assignment Table */}
          <div className="glass-card bg-white border border-slate-200 rounded-lg p-6">
            <h3 className="text-[16px] font-bold uppercase tracking-wider text-slate-600 border-b border-slate-200 pb-3 mb-4">Class & Subject Assignments</h3>
            <div className="space-y-2">
              {assignments.length === 0 ? (
                <div className="text-[16px] text-slate-500 font-mono">No subject assignments assigned yet.</div>
              ) : (
                assignments.map((item) => (
                  <div key={item.id} className="p-3 bg-white border border-slate-200 rounded flex justify-between items-center text-[16px]">
                    <span className="font-semibold text-slate-800">{item.subject_name}</span>
                    <span className="px-3 py-1 rounded bg-sky-500 text-white/20 border border-[#4753A4]/30 text-slate-800 font-mono uppercase text-[14px]">
                      {item.class_name} - Section {item.class_section}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ATTENDANCE ROSTER PANEL */}
      {activeTab === "attendance" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls Sheet */}
          <div className="glass-card bg-white border border-slate-200 rounded-lg p-6 space-y-4 h-fit">
            <h3 className="text-[16px] font-bold uppercase tracking-wider text-slate-600 border-b border-slate-200 pb-3 mb-2 flex items-center gap-1.5">
              <ListTodo size={14} /> Attendance Parameters
            </h3>
            
            <div>
              <label className="block text-[14px] font-semibold text-slate-500 mb-1">Marking Date</label>
              <input
                type="date"
                value={attendanceDate}
                onChange={(e) => setAttendanceDate(e.target.value)}
                className="w-full h-9 px-3 bg-white border border-slate-200 rounded text-[16px] focus:outline-none"
              />
            </div>
            
            <div>
              <label className="block text-[14px] font-semibold text-slate-500 mb-1">Class Cohort</label>
              <select
                value={selectedAttendanceClass}
                onChange={(e) => setSelectedAttendanceClass(e.target.value)}
                className="w-full h-9 px-2 bg-white border border-slate-200 rounded text-[16px] focus:outline-none"
              >
                <option value="">-- Choose Class --</option>
                {Array.from(new Set(assignments.map(a => JSON.stringify({ id: a.class_obj, name: a.class_name, sec: a.class_section })))).map((jsonStr: string) => {
                  const item = JSON.parse(jsonStr);
                  return (
                    <option key={item.id} value={item.id}>{item.name} - {item.sec}</option>
                  );
                })}
              </select>
            </div>
          </div>

          {/* Students list */}
          <div className="lg:col-span-2 glass-card bg-white border border-slate-200 rounded-lg p-6">
            <h3 className="text-[16px] font-bold uppercase tracking-wider text-slate-600 border-b border-slate-200 pb-3 mb-4">Classroom Roster</h3>
            
            {getAttendanceStudents().length === 0 ? (
              <div className="h-40 flex items-center justify-center text-[16px] text-slate-500 font-mono">
                Select a class cohort to populate rosters.
              </div>
            ) : (
              <div className="space-y-4">
                <div className="overflow-y-auto max-h-[300px] space-y-2 pr-1">
                  {getAttendanceStudents().map((student) => (
                    <div key={student.id} className="p-3 bg-white border border-slate-200 rounded flex items-center justify-between text-[16px]">
                      <div>
                        <div className="font-semibold">{student.name}</div>
                        <div className="text-[14px] text-slate-500 font-mono">{student.roll_number}</div>
                      </div>
                      <div className="flex gap-1">
                        {['PRESENT', 'ABSENT', 'LATE'].map((st) => (
                          <button
                            key={st}
                            type="button"
                            onClick={() => handleAttendanceChange(student.id, st as any)}
                            className={`h-7 px-2.5 text-[13px] font-bold rounded border transition-all cursor-pointer ${attendanceRecords[student.id] === st ? "bg-sky-500 text-white border-slate-300" : "border-slate-200 bg-white"}`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={submitAttendance}
                  className="w-full h-10 bg-sky-500 text-white hover:bg-sky-600 text-[16px] font-semibold rounded border border-slate-300 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Check size={14} /> Submit Attendance Log
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* GRADING scorecards ENTRY */}
      {activeTab === "grading" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls Sheet */}
          <div className="glass-card bg-white border border-slate-200 rounded-lg p-6 space-y-4 h-fit">
            <h3 className="text-[16px] font-bold uppercase tracking-wider text-slate-600 border-b border-slate-200 pb-3 mb-2 flex items-center gap-1.5">
              <Award size={14} /> Grading Parameters
            </h3>
            
            <div>
              <label className="block text-[14px] font-semibold text-slate-500 mb-1">Select Exam Event</label>
              <select
                value={selectedGradingExam}
                onChange={(e) => setSelectedGradingExam(e.target.value)}
                className="w-full h-9 px-2 bg-white border border-slate-200 rounded text-[16px] focus:outline-none"
              >
                <option value="">-- Choose Exam --</option>
                {exams.map((ex) => (
                  <option key={ex.id} value={ex.id}>{ex.name} ({ex.subject_name})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Grades List Sheet */}
          <div className="lg:col-span-2 glass-card bg-white border border-slate-200 rounded-lg p-6">
            <h3 className="text-[16px] font-bold uppercase tracking-wider text-slate-600 border-b border-slate-200 pb-3 mb-4">Student Gradebook Roll</h3>
            
            {getGradingStudents().length === 0 ? (
              <div className="h-40 flex items-center justify-center text-[16px] text-slate-500 font-mono">
                Select an exam event to load grades list.
              </div>
            ) : (
              <div className="space-y-4">
                <div className="overflow-y-auto max-h-[300px] space-y-2 pr-1">
                  {getGradingStudents().map((student) => (
                    <div key={student.id} className="p-3 bg-white border border-slate-200 rounded flex flex-col sm:flex-row justify-between sm:items-center gap-2 text-[16px]">
                      <div>
                        <div className="font-semibold">{student.name}</div>
                        <div className="text-[14px] text-slate-500 font-mono">{student.roll_number}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={gradesData[student.id]?.marks || ""}
                          onChange={(e) => handleGradeChange(student.id, 'marks', e.target.value)}
                          placeholder="Score"
                          className="w-16 h-8 bg-white border border-slate-200 rounded text-[16px] text-center text-slate-800 focus:outline-none"
                          max={exams.find(e => e.id === parseInt(selectedGradingExam))?.max_marks}
                        />
                        <span className="text-[14px] text-slate-500">
                          / {exams.find(e => e.id === parseInt(selectedGradingExam))?.max_marks}
                        </span>
                        <input
                          type="text"
                          value={gradesData[student.id]?.remarks || ""}
                          onChange={(e) => handleGradeChange(student.id, 'remarks', e.target.value)}
                          placeholder="Remarks"
                          className="w-32 sm:w-48 h-8 px-2 bg-white border border-slate-200 rounded text-[16px] text-slate-800 focus:outline-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={submitGrades}
                  className="w-full h-10 bg-sky-500 text-white hover:bg-sky-600 text-[16px] font-semibold rounded border border-slate-300 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Check size={14} /> Publish Roster Grades
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SCHEDULE TIMETABLE WEEK */}
      {activeTab === "timetable" && (
        <div className="glass-card bg-white border border-slate-200 rounded-lg p-6">
          <h3 className="text-[16px] font-bold uppercase tracking-wider text-slate-600 border-b border-slate-200 pb-3 mb-4">Timetable Schedule Overview</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {timetable.length === 0 ? (
              <div className="col-span-3 text-[16px] text-slate-500 font-mono">No weekly slots configured.</div>
            ) : (
              timetable.map((item) => (
                <div key={item.id} className="p-4 bg-white border border-slate-200 rounded-lg text-[16px] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[18px] font-bold text-slate-800">{item.subject_name}</span>
                    <span className="px-2 py-0.5 rounded bg-sky-50 text-slate-600 font-mono text-[13px] uppercase">{item.day_of_week}</span>
                  </div>
                  <div className="border-t border-slate-200/50 pt-2 text-slate-500 space-y-1">
                    <div className="flex items-center gap-1"><BookOpen size={12} /> Cohort: {item.class_name}-{item.class_section}</div>
                    <div className="flex items-center gap-1"><Clock size={12} /> Time: {item.start_time.substr(0, 5)} - {item.end_time.substr(0, 5)}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* EXAMS MANAGEMENT PANEL */}
      {activeTab === "exams" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="glass-card bg-white border border-slate-200 rounded-lg p-6 h-fit space-y-4">
            <h3 className="text-[20px] font-bold text-slate-800 border-b border-slate-200 pb-3 flex items-center gap-2">
              <Plus size={16} /> Schedule New Exam
            </h3>
            <form onSubmit={handleCreateExam} className="space-y-4">
              <div>
                <label className="block text-[14px] font-semibold text-slate-500 mb-1">Exam Name</label>
                <input required type="text" value={newExam.name} onChange={e => setNewExam({...newExam, name: e.target.value})} className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded text-[16px]" placeholder="Mid Term Test" />
              </div>
              <div>
                <label className="block text-[14px] font-semibold text-slate-500 mb-1">Target Class</label>
                <select required value={newExam.class_obj} onChange={e => setNewExam({...newExam, class_obj: e.target.value})} className="w-full h-9 px-2 bg-slate-50 border border-slate-200 rounded text-[16px]">
                  <option value="">Select Class</option>
                  {classes.map(c => <option key={c.id} value={c.id}>{c.name} - {c.section}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[14px] font-semibold text-slate-500 mb-1">Subject</label>
                <input required type="text" value={newExam.subject_name} onChange={e => setNewExam({...newExam, subject_name: e.target.value})} className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded text-[16px]" placeholder="Mathematics" />
              </div>
              <div>
                <label className="block text-[14px] font-semibold text-slate-500 mb-1">Max Marks</label>
                <input required type="number" value={newExam.max_marks} onChange={e => setNewExam({...newExam, max_marks: e.target.value})} className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded text-[16px]" placeholder="100" />
              </div>
              <button type="submit" className="w-full h-10 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded text-[16px]">Create Exam</button>
            </form>
          </div>

          <div className="lg:col-span-2 glass-card bg-white border border-slate-200 rounded-lg p-6">
            <h3 className="text-[20px] font-bold text-slate-800 border-b border-slate-200 pb-3 mb-4">Exam Roster</h3>
            <div className="space-y-3">
              {exams.map(ex => (
                <div key={ex.id} className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex justify-between items-center text-[16px]">
                  <div>
                    <div className="font-bold text-slate-800">{ex.name} <span className="text-[14px] text-slate-500 font-mono ml-2">({ex.subject_name})</span></div>
                    <div className="text-[14px] text-slate-600 mt-1">Class: {ex.class_name} • Max Marks: {ex.max_marks}</div>
                  </div>
                  <button onClick={() => handleDeleteExam(ex.id)} className="p-2 text-red-500 hover:bg-red-50 rounded border border-red-100 cursor-pointer transition-colors"><Trash2 size={16} /></button>
                </div>
              ))}
              {exams.length === 0 && <div className="text-slate-500 text-[16px]">No exams scheduled.</div>}
            </div>
          </div>
        </div>
      )}

      {/* STUDENTS DB PANEL (Read-Only) */}
      {activeTab === "students" && (
        <div className="glass-card bg-white border border-slate-200 rounded-lg p-6">
          <h3 className="text-[20px] font-bold text-slate-800 border-b border-slate-200 pb-3 mb-4 flex items-center gap-2"><Users size={18} /> Student Database (Read-Only)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {students.map(st => (
              <div key={st.id} className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-[16px]">
                <div className="font-bold text-slate-800">{st.name}</div>
                <div className="text-slate-500 text-[14px] font-mono mt-1">Roll: {st.roll_number}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CLASSES DB PANEL (Read-Only) */}
      {activeTab === "classes" && (
        <div className="glass-card bg-white border border-slate-200 rounded-lg p-6">
          <h3 className="text-[20px] font-bold text-slate-800 border-b border-slate-200 pb-3 mb-4 flex items-center gap-2"><GraduationCap size={18} /> Classes Database (Read-Only)</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {classes.map(c => (
              <div key={c.id} className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-[16px]">
                <div className="font-bold text-slate-800 text-[20px]">{c.name}</div>
                <div className="text-slate-500 text-[14px] font-mono mt-1">Section {c.section}</div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
