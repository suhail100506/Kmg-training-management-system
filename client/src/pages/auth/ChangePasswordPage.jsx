import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast, ToastContainer } from 'react-toastify';
import { Lock, ShieldAlert, KeyRound, ArrowLeft } from 'lucide-react';
import PageTitle from '../../components/common/PageTitle';
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
    <div className="space-y-6 pb-12">
      <div className="flex items-center space-x-3">
        {!user?.mustChangePassword && (
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-slate-500" />
          </button>
        )}
        <PageTitle 
          title="Change Password" 
          subtitle={
            user?.mustChangePassword 
              ? "You must update your default password before accessing the system." 
              : "Update your credentials for system access"
          } 
        />
      </div>

      <div className="max-w-md bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-850/50 rounded-2xl p-6 shadow-sm">
        
        {/* First Login Warning Alert Banner */}
        {user?.mustChangePassword && (
          <div className="mb-6 p-3.5 bg-amber-50 dark:bg-amber-950/25 border border-amber-200/50 dark:border-amber-900/30 text-amber-800 dark:text-amber-400 rounded-xl flex items-start space-x-2.5 text-xs">
            <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold">Security Warning</p>
              <p className="mt-0.5">This is your first login or your password has been reset. You must change your temporary password to proceed.</p>
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
                className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-brand-500 dark:text-white transition-all duration-200 ${
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
                className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-brand-500 dark:text-white transition-all duration-200 ${
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
                className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-brand-500 dark:text-white transition-all duration-200 ${
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
            className="w-full py-2.5 bg-brand-700 hover:bg-brand-800 disabled:bg-brand-400 text-white font-semibold rounded-xl transition-all duration-200 shadow-md flex items-center justify-center space-x-2 cursor-pointer"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <span>Update Password</span>
            )}
          </button>
        </form>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default ChangePasswordPage;
