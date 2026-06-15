import React from 'react';
import { Inbox } from 'lucide-react';

const EmptyState = ({ message = 'No records found. Try adjusting your filters.' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-400 dark:text-slate-500 mb-4">
        <Inbox className="w-10 h-10" />
      </div>
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400 max-w-sm">
        {message}
      </p>
    </div>
  );
};

export default EmptyState;
