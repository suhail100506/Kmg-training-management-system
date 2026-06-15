import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { Eye, ArrowLeft, RefreshCw, Layers } from 'lucide-react';

import * as uploadApi from '../../api/upload.api';
import { usePagination } from '../../hooks/usePagination';
import PageTitle from '../../components/common/PageTitle';
import DataTable from '../../components/common/DataTable';

import 'react-toastify/dist/ReactToastify.css';

const UploadBatchListPage = () => {
  const { page, limit, total, totalPages, setTotal, setTotalPages, handlePageChange, handleLimitChange } = usePagination(10);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBatches = async () => {
    setLoading(true);
    try {
      const response = await uploadApi.getUploadBatches({ page, limit });
      const { data, pagination } = response.data;
      setBatches(data);
      setTotal(pagination.total);
      setTotalPages(pagination.totalPages);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load upload batch history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, [page, limit]);

  const columns = [
    {
      header: 'Batch ID',
      render: (row) => (
        <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
          {row.batchId.slice(0, 8)}...
        </span>
      )
    },
    { header: 'File Name', key: 'fileName' },
    {
      header: 'Type',
      render: (row) => (
        <span className="capitalize px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold">
          {row.batchType || 'training'}
        </span>
      )
    },
    {
      header: 'Uploaded By',
      render: (row) => row.uploadedBy?.name || 'System'
    },
    {
      header: 'Upload Date/Time',
      render: (row) => new Date(row.createdAt).toLocaleString('en-IN')
    },
    { header: 'Total Rows', key: 'totalRows' },
    {
      header: 'Success',
      render: (row) => <span className="font-bold text-emerald-600">{row.successCount}</span>
    },
    {
      header: 'Errors',
      render: (row) => <span className="font-bold text-red-500">{row.errorCount}</span>
    },
    {
      header: 'Duplicates',
      render: (row) => <span className="font-bold text-amber-500">{row.duplicateCount}</span>
    },
    {
      header: 'Status',
      render: (row) => {
        let badgeStyle = 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-350';
        if (row.status === 'completed') badgeStyle = 'bg-emerald-50 text-emerald-700 border-emerald-250 dark:bg-emerald-950/20 dark:text-emerald-450';
        if (row.status === 'failed') badgeStyle = 'bg-red-50 text-red-700 border-red-250 dark:bg-red-950/20 dark:text-red-450';
        if (row.status === 'processing') badgeStyle = 'bg-amber-50 text-amber-700 border-amber-250 dark:bg-amber-950/20 dark:text-amber-450 animate-pulse';

        return (
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border capitalize ${badgeStyle}`}>
            {row.status}
          </span>
        );
      }
    },
    {
      header: 'Actions',
      render: (row) => (
        <Link
          to={`/bulk-upload/history/${row.batchId}`}
          className="p-1 text-slate-500 hover:text-brand-700 dark:hover:text-brand-400 flex items-center space-x-1"
          title="View Details"
        >
          <Eye className="w-4 h-4" />
          <span className="text-[10px] font-bold">Details</span>
        </Link>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Link
          to="/bulk-upload"
          className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-slate-500" />
        </Link>
        <PageTitle title="Bulk Upload History" subtitle="Review past spreadsheet validation batch results" />
      </div>

      <DataTable
        columns={columns}
        data={batches}
        loading={loading}
        pagination={{
          page,
          limit,
          total,
          totalPages,
          handlePageChange,
          handleLimitChange
        }}
      />

      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
};

export default UploadBatchListPage;
