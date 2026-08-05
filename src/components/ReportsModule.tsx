import React, { useState } from 'react';
import {
  FileBarChart,
  Printer,
  FileSpreadsheet,
  FileText,
  Search,
  Filter,
  AlertTriangle,
  Users,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { Department, Subject, Student, AttendanceSession } from '../types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

interface ReportsModuleProps {
  departments: Department[];
  subjects: Subject[];
  students: Student[];
  attendanceSessions: AttendanceSession[];
}

export const ReportsModule: React.FC<ReportsModuleProps> = ({
  departments,
  subjects,
  students,
  attendanceSessions,
}) => {
  const [activeTab, setActiveTab] = useState<'student' | 'subject' | 'department' | 'monthly'>('student');
  const [selectedDept, setSelectedDept] = useState<number | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Calculate student attendance percentages across all sessions
  const studentReports = students.map(st => {
    let totalClasses = 0;
    let presentClasses = 0;
    let absentClasses = 0;
    let lateClasses = 0;

    attendanceSessions.forEach(session => {
      if (session.departmentId === st.departmentId && session.semester === st.semester && session.section === st.section) {
        const record = session.records.find(r => r.studentId === st.id);
        if (record) {
          totalClasses++;
          if (record.status === 'Present') presentClasses++;
          if (record.status === 'Absent') absentClasses++;
          if (record.status === 'Late') lateClasses++;
        }
      }
    });

    const percentage = totalClasses > 0 ? Math.round(((presentClasses + lateClasses) / totalClasses) * 100) : 100;

    return {
      ...st,
      totalClasses,
      presentClasses,
      absentClasses,
      lateClasses,
      percentage,
    };
  }).filter(st => {
    const matchesDept = selectedDept === 'all' || st.departmentId === selectedDept;
    const matchesSearch = st.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || st.rollNumber.includes(searchTerm);
    return matchesDept && matchesSearch;
  });

  // Export PDF Function
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Smart Student Attendance Management System', 14, 20);
    doc.setFontSize(11);
    doc.text(`Academic Attendance Report - Generated on ${new Date().toLocaleDateString()}`, 14, 28);

    const tableData = studentReports.map(s => [
      s.rollNumber,
      s.fullName,
      s.departmentCode || 'CSE',
      `Sem ${s.semester} (${s.section})`,
      s.totalClasses,
      s.presentClasses,
      s.absentClasses,
      `${s.percentage}%`
    ]);

    autoTable(doc, {
      startY: 35,
      head: [['Roll No', 'Student Name', 'Dept', 'Batch', 'Total', 'Present', 'Absent', 'Percentage']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [37, 99, 235] }
    });

    doc.save('Student_Attendance_Report.pdf');
  };

  // Export Excel Function
  const exportExcel = () => {
    const excelData = studentReports.map(s => ({
      'Roll Number': s.rollNumber,
      'Full Name': s.fullName,
      'Department': s.departmentCode,
      'Semester': s.semester,
      'Section': s.section,
      'Total Classes': s.totalClasses,
      'Present': s.presentClasses,
      'Absent': s.absentClasses,
      'Attendance Percentage': `${s.percentage}%`
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance Report');
    XLSX.writeFile(workbook, 'Student_Attendance_Report.xlsx');
  };

  // Print Report
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Title & Action Buttons */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <FileBarChart className="w-6 h-6 text-blue-600" />
            <span>Attendance Reports & Exports</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Generate formal B.Tech department, subject, and student attendance statements with official export tools.
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
          <button
            onClick={exportPDF}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 hover:bg-rose-100 font-bold text-xs rounded-xl transition-colors"
          >
            <FileText className="w-4 h-4" />
            <span>Export PDF</span>
          </button>
          <button
            onClick={exportExcel}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export Excel</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-700 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('student')}
          className={`pb-3 px-4 border-b-2 transition-all ${
            activeTab === 'student'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-bold'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800'
          }`}
        >
          Student-wise Report
        </button>
        <button
          onClick={() => setActiveTab('subject')}
          className={`pb-3 px-4 border-b-2 transition-all ${
            activeTab === 'subject'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-bold'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800'
          }`}
        >
          Subject-wise Report
        </button>
        <button
          onClick={() => setActiveTab('department')}
          className={`pb-3 px-4 border-b-2 transition-all ${
            activeTab === 'department'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-bold'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800'
          }`}
        >
          Department Summary
        </button>
      </div>

      {/* Filter bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search student or roll number..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100"
          />
        </div>

        <select
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value === 'all' ? 'all' : Number(e.target.value))}
          className="px-3.5 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100"
        >
          <option value="all">All Departments</option>
          {departments.map(d => (
            <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
          ))}
        </select>
      </div>

      {/* Report Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold">
                <th className="p-4">Roll Number</th>
                <th className="p-4">Student Name</th>
                <th className="p-4">Department & Sem</th>
                <th className="p-4 text-center">Total Sessions</th>
                <th className="p-4 text-center">Present</th>
                <th className="p-4 text-center">Absent</th>
                <th className="p-4 text-center">Attendance %</th>
                <th className="p-4 text-center">Eligibility Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700 text-slate-700 dark:text-slate-200">
              {studentReports.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    No student records found for the selected report filters.
                  </td>
                </tr>
              ) : (
                studentReports.map(st => (
                  <tr key={st.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="p-4 font-bold text-blue-600 dark:text-blue-400">{st.rollNumber}</td>
                    <td className="p-4 font-bold text-slate-800 dark:text-slate-100">{st.fullName}</td>
                    <td className="p-4">{st.departmentCode} Sem {st.semester} ({st.section})</td>
                    <td className="p-4 text-center font-semibold">{st.totalClasses}</td>
                    <td className="p-4 text-center font-bold text-emerald-600">{st.presentClasses}</td>
                    <td className="p-4 text-center font-bold text-rose-600">{st.absentClasses}</td>
                    <td className="p-4 text-center font-extrabold text-sm">
                      <span className={st.percentage < 75 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}>
                        {st.percentage}%
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      {st.percentage < 75 ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 rounded-full font-bold text-[10px]">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Shortage (&lt; 75%)</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-full font-bold text-[10px]">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Eligible</span>
                        </span>
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
  );
};
