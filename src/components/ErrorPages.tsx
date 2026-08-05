import React from 'react';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';

interface ErrorPageProps {
  type: '404' | '500';
  onHome: () => void;
}

export const ErrorPage: React.FC<ErrorPageProps> = ({ type, onHome }) => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700">
      <div className="w-16 h-16 rounded-3xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center mb-4">
        <AlertTriangle className="w-8 h-8" />
      </div>

      <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">
        {type === '404' ? '404 - Page Not Found' : '500 - Internal Server Error'}
      </h2>

      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 max-w-md leading-relaxed">
        {type === '404'
          ? 'The resource or page you are attempting to reach does not exist or has been moved.'
          : 'An unexpected internal error occurred in the attendance database pipeline.'}
      </p>

      <button
        onClick={onHome}
        className="mt-6 flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
      >
        <Home className="w-4 h-4" />
        <span>Return to Main Dashboard</span>
      </button>
    </div>
  );
};
