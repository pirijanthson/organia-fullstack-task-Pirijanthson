import axios from 'axios';

const API_URL = 'http://localhost:8080/api/notes';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };
};

export const getNotes = async (userId) => {
  const response = await axios.get(`${API_URL}?userId=${userId}`, getAuthHeaders());
  return response.data;
};

export const getNotesByTaskId = async (taskId) => {
  const response = await axios.get(`${API_URL}/task/${taskId}`, getAuthHeaders());
  return response.data;
};

export const createNote = async (noteData) => {
  const response = await axios.post(API_URL, noteData, getAuthHeaders());
  return response.data;
};

export const updateNote = async (id, noteData) => {
  const response = await axios.put(`${API_URL}/${id}`, noteData, getAuthHeaders());
  return response.data;
};

export const deleteNote = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
  return response.data;
};
