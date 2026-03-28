import api from './axios';

export const getAllUsers = () => api.get('/admin/users');

export const deleteUser = (id) => api.delete(`/admin/delete-user/${id}`);
