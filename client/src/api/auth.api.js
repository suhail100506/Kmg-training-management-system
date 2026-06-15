import axiosInstance from './axiosInstance';

export const login = (email, password) => {
  return axiosInstance.post('/auth/login', { email, password });
};

export const logout = () => {
  return axiosInstance.post('/auth/logout');
};

export const changePassword = (currentPassword, newPassword) => {
  return axiosInstance.post('/auth/change-password', { currentPassword, newPassword });
};

export const getMe = () => {
  return axiosInstance.get('/auth/me');
};

export const refresh = () => {
  return axiosInstance.post('/auth/refresh');
};
