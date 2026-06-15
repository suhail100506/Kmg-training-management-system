import axiosInstance from './axiosInstance';

export const getStaff = (params) => {
  return axiosInstance.get('/staff', { params });
};

export const createStaff = (data) => {
  return axiosInstance.post('/staff', data);
};

export const getStaffById = (id) => {
  return axiosInstance.get(`/staff/${id}`);
};

export const updateStaff = (id, data) => {
  return axiosInstance.put(`/staff/${id}`, data);
};

export const deleteStaff = (id) => {
  return axiosInstance.delete(`/staff/${id}`);
};

export const searchStaff = (q) => {
  return axiosInstance.get('/staff/search', { params: { q } });
};
