import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { Save, Shield, Compass, Sliders, Settings, Loader2 } from 'lucide-react';

import PageTitle from '../../components/common/PageTitle';

import 'react-toastify/dist/ReactToastify.css';

const SettingsPage = () => {
  const [systemName, setSystemName] = useState('CDOT Training Management System');
  const [fyStartMonth, setFyStartMonth] = useState('4'); // 4 = April, 1 = January
  const [defaultLimit, setDefaultLimit] = useState('25');
  const [minPasswordLength, setMinPasswordLength] = useState('8');
  const [requireComplexity, setRequireComplexity] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API persistence
    setTimeout(() => {
      setLoading(false);
      toast.success('System settings saved successfully!');
    }, 800);
  };

  return (
    <div className="space-y-6 pb-12">
      <PageTitle title="System Settings" subtitle="Configure platform-wide properties, security policies, and localization defaults" />

      <form onSubmit={handleSaveSettings} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Localization & Naming Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-850/50 rounded-2xl p-5 shadow-sm space-y-4 text-xs">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <Compass className="w-4 h-4 text-brand-700" />
            <span>Platform Branding</span>
          </h3>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">System Display Name</label>
            <input
              type="text"
              value={systemName}
              onChange={(e) => setSystemName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none dark:text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Financial Year Start Month</label>
            <select
              value={fyStartMonth}
              onChange={(e) => setFyStartMonth(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 dark:bg-slate-950 dark:border-slate-800 rounded-xl focus:outline-none dark:text-white"
            >
              <option value="4">April (Indian Standard FY)</option>
              <option value="1">January (Calendar Year)</option>
            </select>
          </div>
        </div>

        {/* Security & Access Policies Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-850/50 rounded-2xl p-5 shadow-sm space-y-4 text-xs">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <Shield className="w-4 h-4 text-brand-700" />
            <span>Password & Security Policy</span>
          </h3>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Minimum Password Length</label>
            <select
              value={minPasswordLength}
              onChange={(e) => setMinPasswordLength(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 dark:bg-slate-950 dark:border-slate-800 rounded-xl focus:outline-none dark:text-white"
            >
              <option value="8">8 Characters</option>
              <option value="10">10 Characters</option>
              <option value="12">12 Characters</option>
            </select>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div>
              <p className="font-bold text-slate-800 dark:text-slate-200">Enforce Complexity Rules</p>
              <p className="text-[10px] text-slate-400">Requires uppercase, lowercase, numbers, and symbols.</p>
            </div>
            <input
              type="checkbox"
              checked={requireComplexity}
              onChange={(e) => setRequireComplexity(e.target.checked)}
              className="w-4 h-4 text-brand-700 border-slate-300 rounded focus:ring-brand-500"
            />
          </div>
        </div>

        {/* Pagination & Limits Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-850/50 rounded-2xl p-5 shadow-sm space-y-4 text-xs">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-brand-700" />
            <span>Display Limits</span>
          </h3>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Default Table Pagination Limit</label>
            <select
              value={defaultLimit}
              onChange={(e) => setDefaultLimit(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 dark:bg-slate-950 dark:border-slate-800 rounded-xl focus:outline-none dark:text-white"
            >
              <option value="10">10 Records</option>
              <option value="25">25 Records</option>
              <option value="50">50 Records</option>
              <option value="100">100 Records</option>
            </select>
          </div>

          <div className="pt-8">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-brand-700 hover:bg-brand-800 disabled:bg-brand-400 text-white font-bold rounded-xl flex items-center justify-center space-x-2 transition-all shadow-md shadow-brand-750/20"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Configuration</span>
                </>
              )}
            </button>
          </div>
        </div>

      </form>
      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
};

export default SettingsPage;
