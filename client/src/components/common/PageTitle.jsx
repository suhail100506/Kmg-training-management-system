import React, { useEffect } from 'react';

const PageTitle = ({ title, subtitle }) => {
  useEffect(() => {
    document.title = `${title} — CDOT TMS`;
  }, [title]);

  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white leading-8">
        {title}
      </h1>
      {subtitle && (
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default PageTitle;
