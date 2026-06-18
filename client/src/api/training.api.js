import axiosInstance from './axiosInstance';

export const getTrainingRecords = (params) => {
  return axiosInstance.get('/training', { params });
};

export const createTrainingRecord = (data) => {
  return axiosInstance.post('/training', data);
};

export const getTrainingRecordById = (id) => {
  return axiosInstance.get(`/training/${id}`);
};

export const updateTrainingRecord = (id, data) => {
  return axiosInstance.put(`/training/${id}`, data);
};

export const deleteTrainingRecord = (id) => {
  return axiosInstance.delete(`/training/${id}`);
};

export const deleteTrainingRecordsBulk = (ids) => {
  return axiosInstance.post('/training/bulk-delete', { ids });
};

export const checkDuplicate = (params) => {
  return axiosInstance.get('/training/check-duplicate', { params });
};
