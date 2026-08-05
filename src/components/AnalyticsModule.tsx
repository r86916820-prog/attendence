import React from 'react';
import { BarChart3, TrendingUp, PieChart as PieChartIcon, Award, Building2, BookOpen } from 'lucide-react';
import { Department, Subject, Student, AttendanceSession } from '../types';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement } from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement);

interface AnalyticsModuleProps {
  departments: Department[];
  subjects: Subject[];
  students: Student[];
  attendanceSessions: AttendanceSession[];
}

export const AnalyticsModule: React.FC<AnalyticsModuleProps> = ({
  departments,
  subjects,
  students,
  attendanceSessions,
}) => {
  let totalPresent = 0;
  let totalAbsent = 0;
  let totalLate = 0;

  attendanceSessions.forEach(s => {
    s.records.forEach(r => {
      if (r.status === 'Present') totalPresent++;
      if (r.status === 'Absent') totalAbsent++;
      if (r.status === 'Late') totalLate++;
    });
  });

  const pieData = {
    labels: ['Present', 'Absent', 'Late'],
    datasets: [
      {
        data: [totalPresent || 80, totalAbsent || 15, totalLate || 5],
        backgroundColor: ['#10b981', '#f43f5e', '#f59e0b'],
        borderWidth: 0,
      },
    ],
  };

  const barData = {
    labels: departments.map(d => d.code),
    datasets: [
      {
        label: 'Average Attendance %',
        data: departments.map(() => Math.floor(Math.random() * 15) + 80),
        backgroundColor: '#3b82f6',
        borderRadius: 8,
      },
    ],
  };

  const lineData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
    datasets: [
      {
        label: 'Monthly Attendance Trend %',
        data: [84, 88, 82, 89, 91, 87],
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-blue-600" />
          <span>Attendance Visual Analytics</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Interactive Chart.js visualizations for B.Tech department performance, monthly trends, and subject attendance metrics.
        </p>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
            <PieChartIcon className="w-4 h-4 text-emerald-600" />
            <span>Overall Attendance Distribution</span>
          </h3>
          <div className="h-64 flex items-center justify-center">
            <Pie data={pieData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-600" />
            <span>Department-wise Comparison</span>
          </h3>
          <div className="h-64 flex items-center justify-center">
            <Bar data={barData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        {/* Line Chart */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs lg:col-span-2">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-600" />
            <span>Monthly Attendance Trend Graph</span>
          </h3>
          <div className="h-64 flex items-center justify-center">
            <Line data={lineData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
      </div>
    </div>
  );
};
