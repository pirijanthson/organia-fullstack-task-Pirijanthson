import Api from '../api/axiosConfig';

export const getAdminMetrics = async () => {
  const response = await Api.get('/admin/metrics');
  return response.data;
};

export const getAllTasks = async () => {
  const response = await Api.get('/admin/tasks');
  return response.data;
};

export const getAllUsers = async () => {
  const response = await Api.get('/admin/users');
  return response.data;
};

export const assignTask = async (taskData) => {
  const response = await Api.post('/admin/tasks', taskData);
  return response.data;
};

export const updateAdminTask = async (id, taskData) => {
  const response = await Api.put(`/admin/tasks/${id}`, taskData);
  return response.data;
};

export const deleteAdminTask = async (id) => {
  const response = await Api.delete(`/admin/tasks/${id}`);
  return response.data;
};

export const getAdminNotes = async () => {
  const response = await Api.get('/admin/notes');
  return response.data;
};

export const createAdminNote = async (noteData) => {
  const response = await Api.post('/admin/notes', noteData);
  return response.data;
};

export const updateAdminNote = async (id, noteData) => {
  const response = await Api.put(`/admin/notes/${id}`, noteData);
  return response.data;
};

export const deleteAdminNote = async (id) => {
  const response = await Api.delete(`/admin/notes/${id}`);
  return response.data;
};
