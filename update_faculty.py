import sys

def modify_faculty_page():
    path = '/Users/sachin/Desktop/PathshalaERP/frontend/app/dashboard/faculty/page.tsx'
    with open(path, 'r') as f:
        content = f.read()

    # 1. Add imports
    content = content.replace(
        'import {',
        'import {\n  Users,\n  GraduationCap,\n  Trash2,\n  Plus,'
    )

    # 2. Add Classes State and all records states
    state_injection = """
  const [classes, setClasses] = useState<any[]>([]);
  const [allAttendance, setAllAttendance] = useState<any[]>([]);
  const [allResults, setAllResults] = useState<any[]>([]);
  
  // Exam Management
  const [newExam, setNewExam] = useState({ name: "", class_obj: "", subject_name: "", max_marks: "" });
"""
    content = content.replace('const [loading, setLoading] = useState(true);', 'const [loading, setLoading] = useState(true);\n' + state_injection)
    
    # 3. Add fetching
    fetch_injection = """
      // 5. Fetch Classes
      const classRes = await api.get("/schools/classes/");
      setClasses(classRes.data);

      // 6. Fetch Existing Attendance
      const attRes = await api.get("/attendance/records/");
      setAllAttendance(attRes.data);

      // 7. Fetch Existing Results
      const resRes = await api.get("/results/records/");
      setAllResults(resRes.data);
"""
    content = content.replace('setTimetable(timeRes.data);', 'setTimetable(timeRes.data);\n' + fetch_injection)

    # 4. Enhance Attendance Pre-filling
    attendance_effect_old = """
  // Preset all students as PRESENT when a class is selected
  useEffect(() => {
    if (selectedAttendanceClass) {
      const classStudents = getAttendanceStudents();
      const initialRecords: { [key: number]: 'PRESENT' | 'ABSENT' | 'LATE' } = {};
      classStudents.forEach(s => {
        initialRecords[s.id] = 'PRESENT';
      });
      setAttendanceRecords(initialRecords);
    }
  }, [selectedAttendanceClass]);
"""
    attendance_effect_new = """
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
"""
    content = content.replace(attendance_effect_old.strip(), attendance_effect_new.strip())

    # 5. Enhance Grading Pre-filling
    grading_effect_old = """
  // Preset grading records when an exam is selected
  useEffect(() => {
    if (selectedGradingExam) {
      const gradingStudents = getGradingStudents();
      const initialGrades: { [key: number]: { marks: string; remarks: string } } = {};
      gradingStudents.forEach(s => {
        initialGrades[s.id] = { marks: "", remarks: "" };
      });
      setGradesData(initialGrades);
    }
  }, [selectedGradingExam]);
"""
    grading_effect_new = """
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
"""
    content = content.replace(grading_effect_old.strip(), grading_effect_new.strip())

    # 6. Add CRUD functions for Exams
    exam_funcs = """
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
"""
    content = content.replace('  const handleGradeChange', exam_funcs + '\n  const handleGradeChange')

    # 7. Add new Tabs to Menu
    tabs_old = """
        {[
          { id: "overview", label: "Overview Info", icon: BookOpen },
          { id: "attendance", label: "Roster Attendance", icon: UserCheck },
          { id: "grading", label: "Gradebook Entry", icon: Award },
          { id: "timetable", label: "Weekly Schedule", icon: Calendar }
        ]
"""
    tabs_new = """
        {[
          { id: "overview", label: "Overview Info", icon: BookOpen },
          { id: "attendance", label: "Roster Attendance", icon: UserCheck },
          { id: "grading", label: "Gradebook Entry", icon: Award },
          { id: "exams", label: "Exams Mgmt", icon: ListTodo },
          { id: "timetable", label: "Weekly Schedule", icon: Calendar },
          { id: "students", label: "Students DB", icon: Users },
          { id: "classes", label: "Classes DB", icon: GraduationCap }
        ]
"""
    content = content.replace(tabs_old.strip(), tabs_new.strip())

    # Replace the Tab type string
    content = content.replace(
        '<"overview" | "attendance" | "grading" | "timetable">("overview");',
        '<"overview" | "attendance" | "grading" | "timetable" | "exams" | "students" | "classes">("overview");'
    )

    # 8. Add New Panels at the end
    new_panels = """
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
"""
    content = content.replace('    </div>\n  );\n}', new_panels + '\n    </div>\n  );\n}')

    with open(path, 'w') as f:
        f.write(content)

if __name__ == "__main__":
    modify_faculty_page()
