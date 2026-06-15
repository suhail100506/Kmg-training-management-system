import axiosInstance from './axiosInstance';

export const getMasterData = (type, all = false) => {
  return axiosInstance.get(`/master/${type}`, {
    params: { all: all ? 'true' : 'false' }
  });
};

export const addMasterValue = (type, value) => {
  return axiosInstance.post(`/master/${type}`, { value });
};

export const updateMasterValue = (type, id, data) => {
  return axiosInstance.put(`/master/${type}/${id}`, data);
};

export const deleteMasterValue = (type, id) => {
  return axiosInstance.delete(`/master/${type}/${id}`);
};
