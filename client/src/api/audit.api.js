import axiosInstance from './axiosInstance';

export const getAuditLogs = (params) => {
  return axiosInstance.get('/audit', { params });
};

export const getAuditLogById = (id) => {
  return axiosInstance.get(`/audit/${id}`);
};
