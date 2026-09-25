import React from 'react';
import { CheckCircle2, Info, AlertCircle, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Toast: React.FC = () => {
  const { toastMessage, clearToast } = useAuth();

  if (!toastMessage) return null;

  return (
    <aside
      aria-label="Notification"
      aria-live="polite"
      className="fixed bottom-5 right-5 z-50 animate-in slide-in-from-bottom-3 fade-in duration-200"
    >
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-neutral-900 text-white shadow-xl border border-neutral-800 text-xs font-medium">
        {toastMessage.type === 'success' && (
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
        )}
        {toastMessage.type === 'info' && (
          <Info className="w-4 h-4 text-[#FF6124] shrink-0" />
        )}
        {toastMessage.type === 'error' && (
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
        )}

        <span className="text-neutral-100">{toastMessage.text}</span>

        <button
          type="button"
          onClick={clearToast}
          className="p-1 text-neutral-400 hover:text-white rounded transition-colors cursor-pointer ml-1"
          aria-label="Dismiss notification"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};
