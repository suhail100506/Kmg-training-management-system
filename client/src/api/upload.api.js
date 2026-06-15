import axiosInstance from './axiosInstance';

export const uploadTrainingFile = (file, onUploadProgress) => {
  const formData = new FormData();
  formData.append('file', file);
  return axiosInstance.post('/upload/training', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    onUploadProgress
  });
};

export const uploadStaffFile = (file, onUploadProgress) => {
  const formData = new FormData();
  formData.append('file', file);
  return axiosInstance.post('/upload/staff', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    onUploadProgress
  });
};

export const downloadTemplate = (format = 'excel', type = 'training') => {
  return axiosInstance.get('/upload/template', {
    params: { format, type },
    responseType: 'blob'
  });
};

export const getUploadBatches = (params) => {
  return axiosInstance.get('/upload/batches', { params });
};

export const getUploadBatchById = (batchId) => {
  return axiosInstance.get(`/upload/batches/${batchId}`);
};

export const downloadErrorReport = (batchId) => {
  return axiosInstance.get(`/upload/batches/${batchId}/error-report`, {
    responseType: 'blob'
  });
};
