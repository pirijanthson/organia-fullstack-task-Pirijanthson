import axios from 'axios';

const API_URL = 'http://localhost:8080/api/admin';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };
};

export const getAdminMetrics = async () => {
  const response = await axios.get(`${API_URL}/metrics`, getAuthHeaders());
  return response.data;
};

export const getAllTasks = async () => {
  const response = await axios.get(`${API_URL}/tasks`, getAuthHeaders());
  return response.data;
};

export const getAllUsers = async () => {
  const response = await axios.get(`${API_URL}/users`, getAuthHeaders());
  return response.data;
};

export const assignTask = async (taskData) => {
  const response = await axios.post(`${API_URL}/tasks`, taskData, getAuthHeaders());
  return response.data;
};

export const updateAdminTask = async (id, taskData) => {
  const response = await axios.put(`${API_URL}/tasks/${id}`, taskData, getAuthHeaders());
  return response.data;
};

export const deleteAdminTask = async (id) => {
  const response = await axios.delete(`${API_URL}/tasks/${id}`, getAuthHeaders());
  return response.data;
};

export const getAdminNotes = async () => {
  const response = await axios.get(`${API_URL}/notes`, getAuthHeaders());
  return response.data;
};

export const createAdminNote = async (noteData) => {
  const response = await axios.post(`${API_URL}/notes`, noteData, getAuthHeaders());
  return response.data;
};

export const updateAdminNote = async (id, noteData) => {
  const response = await axios.put(`${API_URL}/notes/${id}`, noteData, getAuthHeaders());
  return response.data;
};

export const deleteAdminNote = async (id) => {
  const response = await axios.delete(`${API_URL}/notes/${id}`, getAuthHeaders());
  return response.data;
};
