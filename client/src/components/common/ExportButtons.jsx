import React from 'react';
import useExport from '../../hooks/useExport';
import { FileSpreadsheet, FileText, Table, Loader2 } from 'lucide-react';

const ExportButtons = ({ reportType, filters = {} }) => {
  const { triggerExport, exporting } = useExport();

  const handleExport = (format) => {
    if (exporting) return;
    triggerExport(reportType, format, filters);
  };

  return (
    <div className="flex items-center space-x-2">
      {/* Excel Export */}
      <button
        type="button"
        disabled={exporting}
        onClick={() => handleExport('excel')}
        className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white text-xs font-bold rounded-xl shadow-sm transition-all duration-200"
        title="Export report as Excel worksheet"
      >
        {exporting ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <FileSpreadsheet className="w-3.5 h-3.5" />
        )}
        <span className="hidden sm:inline">Excel</span>
      </button>

      {/* PDF Export */}
      <button
        type="button"
        disabled={exporting}
        onClick={() => handleExport('pdf')}
        className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400 text-white text-xs font-bold rounded-xl shadow-sm transition-all duration-200"
        title="Export report as print-ready PDF document"
      >
        {exporting ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <FileText className="w-3.5 h-3.5" />
        )}
        <span className="hidden sm:inline">PDF</span>
      </button>

      {/* CSV Export */}
      <button
        type="button"
        disabled={exporting}
        onClick={() => handleExport('csv')}
        className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-slate-600 hover:bg-slate-700 disabled:bg-slate-400 text-white text-xs font-bold rounded-xl shadow-sm transition-all duration-200"
        title="Export report as standard CSV text file"
      >
        {exporting ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <Table className="w-3.5 h-3.5" />
        )}
        <span className="hidden sm:inline">CSV</span>
      </button>
    </div>
  );
};

export default ExportButtons;
