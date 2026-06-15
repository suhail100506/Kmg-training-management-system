import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

const AccessDeniedPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6 dark:bg-slate-950">
      <div className="max-w-md w-full text-center space-y-6 bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-800/50">
        <div className="inline-flex p-4 bg-red-50 dark:bg-red-950/30 rounded-full text-red-600 dark:text-red-400">
          <ShieldAlert className="w-12 h-12" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Access Denied</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            You do not have the required permissions to access this page. Please contact your system administrator if you believe this is an error.
          </p>
        </div>
        <div>
          <Link
            to="/dashboard"
            className="inline-flex w-full justify-center px-4 py-2.5 bg-brand-700 hover:bg-brand-800 text-white font-medium rounded-xl transition-all duration-200 shadow-sm"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AccessDeniedPage;
