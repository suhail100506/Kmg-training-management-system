import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { Plus, Search, Edit, Trash2, Power, PowerOff, ShieldAlert } from 'lucide-react';

import * as userApi from '../../api/user.api';
import { usePagination } from '../../hooks/usePagination';
import PageTitle from '../../components/common/PageTitle';
import DataTable from '../../components/common/DataTable';
import ConfirmDialog from '../../components/common/ConfirmDialog';

import 'react-toastify/dist/ReactToastify.css';

const UserListPage = () => {
  const { page, limit, total, totalPages, setTotal, setTotalPages, handlePageChange, handleLimitChange } = usePagination(10);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Deletion/Toggling States
  const [deleteId, setDeleteId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await userApi.getUsers({
        page,
        limit,
        search: search || undefined
      });
      const { data, pagination } = response.data;
      setUsers(data);
      setTotal(pagination.total);
      setTotalPages(pagination.totalPages);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load users list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, limit]);

  const handleToggleStatus = async (userObj) => {
    try {
      if (userObj.isActive) {
        await userApi.deactivateUser(userObj._id);
        toast.success(`User ${userObj.name} deactivated.`);
      } else {
        await userApi.activateUser(userObj._id);
        toast.success(`User ${userObj.name} activated.`);
      }
      fetchUsers();
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.message || 'Failed to toggle status.';
      toast.error(errMsg);
    }
  };

  const handleDeleteTrigger = (id) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      await userApi.deleteUser(deleteId);
      toast.success('User account deleted successfully.');
      fetchUsers();
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.message || 'Failed to delete user.';
      toast.error(errMsg);
    } finally {
      setDeleteId(null);
    }
  };

  const columns = [
    { header: 'Staff Number', key: 'staffNumber' },
    { header: 'Name', key: 'name' },
    { header: 'Email', key: 'email' },
    {
      header: 'Role',
      render: (row) => (
        <span className="capitalize font-semibold text-slate-700 dark:text-slate-300">
          {row.role.replace('_', ' ')}
        </span>
      )
    },
    {
      header: 'Status',
      render: (row) => (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
          row.isActive 
            ? 'bg-green-55 text-green-700 border-green-250 dark:bg-green-950/20 dark:text-green-400' 
            : 'bg-red-50 text-red-700 border-red-250 dark:bg-red-950/20 dark:text-red-400'
        }`}>
          {row.isActive ? 'Active' : 'Inactive'}
        </span>
      )
    },
    {
      header: 'Created On',
      render: (row) => new Date(row.createdAt).toLocaleDateString('en-IN')
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center space-x-2">
          {/* Status Toggle */}
          <button
            onClick={() => row.role !== 'super_admin' && handleToggleStatus(row)}
            disabled={row.role === 'super_admin'}
            className={`p-1 transition-colors ${
              row.role === 'super_admin'
                ? 'text-slate-300 dark:text-slate-700 cursor-not-allowed opacity-50'
                : row.isActive 
                  ? 'text-emerald-600 hover:text-emerald-700' 
                  : 'text-slate-400 hover:text-slate-600'
            }`}
            title={row.role === 'super_admin' ? 'Cannot Deactivate Super Admin' : (row.isActive ? 'Deactivate User' : 'Activate User')}
          >
            {row.isActive ? <Power className="w-4 h-4" /> : <PowerOff className="w-4 h-4" />}
          </button>
          
          <Link
            to={`/users/${row._id}/edit`}
            className="p-1 text-slate-500 hover:text-brand-700 dark:hover:text-brand-400"
            title="Edit User"
          >
            <Edit className="w-4 h-4" />
          </Link>
          
          <button
            onClick={() => row.role !== 'super_admin' && handleDeleteTrigger(row._id)}
            disabled={row.role === 'super_admin'}
            className={`p-1 transition-colors ${
              row.role === 'super_admin'
                ? 'text-slate-300 dark:text-slate-700 cursor-not-allowed opacity-50'
                : 'text-slate-500 hover:text-red-655'
            }`}
            title={row.role === 'super_admin' ? 'Cannot Delete Super Admin' : 'Delete User'}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <PageTitle title="User Management" subtitle="Manage administrative roles, activate, deactivate, or soft-delete accounts" />
        
        <Link
          to="/users/add"
          className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-brand-700 hover:bg-brand-800 text-white text-xs font-bold rounded-xl shadow-md transition-all duration-200"
        >
          <Plus className="w-4 h-4" />
          <span>Add Admin User</span>
        </Link>
      </div>

      {/* Search Bar */}
      <form onSubmit={(e) => { e.preventDefault(); fetchUsers(); }} className="flex gap-2 max-w-md bg-white dark:bg-slate-900 p-2 rounded-xl shadow-sm border border-slate-200/50 dark:border-slate-800/50">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search by name, email, staff number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-800 dark:text-white focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-1.5 bg-slate-900 hover:bg-slate-850 dark:bg-brand-700 dark:hover:bg-brand-800 text-white font-bold rounded-lg text-xs transition-all"
        >
          Query
        </button>
      </form>

      {/* DataTable */}
      <DataTable
        columns={columns}
        data={users}
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

      {/* Deletion Dialog */}
      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Confirm User Deletion"
        message="Are you sure you want to delete this administrative account? This will block their dashboard and API access. This action is irreversible."
      />

      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
};

export default UserListPage;
