import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="flex flex-col items-center space-y-3">
        <div className="w-8 h-8 border-3 border-brand-700 border-t-transparent rounded-full animate-spin dark:border-brand-400"></div>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Fetching details...</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;
