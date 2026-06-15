import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast, ToastContainer } from 'react-toastify';
import { Lock, ShieldAlert, KeyRound } from 'lucide-react';
import { changePasswordSchema } from '../../utils/validators';
import * as authApi from '../../api/auth.api';
import useAuth from '../../hooks/useAuth';

import 'react-toastify/dist/ReactToastify.css';

const ChangePasswordPage = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(changePasswordSchema)
  });

  const onSubmit = async (data) => {
    if (data.currentPassword === data.newPassword) {
      toast.error('New password cannot be the same as your current password.');
      return;
    }

    setLoading(true);
    try {
      await authApi.changePassword(data.currentPassword, data.newPassword);
      toast.success('Password updated successfully!');
      
      // Update local mustChangePassword state
      if (user) {
        const updatedUser = { ...user, mustChangePassword: false };
        setUser(updatedUser);
        sessionStorage.setItem('user', JSON.stringify(updatedUser));
      }

      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 1500);
    } catch (err) {
      console.error('Password change error:', err);
      const errMsg = err.response?.data?.message || 'Failed to change password. Please check your current password.';
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 dark:bg-slate-950 transition-colors duration-200">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-800/50 space-y-6">
          
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 bg-brand-50 dark:bg-brand-950/45 text-brand-700 dark:text-brand-400 rounded-2xl border border-brand-100 dark:border-brand-900/50">
              <KeyRound className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Change Password</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Update your credentials for system access</p>
          </div>

          {/* First Login Warning Alert Banner */}
          {user?.mustChangePassword && (
            <div className="p-3.5 bg-amber-50 dark:bg-amber-950/25 border border-amber-200/50 dark:border-amber-900/30 text-amber-800 dark:text-amber-400 rounded-xl flex items-start space-x-2.5 text-xs">
              <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold">Security Warning</p>
                <p className="mt-0.5">This is your first login or your password has been reset. You must change your temporary password to proceed to the system.</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            {/* Current Password */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-350">Current Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:text-white transition-all duration-200 ${
                    errors.currentPassword ? 'border-red-500 focus:ring-red-400' : 'border-slate-200 dark:border-slate-800'
                  }`}
                  {...register('currentPassword')}
                />
              </div>
              {errors.currentPassword && (
                <p className="text-xs text-red-500 font-medium">{errors.currentPassword.message}</p>
              )}
            </div>

            {/* New Password */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-350">New Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:text-white transition-all duration-200 ${
                    errors.newPassword ? 'border-red-500 focus:ring-red-400' : 'border-slate-200 dark:border-slate-800'
                  }`}
                  {...register('newPassword')}
                />
              </div>
              {errors.newPassword && (
                <p className="text-xs text-red-500 font-medium">{errors.newPassword.message}</p>
              )}
            </div>

            {/* Confirm New Password */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-350">Confirm New Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:text-white transition-all duration-200 ${
                    errors.confirmPassword ? 'border-red-500 focus:ring-red-400' : 'border-slate-200 dark:border-slate-800'
                  }`}
                  {...register('confirmPassword')}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-500 font-medium">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-brand-700 hover:bg-brand-800 disabled:bg-brand-400 text-white font-semibold rounded-xl transition-all duration-200 shadow-md flex items-center justify-center space-x-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <span>Update Password</span>
              )}
            </button>
          </form>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default ChangePasswordPage;
