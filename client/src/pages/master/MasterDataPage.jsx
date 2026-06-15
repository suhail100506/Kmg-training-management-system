import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { Plus, Edit, Trash2, Power, PowerOff, Database, Loader2 } from 'lucide-react';

import * as masterApi from '../../api/master.api';
import PageTitle from '../../components/common/PageTitle';
import ConfirmDialog from '../../components/common/ConfirmDialog';

import 'react-toastify/dist/ReactToastify.css';

const MasterDataPage = () => {
  const [activeTab, setActiveTab] = useState('designation'); // 'designation', 'groupName', 'productDivision', 'department'
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal / Input States
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('add'); // 'add' or 'edit'
  const [editId, setEditId] = useState(null);
  const [inputValue, setInputValue] = useState('');
  
  // Deletion States
  const [deleteId, setDeleteId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const tabs = [
    { id: 'designation', label: 'Designations' },
    { id: 'groupName', label: 'Group Names' },
    { id: 'productDivision', label: 'Product Divisions' },
    { id: 'department', label: 'Departments' }
  ];

  const fetchItems = async () => {
    setLoading(true);
    try {
      // Query with all=true to see both active and deactivated parameters
      const response = await masterApi.getMasterData(activeTab, true);
      setItems(response.data.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to retrieve master dropdown values.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [activeTab]);

  const handleToggleActive = async (item) => {
    try {
      await masterApi.updateMasterValue(activeTab, item._id, {
        isActive: !item.isActive
      });
      toast.success(`Value status updated.`);
      fetchItems();
    } catch (err) {
      console.error(err);
      toast.error('Failed to update status.');
    }
  };

  const handleOpenAdd = () => {
    setModalType('add');
    setInputValue('');
    setModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setModalType('edit');
    setEditId(item._id);
    setInputValue(item.value);
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!inputValue || inputValue.trim() === '') {
      toast.warning('Please enter a value.');
      return;
    }

    try {
      if (modalType === 'add') {
        await masterApi.addMasterValue(activeTab, inputValue.trim());
        toast.success('Value added successfully!');
      } else {
        await masterApi.updateMasterValue(activeTab, editId, {
          value: inputValue.trim()
        });
        toast.success('Value updated successfully!');
      }
      setModalOpen(false);
      fetchItems();
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.message || 'Failed to save master data.';
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
      await masterApi.deleteMasterValue(activeTab, deleteId);
      toast.success('Master value deleted successfully.');
      fetchItems();
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete master value.');
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageTitle title="Master Data Configuration" subtitle="Configure list items dynamically for designation, group, division and department dropdowns" />
        
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-brand-700 hover:bg-brand-800 text-white text-xs font-bold rounded-xl shadow-md transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Option</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-1 overflow-x-auto pb-px">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-xs font-bold whitespace-nowrap border-b-2 transition-all ${
              activeTab === tab.id
                ? 'border-brand-700 text-brand-700 dark:border-brand-400 dark:text-brand-400 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Roster Grid */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-850/50 rounded-2xl shadow-sm overflow-hidden text-xs">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-3">
            <Loader2 className="w-8 h-8 text-brand-700 animate-spin" />
            <span className="text-slate-500 font-semibold">Syncing master values...</span>
          </div>
        ) : items.length === 0 ? (
          <div className="py-20 text-center text-slate-400">
            No values registered. Click "Add Option" to insert your first option.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200/50 dark:border-slate-850/40 text-slate-500 font-extrabold text-[10px] uppercase tracking-wider">
                  <th className="px-6 py-3">Value Option</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-850 text-slate-700 dark:text-slate-350">
                {items.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/20">
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{item.value}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        item.isActive
                          ? 'bg-green-55 text-green-700 border-green-250 dark:bg-green-950/20 dark:text-green-400'
                          : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-850 dark:text-slate-450 dark:border-slate-800'
                      }`}>
                        {item.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleToggleActive(item)}
                        className={`p-1.5 transition-all rounded-lg hover:bg-slate-100 dark:hover:bg-slate-805 ${
                          item.isActive ? 'text-emerald-600' : 'text-slate-400'
                        }`}
                        title={item.isActive ? 'Deactivate Option' : 'Activate Option'}
                      >
                        {item.isActive ? <Power className="w-4 h-4" /> : <PowerOff className="w-4 h-4" />}
                      </button>

                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="p-1.5 text-slate-500 hover:text-brand-700 dark:hover:text-brand-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-805"
                        title="Edit value text"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDeleteTrigger(item._id)}
                        className="p-1.5 text-slate-500 hover:text-red-655 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-805"
                        title="Delete parameter option"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm border border-slate-200/50 dark:border-slate-800/50 rounded-2xl shadow-xl p-6">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2 mb-4">
              <Database className="w-4 h-4 text-brand-700" />
              <span>{modalType === 'add' ? 'Add Dropdown Value' : 'Edit Dropdown Value'}</span>
            </h3>
            
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1 text-xs">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Option Value Text*</label>
                <input
                  type="text"
                  placeholder="e.g. Sales Director"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none dark:text-white"
                  autoFocus
                />
              </div>

              <div className="flex items-center justify-end space-x-2.5">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3.5 py-2 bg-slate-105 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-350 font-bold rounded-xl text-xs transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-700 hover:bg-brand-800 text-white font-bold rounded-xl text-xs transition-all shadow-md"
                >
                  Save Option
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation popup */}
      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Confirm Parameter Deletion"
        message="Are you sure you want to delete this master value? This will remove it from future record entry dropdown forms."
      />

      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
};

export default MasterDataPage;
