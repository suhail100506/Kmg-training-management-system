import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { SlidersHorizontal, RefreshCw } from 'lucide-react';
import * as masterApi from '../../api/master.api';
import { 
  TRAINING_TYPE_OPTIONS, 
  TRAINING_MODE_OPTIONS, 
  TRAINING_STATUS_OPTIONS 
} from '../../utils/constants';

const FilterPanel = ({ onApply, onReset }) => {
  // Master choices state
  const [groups, setGroups] = useState([]);
  const [divisions, setDivisions] = useState([]);
  
  // Selected filter states
  const [financialYear, setFinancialYear] = useState('FY 2025-26');
  const [selectedMonths, setSelectedMonths] = useState([]);
  const [selectedQuarters, setSelectedQuarters] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [selectedDivisions, setSelectedDivisions] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedModes, setSelectedModes] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [filterOperator, setFilterOperator] = useState('and');

  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [gRes, dRes] = await Promise.all([
          masterApi.getMasterData('groupName'),
          masterApi.getMasterData('productDivision')
        ]);
        
        setGroups(gRes.data.data.map(g => ({ value: g.value, label: g.value })));
        setDivisions(dRes.data.data.map(d => ({ value: d.value, label: d.value })));
      } catch (err) {
        console.error('Failed to load master dropdown choices:', err);
      }
    };
    fetchDropdowns();
  }, []);

  const monthOptions = [
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' }
  ];

  const quarterOptions = [
    { value: 'Q1', label: 'Q1 (Apr-Jun)' },
    { value: 'Q2', label: 'Q2 (Jul-Sep)' },
    { value: 'Q3', label: 'Q3 (Oct-Dec)' },
    { value: 'Q4', label: 'Q4 (Jan-Mar)' }
  ];

  const handleApply = () => {
    onApply({
      financialYear,
      month: selectedMonths.map(m => m.value).join(','),
      quarter: selectedQuarters.map(q => q.value).join(','),
      group: selectedGroups.map(g => g.value).join(','),
      division: selectedDivisions.map(d => d.value).join(','),
      type: selectedTypes.map(t => t.value).join(','),
      mode: selectedModes.map(m => m.value).join(','),
      status: selectedStatuses.map(s => s.value).join(','),
      filterOperator
    });
  };

  const handleReset = () => {
    setFinancialYear('FY 2025-26');
    setSelectedMonths([]);
    setSelectedQuarters([]);
    setSelectedGroups([]);
    setSelectedDivisions([]);
    setSelectedTypes([]);
    setSelectedModes([]);
    setSelectedStatuses([]);
    setFilterOperator('and');
    onReset();
  };

  // Custom react-select dark-styling options helper
  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: 'rgb(248 250 252)', // bg-slate-50
      borderRadius: '0.75rem', // rounded-xl
      borderColor: 'rgb(226 232 240)', // border-slate-200
      fontSize: '11px',
      minHeight: '36px'
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: '0 6px'
    })
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-850/50 rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs font-bold text-slate-700 dark:text-slate-350">
        <div className="flex items-center space-x-2">
          <SlidersHorizontal className="w-4 h-4 text-brand-700" />
          <span>REPORT QUERY FILTERS</span>
        </div>

        {/* AND / OR Combination Select */}
        <div className="flex items-center space-x-2 text-[11px]">
          <span className="text-slate-500 font-semibold uppercase tracking-wider">Match Mode:</span>
          <div className="inline-flex rounded-lg border border-slate-200 dark:border-slate-800 p-0.5 bg-slate-50 dark:bg-slate-950">
            <button
              type="button"
              onClick={() => setFilterOperator('and')}
              className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all ${
                filterOperator === 'and'
                  ? 'bg-slate-900 text-white dark:bg-brand-700'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              AND (Match All)
            </button>
            <button
              type="button"
              onClick={() => setFilterOperator('or')}
              className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all ${
                filterOperator === 'or'
                  ? 'bg-slate-900 text-white dark:bg-brand-700'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              OR (Match Any)
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-[11px] font-bold text-slate-600 dark:text-slate-400">
        
        {/* Financial Year Selector */}
        <div className="space-y-1">
          <label className="uppercase tracking-wider">Financial Year</label>
          <select
            value={financialYear}
            onChange={(e) => setFinancialYear(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 dark:bg-slate-950 dark:border-slate-800 rounded-xl focus:outline-none dark:text-white h-9"
          >
            <option value="FY 2024-25">FY 2024-25</option>
            <option value="FY 2025-26">FY 2025-26</option>
            <option value="FY 2026-27">FY 2026-27</option>
          </select>
        </div>

        {/* Quarters Multi-select */}
        <div className="space-y-1">
          <label className="uppercase tracking-wider">Quarters (Indian Fiscal)</label>
          <Select
            isMulti
            options={quarterOptions}
            value={selectedQuarters}
            onChange={setSelectedQuarters}
            styles={customStyles}
            placeholder="Select Quarters"
          />
        </div>

        {/* Months Multi-select */}
        <div className="space-y-1">
          <label className="uppercase tracking-wider">Months</label>
          <Select
            isMulti
            options={monthOptions}
            value={selectedMonths}
            onChange={setSelectedMonths}
            styles={customStyles}
            placeholder="Select Months"
          />
        </div>

        {/* Group Name Multi-select */}
        <div className="space-y-1">
          <label className="uppercase tracking-wider">Groups</label>
          <Select
            isMulti
            options={groups}
            value={selectedGroups}
            onChange={setSelectedGroups}
            styles={customStyles}
            placeholder="Select Groups"
          />
        </div>

        {/* Product Division Multi-select */}
        <div className="space-y-1">
          <label className="uppercase tracking-wider">Product Divisions</label>
          <Select
            isMulti
            options={divisions}
            value={selectedDivisions}
            onChange={setSelectedDivisions}
            styles={customStyles}
            placeholder="Select Divisions"
          />
        </div>

        {/* Training Type Multi-select */}
        <div className="space-y-1">
          <label className="uppercase tracking-wider">Training Types</label>
          <Select
            isMulti
            options={TRAINING_TYPE_OPTIONS}
            value={selectedTypes}
            onChange={setSelectedTypes}
            styles={customStyles}
            placeholder="Select Types"
          />
        </div>

        {/* Training Mode Multi-select */}
        <div className="space-y-1">
          <label className="uppercase tracking-wider">Training Modes</label>
          <Select
            isMulti
            options={TRAINING_MODE_OPTIONS}
            value={selectedModes}
            onChange={setSelectedModes}
            styles={customStyles}
            placeholder="Select Modes"
          />
        </div>

        {/* Training Status Multi-select */}
        <div className="space-y-1">
          <label className="uppercase tracking-wider">Training Statuses</label>
          <Select
            isMulti
            options={TRAINING_STATUS_OPTIONS}
            value={selectedStatuses}
            onChange={setSelectedStatuses}
            styles={customStyles}
            placeholder="Select Statuses"
          />
        </div>

      </div>

      {/* Buttons */}
      <div className="pt-2 flex items-center justify-end space-x-3 text-xs">
        <button
          type="button"
          onClick={handleReset}
          className="text-slate-500 hover:text-slate-800 dark:hover:text-white font-bold"
        >
          Reset Filters
        </button>

        <button
          type="button"
          onClick={handleApply}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-850 dark:bg-brand-700 dark:hover:bg-brand-800 text-white font-bold rounded-xl flex items-center space-x-1.5 shadow-sm transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Apply Filters</span>
        </button>
      </div>

    </div>
  );
};

export default FilterPanel;
