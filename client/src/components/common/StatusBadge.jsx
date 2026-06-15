import React from 'react';

const StatusBadge = ({ status }) => {
  let colorClasses = '';

  switch (status) {
    case 'Completed':
      colorClasses = 'bg-green-50 text-green-700 border-green-200/50 dark:bg-green-950/20 dark:text-green-400 dark:border-green-900/40';
      break;
    case 'Not Completed':
      colorClasses = 'bg-red-50 text-red-700 border-red-200/50 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/40';
      break;
    case 'Cancelled':
      colorClasses = 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700/40';
      break;
    default:
      colorClasses = 'bg-slate-50 text-slate-500 border-slate-100 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800';
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border capitalize ${colorClasses}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
