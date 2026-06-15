import axiosInstance from './axiosInstance';

export const getUsers = (params) => {
  return axiosInstance.get('/users', { params });
};

export const createUser = (data) => {
  return axiosInstance.post('/users', data);
};

export const getUserById = (id) => {
  return axiosInstance.get(`/users/${id}`);
};

export const updateUser = (id, data) => {
  return axiosInstance.put(`/users/${id}`, data);
};

export const activateUser = (id) => {
  return axiosInstance.patch(`/users/${id}/activate`);
};

export const deactivateUser = (id) => {
  return axiosInstance.patch(`/users/${id}/deactivate`);
};

export const deleteUser = (id) => {
  return axiosInstance.delete(`/users/${id}`);
};
