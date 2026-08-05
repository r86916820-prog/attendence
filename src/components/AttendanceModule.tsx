import React, { useState, useEffect } from 'react';
import {
  CheckSquare,
  CheckCircle2,
  XCircle,
  Clock,
  Save,
  AlertTriangle,
  Calendar,
  Filter,
  Users,
  Edit2
} from 'lucide-react';
import { Department, Subject, Student, AttendanceSession, AttendanceStatus, Section } from '../types';

interface AttendanceModuleProps {
  departments: Department[];
  subjects: Subject[];
  students: Student[];
  attendanceSessions: AttendanceSession[];
  onSaveAttendance: (session: Omit<AttendanceSession, 'id'>) => void;
  onUpdateAttendance: (session: AttendanceSession) => void;
}

export const AttendanceModule: React.FC<AttendanceModuleProps> = ({
  departments,
  subjects,
  students,
  attendanceSessions,
  onSaveAttendance,
  onUpdateAttendance,
}) => {
  // Selector state
  const [selectedDeptId, setSelectedDeptId] = useState<number>(departments[0]?.id || 1);
  const [selectedSem, setSelectedSem] = useState<number>(7);
  const [selectedSection, setSelectedSection] = useState<Section>('A');
  const [selectedSubjectId, setSelectedSubjectId] = useState<number>(subjects[0]?.id || 1);
  const [attendanceDate, setAttendanceDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  // Student Attendance Records Map (studentId -> Status)
  const [statusMap, setStatusMap] = useState<Map<number, AttendanceStatus>>(new Map());
  const [remarksMap, setRemarksMap] = useState<Map<number, string>>(new Map());

  // Check if session exists for selected parameters
  const existingSession = attendanceSessions.find(s =>
    s.departmentId === Number(selectedDeptId) &&
    s.semester === Number(selectedSem) &&
    s.section === selectedSection &&
    s.subjectId === Number(selectedSubjectId) &&
    s.date === attendanceDate
  );

  // Eligible students list
  const eligibleStudents = students.filter(st =>
    st.departmentId === Number(selectedDeptId) &&
    st.semester === Number(selectedSem) &&
    st.section === selectedSection
  );

  // Initialize status map when selection changes or existing session is found
  useEffect(() => {
    const newStatusMap = new Map<number, AttendanceStatus>();
    const newRemarksMap = new Map<number, string>();

    if (existingSession) {
      existingSession.records.forEach(r => {
        newStatusMap.set(r.studentId, r.status);
        if (r.remarks) newRemarksMap.set(r.studentId, r.remarks);
      });
    } else {
      eligibleStudents.forEach(st => {
        newStatusMap.set(st.id, 'Present');
      });
    }

    setStatusMap(newStatusMap);
    setRemarksMap(newRemarksMap);
  }, [selectedDeptId, selectedSem, selectedSection, selectedSubjectId, attendanceDate]);

  const toggleStatus = (studentId: number, status: AttendanceStatus) => {
    const nextMap = new Map(statusMap);
    nextMap.set(studentId, status);
    setStatusMap(nextMap);
  };

  const markAll = (status: AttendanceStatus) => {
    const nextMap = new Map<number, AttendanceStatus>();
    eligibleStudents.forEach(st => nextMap.set(st.id, status));
    setStatusMap(nextMap);
  };

  const handleSave = () => {
    const records = eligibleStudents.map(st => ({
      studentId: st.id,
      status: statusMap.get(st.id) || 'Present',
      remarks: remarksMap.get(st.id) || ''
    }));

    const deptObj = departments.find(d => d.id === Number(selectedDeptId));
    const subjObj = subjects.find(s => s.id === Number(selectedSubjectId));

    if (existingSession) {
      onUpdateAttendance({
        ...existingSession,
        records,
      });
    } else {
      onSaveAttendance({
        departmentId: Number(selectedDeptId),
        departmentCode: deptObj?.code || 'CSE',
        semester: Number(selectedSem),
        section: selectedSection,
        subjectId: Number(selectedSubjectId),
        subjectCode: subjObj?.code || 'CS701',
        subjectName: subjObj?.name || 'Subject',
        facultyId: 1,
        facultyName: 'Dr. Rajesh Sharma',
        date: attendanceDate,
        records,
      });
    }
  };

  // Filter available subjects for selected dept & sem
  const availableSubjects = subjects.filter(s =>
    s.departmentId === Number(selectedDeptId) && s.semester === Number(selectedSem)
  );

  return (
    <div className="space-y-6">
      {/* Module Title Banner */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-blue-600" />
            <span>Mark Attendance Module</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Select class session parameters to record real-time daily attendance with instant status toggles.
          </p>
        </div>

        {existingSession && (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-xs font-semibold">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span>Editing Existing Attendance Record</span>
          </div>
        )}
      </div>

      {/* Class Selection Filter Controls */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
        <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
          Session Parameters
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          {/* Dept */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Department</label>
            <select
              value={selectedDeptId}
              onChange={(e) => setSelectedDeptId(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-medium"
            >
              {departments.map(d => (
                <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
              ))}
            </select>
          </div>

          {/* Sem */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Semester</label>
            <select
              value={selectedSem}
              onChange={(e) => setSelectedSem(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-medium"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                <option key={s} value={s}>Semester {s}</option>
              ))}
            </select>
          </div>

          {/* Section */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Section</label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value as Section)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-medium"
            >
              <option value="A">Section A</option>
              <option value="B">Section B</option>
              <option value="C">Section C</option>
            </select>
          </div>

          {/* Subject */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Subject</label>
            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-medium"
            >
              {availableSubjects.length === 0 ? (
                <option value="">No subjects found for dept/sem</option>
              ) : (
                availableSubjects.map(s => (
                  <option key={s.id} value={s.id}>{s.code} - {s.name}</option>
                ))
              )}
            </select>
          </div>

          {/* Attendance Date */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Date</label>
            <input
              type="date"
              value={attendanceDate}
              onChange={(e) => setAttendanceDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-medium"
            />
          </div>
        </div>
      </div>

      {/* Bulk Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 font-semibold">
          <Users className="w-4 h-4 text-blue-600" />
          <span>{eligibleStudents.length} Students Enrolled in this Batch</span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => markAll('Present')}
            className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-xl font-bold hover:bg-emerald-100 transition-colors"
          >
            Mark All Present
          </button>
          <button
            onClick={() => markAll('Absent')}
            className="px-3 py-1.5 bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 rounded-xl font-bold hover:bg-rose-100 transition-colors"
          >
            Mark All Absent
          </button>
        </div>
      </div>

      {/* Attendance Student Marking Sheet Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold">
                <th className="p-4">Roll Number</th>
                <th className="p-4">Student Name</th>
                <th className="p-4 text-center">Attendance Status</th>
                <th className="p-4">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700 text-slate-700 dark:text-slate-200">
              {eligibleStudents.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-400">
                    No students found matching the selected Department, Semester, and Section.
                  </td>
                </tr>
              ) : (
                eligibleStudents.map(st => {
                  const currentStatus = statusMap.get(st.id) || 'Present';
                  return (
                    <tr key={st.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-colors">
                      <td className="p-4 font-bold text-blue-600 dark:text-blue-400">{st.rollNumber}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img src={st.photo} alt={st.fullName} className="w-8 h-8 rounded-full object-cover" />
                          <span className="font-bold text-slate-800 dark:text-slate-100">{st.fullName}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => toggleStatus(st.id, 'Present')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
                              currentStatus === 'Present'
                                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-2 ring-emerald-600'
                                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                            }`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Present</span>
                          </button>

                          <button
                            onClick={() => toggleStatus(st.id, 'Absent')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
                              currentStatus === 'Absent'
                                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30 ring-2 ring-rose-600'
                                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                            }`}
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Absent</span>
                          </button>

                          <button
                            onClick={() => toggleStatus(st.id, 'Late')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
                              currentStatus === 'Late'
                                ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30 ring-2 ring-amber-500'
                                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                            }`}
                          >
                            <Clock className="w-3.5 h-3.5" />
                            <span>Late</span>
                          </button>
                        </div>
                      </td>
                      <td className="p-4">
                        <input
                          type="text"
                          value={remarksMap.get(st.id) || ''}
                          onChange={(e) => {
                            const nextRem = new Map(remarksMap);
                            nextRem.set(st.id, e.target.value);
                            setRemarksMap(nextRem);
                          }}
                          placeholder="Optional remark..."
                          className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Save Attendance Bar */}
        {eligibleStudents.length > 0 && (
          <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Ready to commit attendance records to database.
            </p>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/25 transition-all transform hover:-translate-y-0.5"
            >
              <Save className="w-4 h-4" />
              <span>{existingSession ? 'Update Attendance Records' : 'Save Attendance Session'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
