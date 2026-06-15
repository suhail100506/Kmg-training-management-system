import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { Plus, Search, Eye, Edit, Trash2, SlidersHorizontal, RefreshCw } from 'lucide-react';

import * as trainingApi from '../../api/training.api';
import * as masterApi from '../../api/master.api';
import { usePagination } from '../../hooks/usePagination';
import useAuth from '../../hooks/useAuth';
import { formatDate, formatCurrency } from '../../utils/formatters';
import { TRAINING_TYPE_OPTIONS, TRAINING_MODE_OPTIONS, TRAINING_STATUS_OPTIONS } from '../../utils/constants';

import PageTitle from '../../components/common/PageTitle';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import ExportButtons from '../../components/common/ExportButtons';

import 'react-toastify/dist/ReactToastify.css';

const TrainingListPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { page, limit, total, totalPages, setTotal, setTotalPages, handlePageChange, handleLimitChange } = usePagination(25);

  // Filter States
  const [search, setSearch] = useState('');
  const [staffNumber, setStaffNumber] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedMode, setSelectedMode] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedFY, setSelectedFY] = useState('');

  // Dropdown Caches
  const [groups, setGroups] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [fyOptions, setFYOptions] = useState(['FY 2023-24', 'FY 2024-25', 'FY 2025-26', 'FY 2026-27']);

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Deletion States
  const [deleteId, setDeleteId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Load cache options on mount
  useEffect(() => {
    const fetchMasterOptions = async () => {
      try {
        const [gRes, dRes] = await Promise.all([
          masterApi.getMasterData('groupName'),
          masterApi.getMasterData('productDivision')
        ]);
        setGroups(gRes.data.data);
        setDivisions(dRes.data.data);
      } catch (err) {
        console.error('Failed to load filters:', err);
      }
    };
    fetchMasterOptions();
  }, []);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit,
        search: search || undefined,
        staffNumber: staffNumber || undefined,
        group: selectedGroup || undefined,
        division: selectedDivision || undefined,
        type: selectedType || undefined,
        mode: selectedMode || undefined,
        status: selectedStatus || undefined,
        financialYear: selectedFY || undefined
      };

      const response = await trainingApi.getTrainingRecords(params);
      const { data, pagination } = response.data;
      setRecords(data);
      setTotal(pagination.total);
      setTotalPages(pagination.totalPages);
    } catch (err) {
      console.error('Fetch records fail:', err);
      toast.error('Failed to retrieve training records.');
    } finally {
      setLoading(false);
    }
  };

  // Trigger fetch on filter / page changes
  useEffect(() => {
    fetchRecords();
  }, [page, limit, selectedGroup, selectedDivision, selectedType, selectedMode, selectedStatus, selectedFY]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchRecords();
  };

  const handleResetFilters = () => {
    setSearch('');
    setStaffNumber('');
    setSelectedGroup('');
    setSelectedDivision('');
    setSelectedType('');
    setSelectedMode('');
    setSelectedStatus('');
    setSelectedFY('');
    toast.info('Filters cleared');
  };

  const handleDeleteTrigger = (id) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      await trainingApi.deleteTrainingRecord(deleteId);
      toast.success('Training record deleted successfully.');
      fetchRecords();
    } catch (err) {
      console.error('Deletion error:', err);
      toast.error('Failed to delete training record.');
    } finally {
      setDeleteId(null);
    }
  };

  // Define Table Columns
  const columns = [
    {
      header: '#',
      render: (row, idx) => (page - 1) * limit + idx + 1
    },
    {
      header: 'Staff Info',
      render: (row) => (
        <div>
          <p className="font-bold text-slate-900 dark:text-white">{row.staffNumber}</p>
          <p className="text-[10px] text-slate-500">{row.staffName}</p>
        </div>
      )
    },
    { header: 'Group Name', key: 'groupName' },
    { header: 'Training Topic', key: 'trainingTopic' },
    { header: 'Trainer Name', key: 'trainerName' },
    { header: 'Module #', key: 'trainingModuleNumber' },
    { header: 'Training Type', key: 'typeOfTraining' },
    { header: 'Mode', key: 'trainingMode' },
    {
      header: 'Duration',
      render: (row) => `${row.trainingDurationHours} hrs`
    },
    {
      header: 'Dates',
      render: (row) => (
        <div>
          <p>{formatDate(row.startDateOfTraining)}</p>
          <p className="text-[9px] text-slate-400">to {formatDate(row.endDateOfTraining)}</p>
        </div>
      )
    },
    {
      header: 'Processed Date',
      render: (row) => formatDate(row.requestProcessedDate)
    },
    {
      header: 'Status',
      render: (row) => <StatusBadge status={row.trainingStatus} />
    },
    {
      header: 'Cost',
      render: (row) => formatCurrency(row.trainingCostPerPerson)
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center space-x-2">
          <Link 
            to={`/training/${row._id}/view`} 
            className="p-1 text-slate-500 hover:text-brand-700 dark:hover:text-brand-400"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </Link>
          <Link 
            to={`/training/${row._id}/edit`} 
            className="p-1 text-slate-500 hover:text-brand-700 dark:hover:text-brand-400"
            title="Edit Record"
          >
            <Edit className="w-4 h-4" />
          </Link>
          <button 
            onClick={() => handleDeleteTrigger(row._id)}
            className="p-1 text-slate-500 hover:text-red-600"
            title="Delete Record"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  // Active filters bundle to pass to report downloads
  const activeFilters = {
    search: search || undefined,
    staffNumber: staffNumber || undefined,
    group: selectedGroup || undefined,
    division: selectedDivision || undefined,
    type: selectedType || undefined,
    mode: selectedMode || undefined,
    status: selectedStatus || undefined,
    financialYear: selectedFY || undefined
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <PageTitle 
          title="Training Records" 
          subtitle="Manage manual entries, search files, and download tabular reports" 
        />
        
        {/* Top Right Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center space-x-1.5 px-3.5 py-2 border rounded-xl text-xs font-semibold shadow-sm transition-all duration-200 ${
              showFilters 
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white border-slate-300' 
                : 'bg-white dark:bg-slate-900 text-slate-650 hover:bg-slate-50 dark:hover:bg-slate-850 border-slate-200 dark:border-slate-800'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
          </button>

          <ExportButtons reportType="records" filters={activeFilters} />

          <Link
            to="/training/add"
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-brand-700 hover:bg-brand-800 text-white text-xs font-bold rounded-xl shadow-md shadow-brand-750/20 transition-all duration-200"
          >
            <Plus className="w-4 h-4" />
            <span>Add Record</span>
          </Link>
        </div>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl shadow-sm space-y-4 animate-in slide-in-from-top-2 duration-200">
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            {/* Search Input */}
            <div className="relative md:col-span-2">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Search staff, code, or training module topics..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>

            {/* Staff Number Autocomplete Input */}
            <div>
              <input
                type="text"
                placeholder="Filter Staff Number"
                value={staffNumber}
                onChange={(e) => setStaffNumber(e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>

            {/* Submit search */}
            <div>
              <button
                type="submit"
                className="w-full py-2 bg-brand-700 hover:bg-brand-800 text-white font-bold rounded-xl text-xs transition-all duration-200 flex items-center justify-center space-x-1.5 shadow-sm"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Search</span>
              </button>
            </div>
          </form>

          {/* Core filter dropdowns */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 pt-2">
            {/* Group */}
            <div>
              <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-350"
              >
                <option value="">Group: All</option>
                {groups.map(g => <option key={g._id} value={g.value}>{g.value}</option>)}
              </select>
            </div>

            {/* Division */}
            <div>
              <select
                value={selectedDivision}
                onChange={(e) => setSelectedDivision(e.target.value)}
                className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-350"
              >
                <option value="">Division: All</option>
                {divisions.map(d => <option key={d._id} value={d.value}>{d.value}</option>)}
              </select>
            </div>

            {/* Type */}
            <div>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-350"
              >
                <option value="">Type: All</option>
                {TRAINING_TYPE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

            {/* Mode */}
            <div>
              <select
                value={selectedMode}
                onChange={(e) => setSelectedMode(e.target.value)}
                className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-350"
              >
                <option value="">Mode: All</option>
                {TRAINING_MODE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

            {/* Status */}
            <div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-350"
              >
                <option value="">Status: All</option>
                {TRAINING_STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

            {/* FY */}
            <div>
              <select
                value={selectedFY}
                onChange={(e) => setSelectedFY(e.target.value)}
                className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-350"
              >
                <option value="">FY: All</option>
                {fyOptions.map(fy => <option key={fy} value={fy}>{fy}</option>)}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end pt-2">
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white"
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}

      {/* Paginated Table Component */}
      <DataTable 
        columns={columns} 
        data={records} 
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

      {/* Confirmation delete alert popup */}
      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Confirm Record Deletion"
        message="Are you sure you want to delete this training record? This action cannot be undone."
      />

      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
};

export default TrainingListPage;
