import React from 'react';
import { CheckCircle2, AlertCircle, Info, X, AlertTriangle } from 'lucide-react';
import { ToastMessage } from '../types';

interface ToastProps {
  toasts: ToastMessage[];
  onClose: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onClose }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let bg = 'bg-blue-600 text-white';
        let icon = <Info className="w-5 h-5 flex-shrink-0" />;

        if (toast.type === 'success') {
          bg = 'bg-emerald-600 text-white';
          icon = <CheckCircle2 className="w-5 h-5 flex-shrink-0" />;
        } else if (toast.type === 'error') {
          bg = 'bg-rose-600 text-white';
          icon = <AlertCircle className="w-5 h-5 flex-shrink-0" />;
        } else if (toast.type === 'warning') {
          bg = 'bg-amber-600 text-white';
          icon = <AlertTriangle className="w-5 h-5 flex-shrink-0" />;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start justify-between gap-3 p-4 rounded-xl shadow-lg border border-white/10 ${bg} animate-in slide-in-from-top-2 duration-200`}
          >
            <div className="flex items-center gap-3">
              {icon}
              <p className="text-sm font-medium">{toast.message}</p>
            </div>
            <button
              onClick={() => onClose(toast.id)}
              className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
