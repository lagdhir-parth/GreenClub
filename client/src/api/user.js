import api from './axios';

export const selectCharity = (data) => api.post('/user/select-charity', data);

export const subscribeUser = (data) => api.post('/user/subscribe', data);

export const getUserById = (id) => api.get(`/user/${id}`);
