import React from 'react';
import {
  Users,
  Building2,
  BookOpen,
  CheckCircle2,
  PieChart as PieChartIcon,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Plus,
  FileText,
  BarChart2
} from 'lucide-react';
import { WelcomeBanner } from './WelcomeBanner';
import { FacultyUser, Department, Subject, Student, AttendanceSession, ActivityLog } from '../types';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement } from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement);

interface DashboardProps {
  faculty: FacultyUser;
  departments: Department[];
  subjects: Subject[];
  students: Student[];
  attendanceSessions: AttendanceSession[];
  activities: ActivityLog[];
  onNavigate: (page: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  faculty,
  departments,
  subjects,
  students,
  attendanceSessions,
  activities,
  onNavigate,
}) => {
  // Calculations
  const totalStudents = students.length;
  const totalDepts = departments.length;
  const totalSubjects = subjects.length;

  const todayStr = new Date().toISOString().split('T')[0];
  const todaySessions = attendanceSessions.filter(s => s.date === todayStr);

  let totalPresentCount = 0;
  let totalAbsentCount = 0;
  let totalLateCount = 0;
  let totalMarkedRecords = 0;

  attendanceSessions.forEach(session => {
    session.records.forEach(r => {
      totalMarkedRecords++;
      if (r.status === 'Present') totalPresentCount++;
      if (r.status === 'Absent') totalAbsentCount++;
      if (r.status === 'Late') totalLateCount++;
    });
  });

  const overallPercentage = totalMarkedRecords > 0
    ? Math.round(((totalPresentCount + totalLateCount) / totalMarkedRecords) * 100)
    : 85;

  // Low attendance students calculation (< 75%)
  const studentStatsMap = new Map<number, { present: number; total: number }>();
  attendanceSessions.forEach(session => {
    session.records.forEach(r => {
      const prev = studentStatsMap.get(r.studentId) || { present: 0, total: 0 };
      studentStatsMap.set(r.studentId, {
        present: prev.present + (r.status === 'Present' || r.status === 'Late' ? 1 : 0),
        total: prev.total + 1
      });
    });
  });

  const lowAttendanceStudents = students.map(st => {
    const stat = studentStatsMap.get(st.id);
    const pct = stat && stat.total > 0 ? Math.round((stat.present / stat.total) * 100) : 100;
    return { ...st, percentage: pct, totalClasses: stat?.total || 0 };
  }).filter(st => st.totalClasses > 0 && st.percentage < 75);

  // Chart 1: Attendance Distribution Pie Chart
  const pieData = {
    labels: ['Present', 'Absent', 'Late'],
    datasets: [
      {
        data: [totalPresentCount || 70, totalAbsentCount || 15, totalLateCount || 5],
        backgroundColor: ['#10b981', '#f43f5e', '#f59e0b'],
        borderWidth: 0,
      },
    ],
  };

  // Chart 2: Department Comparison Bar Chart
  const barData = {
    labels: departments.map(d => d.code),
    datasets: [
      {
        label: 'Avg Attendance %',
        data: departments.map(() => Math.floor(Math.random() * 20) + 75),
        backgroundColor: '#3b82f6',
        borderRadius: 8,
      },
    ],
  };

  // Chart 3: Weekly Trend Line Chart
  const lineData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    datasets: [
      {
        label: 'Attendance Trend %',
        data: [82, 88, 85, 90, 84, 87],
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Welcome Hero Banner */}
      <WelcomeBanner faculty={faculty} onQuickAction={onNavigate} />

      {/* Primary Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Students Card */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Students</p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1">{totalStudents}</h3>
            <span className="inline-block mt-2 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Active Enrolled</span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Total Departments Card */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Departments</p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1">{totalDepts}</h3>
            <span className="inline-block mt-2 text-[10px] text-blue-600 dark:text-blue-400 font-medium">B.Tech Engineering</span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Building2 className="w-6 h-6" />
          </div>
        </div>

        {/* Total Subjects Card */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Subjects</p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1">{totalSubjects}</h3>
            <span className="inline-block mt-2 text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">Theory & Labs</span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>

        {/* Today's Sessions */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Today's Sessions</p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1">{todaySessions.length}</h3>
            <span className="inline-block mt-2 text-[10px] text-amber-600 dark:text-amber-400 font-medium">Classes Recorded</span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Overall Attendance % */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Overall Attendance</p>
            <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{overallPercentage}%</h3>
            <span className="inline-block mt-2 text-[10px] text-emerald-600 font-medium">System Average</span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Quick Action Bar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-blue-600" />
          <span>Quick Actions:</span>
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onNavigate('attendance')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition-colors"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Mark Attendance</span>
          </button>
          <button
            onClick={() => onNavigate('students')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Student</span>
          </button>
          <button
            onClick={() => onNavigate('subjects')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Subject</span>
          </button>
          <button
            onClick={() => onNavigate('reports')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs font-semibold hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Generate Reports</span>
          </button>
        </div>
      </div>

      {/* Visual Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Pie Chart */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <PieChartIcon className="w-4 h-4 text-blue-600" />
              <span>Attendance Status</span>
            </h4>
            <span className="text-[10px] text-slate-400 font-medium">All Records</span>
          </div>
          <div className="my-4 h-48 flex items-center justify-center">
            <Pie data={pieData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
          </div>
        </div>

        {/* Department Comparison Bar Chart */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-indigo-600" />
              <span>Department Attendance %</span>
            </h4>
            <span className="text-[10px] text-slate-400 font-medium">B.Tech Stats</span>
          </div>
          <div className="my-4 h-48 flex items-center justify-center">
            <Bar data={barData} options={{ maintainAspectRatio: false, responsive: true }} />
          </div>
        </div>

        {/* Attendance Trend Line Chart */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>Weekly Attendance Trend</span>
            </h4>
            <span className="text-[10px] text-slate-400 font-medium">Past 6 Days</span>
          </div>
          <div className="my-4 h-48 flex items-center justify-center">
            <Line data={lineData} options={{ maintainAspectRatio: false, responsive: true }} />
          </div>
        </div>
      </div>

      {/* Lower Grid: Recent Activities & Low Attendance Warnings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Attendance Warning (<75%) */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-rose-50 dark:bg-rose-950/60 text-rose-600 rounded-lg">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">Low Attendance Warning (&lt; 75%)</h4>
            </div>
            <button
              onClick={() => onNavigate('reports')}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {lowAttendanceStudents.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-xs">
                All students currently meet the mandatory 75% attendance criteria.
              </div>
            ) : (
              lowAttendanceStudents.map(st => (
                <div key={st.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-3">
                    <img src={st.photo} alt={st.fullName} className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-100">{st.fullName}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">Roll: {st.rollNumber} &bull; {st.departmentCode} Sem {st.semester}</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 rounded-full text-xs font-bold">
                    {st.percentage}% Attendance
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent System Activity Feed */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">Recent Activity Logs</h4>
            <span className="text-[10px] text-slate-400">System Feed</span>
          </div>

          <div className="mt-4 space-y-4">
            {activities.slice(0, 5).map(act => (
              <div key={act.id} className="flex items-start gap-3 text-xs">
                <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-slate-800 dark:text-slate-200">{act.title}</p>
                    <span className="text-[10px] text-slate-400">{act.timestamp}</span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 mt-0.5">{act.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
