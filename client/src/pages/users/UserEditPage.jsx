import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast, ToastContainer } from 'react-toastify';
import { Save, ArrowLeft, RefreshCw } from 'lucide-react';
import * as yup from 'yup';

import * as userApi from '../../api/user.api';
import PageTitle from '../../components/common/PageTitle';

import 'react-toastify/dist/ReactToastify.css';

// Custom editing validation schema (excludes password checks)
const userEditSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Must be a valid email').required('Email is required'),
  role: yup.string().required('Role is required').oneOf(['admin', 'super_admin'])
});

const UserEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [staffNum, setStaffNum] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(userEditSchema)
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await userApi.getUserById(id);
        const u = response.data.data;
        setStaffNum(u.staffNumber);
        reset({
          name: u.name,
          email: u.email,
          role: u.role
        });
      } catch (err) {
        console.error(err);
        toast.error('Failed to load user account details.');
        navigate('/users');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id, reset, navigate]);

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      await userApi.updateUser(id, data);
      toast.success('User profile updated successfully!');
      setTimeout(() => {
        navigate('/users');
      }, 1500);
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.message || 'Failed to update user profile. Try again.';
      toast.error(errMsg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <RefreshCw className="w-8 h-8 text-brand-700 animate-spin" />
        <span className="text-sm font-medium text-slate-500">Loading user profile...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center space-x-3">
        <button
          onClick={() => navigate('/users')}
          className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-slate-500" />
        </button>
        <PageTitle title="Edit Admin Profile" subtitle={`Staff Number: ${staffNum}`} />
      </div>

      <div className="max-w-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-850/50 rounded-2xl p-6 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          <div className="space-y-4 text-xs">
            {/* User Name */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wider">Account Display Name*</label>
              <input
                type="text"
                className={`w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-500 dark:text-white ${
                  errors.name ? 'border-red-500' : 'border-slate-200 dark:border-slate-800'
                }`}
                {...register('name')}
              />
              {errors.name && <p className="text-[10px] text-red-500 font-semibold">{errors.name.message}</p>}
            </div>

            {/* User Email */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wider">Account Email Address*</label>
              <input
                type="email"
                className={`w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-500 dark:text-white ${
                  errors.email ? 'border-red-500' : 'border-slate-200 dark:border-slate-800'
                }`}
                {...register('email')}
              />
              {errors.email && <p className="text-[10px] text-red-500 font-semibold">{errors.email.message}</p>}
            </div>

            {/* Role dropdown */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wider">Administrative Role*</label>
              <select
                className={`w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-500 dark:text-white ${
                  errors.role ? 'border-red-500' : 'border-slate-200 dark:border-slate-800'
                }`}
                {...register('role')}
              >
                <option value="admin">Admin (Operational privileges)</option>
                <option value="super_admin">Super Admin (System configuration privileges)</option>
              </select>
              {errors.role && <p className="text-[10px] text-red-500 font-semibold">{errors.role.message}</p>}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-slate-100 dark:border-slate-850">
            <button
              type="button"
              disabled={saving}
              onClick={() => navigate('/users')}
              className="px-4 py-2.5 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs hover:bg-slate-50 dark:hover:bg-slate-850/45 transition-all"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 bg-brand-700 hover:bg-brand-800 disabled:bg-brand-400 text-white font-bold rounded-xl text-xs transition-all flex items-center space-x-1.5 shadow-md"
            >
              {saving ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>

      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
};

export default UserEditPage;
