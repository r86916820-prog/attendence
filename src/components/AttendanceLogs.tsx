import React, { useState } from 'react';
import { History, Calendar, Search, Edit2, CheckCircle2, XCircle, Clock, BookOpen, Users } from 'lucide-react';
import { AttendanceSession, Department, Subject } from '../types';

interface AttendanceLogsProps {
  attendanceSessions: AttendanceSession[];
  departments: Department[];
  subjects: Subject[];
  onSelectSessionToEdit: (session: AttendanceSession) => void;
}

export const AttendanceLogs: React.FC<AttendanceLogsProps> = ({
  attendanceSessions,
  departments,
  subjects,
  onSelectSessionToEdit,
}) => {
  const [selectedDept, setSelectedDept] = useState<number | 'all'>('all');
  const [selectedDate, setSelectedDate] = useState<string>('');

  const filteredSessions = attendanceSessions.filter(s => {
    const matchesDept = selectedDept === 'all' || s.departmentId === selectedDept;
    const matchesDate = !selectedDate || s.date === selectedDate;
    return matchesDept && matchesDate;
  });

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <History className="w-6 h-6 text-indigo-600" />
            <span>Historical Attendance Logs</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Review past class sessions, present/absent counts, and edit past attendance entries.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Filter by Department
          </label>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="w-full px-3.5 py-2.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100"
          >
            <option value="all">All Departments</option>
            {departments.map(d => (
              <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Filter by Date
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full px-3.5 py-2.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100"
          />
        </div>
      </div>

      {/* Logs Table / Cards */}
      <div className="space-y-4">
        {filteredSessions.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 text-center text-slate-400 text-xs">
            No attendance session logs found.
          </div>
        ) : (
          filteredSessions.map(session => {
            const presentCount = session.records.filter(r => r.status === 'Present').length;
            const absentCount = session.records.filter(r => r.status === 'Absent').length;
            const lateCount = session.records.filter(r => r.status === 'Late').length;
            const total = session.records.length;
            const percentage = total > 0 ? Math.round(((presentCount + lateCount) / total) * 100) : 0;

            return (
              <div
                key={session.id}
                className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2.5 py-0.5 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-extrabold text-[11px] rounded-lg border border-blue-200 dark:border-blue-800">
                      {session.departmentCode} Sem {session.semester} ({session.section})
                    </span>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{session.date}</span>
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-emerald-600" />
                    <span>{session.subjectCode} - {session.subjectName}</span>
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    Recorded by: {session.facultyName}
                  </p>
                </div>

                {/* Stat Badges & Edit Button */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-xs font-bold">
                    <span className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{presentCount} Present</span>
                    </span>
                    <span className="px-2.5 py-1 bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 rounded-xl flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5" />
                      <span>{absentCount} Absent</span>
                    </span>
                    <span className="px-2.5 py-1 bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 rounded-xl flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{lateCount} Late</span>
                    </span>
                  </div>

                  <div className="text-right border-l border-slate-100 dark:border-slate-700 pl-4">
                    <span className="text-sm font-extrabold text-blue-600 dark:text-blue-400 block">{percentage}%</span>
                    <span className="text-[10px] text-slate-400">Attendance</span>
                  </div>

                  <button
                    onClick={() => onSelectSessionToEdit(session)}
                    className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit Session</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
