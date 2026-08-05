import React from 'react';
import { Calendar, CheckCircle2, UserCheck, Sparkles } from 'lucide-react';
import { FacultyUser } from '../types';

interface WelcomeBannerProps {
  faculty: FacultyUser;
  onQuickAction: (action: string) => void;
}

export const WelcomeBanner: React.FC<WelcomeBannerProps> = ({ faculty, onQuickAction }) => {
  const todayStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white p-6 md:p-8 shadow-xl shadow-blue-600/15">
      {/* Background Decorative Shapes */}
      <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute right-1/3 -top-10 w-40 h-40 bg-indigo-400/20 rounded-full blur-xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-blue-100 mb-3 border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Smart Attendance Dashboard</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Welcome back, {faculty.fullName}!
          </h2>
          <p className="text-sm text-blue-100/90 mt-1.5 max-w-xl leading-relaxed">
            {faculty.designation} &bull; {faculty.department}
          </p>
          <div className="flex items-center gap-2 text-xs text-blue-200 mt-3 font-medium">
            <Calendar className="w-4 h-4 text-blue-300" />
            <span>{todayStr}</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onQuickAction('attendance')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white text-blue-700 font-bold rounded-xl text-xs hover:bg-blue-50 shadow-md transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
            <span>Mark Today's Attendance</span>
          </button>
          <button
            onClick={() => onQuickAction('students')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/15 hover:bg-white/25 text-white font-semibold rounded-xl text-xs border border-white/25 backdrop-blur-md transition-all"
          >
            <UserCheck className="w-4 h-4" />
            <span>Manage Students</span>
          </button>
        </div>
      </div>
    </div>
  );
};
