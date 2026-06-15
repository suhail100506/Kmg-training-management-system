import axiosInstance from './axiosInstance';

export const getMonthlyReport = (params) => {
  return axiosInstance.get('/reports/monthly', { params });
};

export const getQuarterlyReport = (params) => {
  return axiosInstance.get('/reports/quarterly', { params });
};

export const getFinancialYearReport = (params) => {
  return axiosInstance.get('/reports/financial-year', { params });
};

export const getStaffWiseReport = (params) => {
  return axiosInstance.get('/reports/staff-wise', { params });
};

export const getDepartmentWiseReport = (params) => {
  return axiosInstance.get('/reports/department-wise', { params });
};

export const getCostAnalysisReport = (params) => {
  return axiosInstance.get('/reports/cost-analysis', { params });
};

export const getTrainingStatusReport = (params) => {
  return axiosInstance.get('/reports/training-status', { params });
};

export const getBeneficiaryReport = (params) => {
  return axiosInstance.get('/reports/beneficiaries', { params });
};

export const exportReport = (reportType, format, filters) => {
  return axiosInstance.post('/reports/export', {
    reportType,
    format,
    filters
  }, {
    responseType: 'blob'
  });
};
