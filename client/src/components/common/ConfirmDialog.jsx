import React, { useState } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Deletion',
  message = 'Are you sure you want to delete this record? This action cannot be undone.'
}) => {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
      onClose();
    } catch (err) {
      console.error('Action confirmation failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-800/50 p-6 animate-in fade-in duration-200">
        <div className="flex items-start space-x-4">
          <div className="p-2.5 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-xl shrink-0">
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin text-red-600 dark:text-red-400" />
            ) : (
              <AlertTriangle className="w-5 h-5" />
            )}
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">
              {title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex items-center justify-end space-x-3">
          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-350 font-medium rounded-xl text-xs transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={handleConfirm}
            className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl text-xs transition-all duration-200 shadow-sm shadow-red-655/20 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center space-x-1.5"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <span>Delete</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
