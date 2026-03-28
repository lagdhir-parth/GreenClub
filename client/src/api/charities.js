import api from './axios';

export const getCharities = () => api.get('/charities/all');

export const createCharity = (data) => api.post('/admin/create-charity', data);

export const deleteCharity = (id) => api.delete(`/admin/delete-charity/${id}`);
