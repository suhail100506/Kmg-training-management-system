import axiosInstance from './axiosInstance';

export const getSummary = (params) => {
  return axiosInstance.get('/dashboard/summary', { params });
};

export const getByMonth = (params) => {
  return axiosInstance.get('/dashboard/by-month', { params });
};

export const getByStatus = (params) => {
  return axiosInstance.get('/dashboard/by-status', { params });
};

export const getByType = (params) => {
  return axiosInstance.get('/dashboard/by-type', { params });
};

export const getByMode = (params) => {
  return axiosInstance.get('/dashboard/by-mode', { params });
};

export const getTopTrainings = (params) => {
  return axiosInstance.get('/dashboard/top-trainings', { params });
};

export const getCostByType = (params) => {
  return axiosInstance.get('/dashboard/cost-by-type', { params });
};

export const getCoverageByGroup = (params) => {
  return axiosInstance.get('/dashboard/coverage-by-group', { params });
};

export const getCoverageByDivision = (params) => {
  return axiosInstance.get('/dashboard/coverage-by-division', { params });
};
