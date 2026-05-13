import Api from '../api/axiosConfig';

export const getNotes = async (userId) => {
  const response = await Api.get(`/notes?userId=${userId}`);
  return response.data;
};

export const getNotesByTaskId = async (taskId) => {
  const response = await Api.get(`/notes/task/${taskId}`);
  return response.data;
};

export const createNote = async (noteData) => {
  const response = await Api.post('/notes', noteData);
  return response.data;
};

export const updateNote = async (id, noteData) => {
  const response = await Api.put(`/notes/${id}`, noteData);
  return response.data;
};

export const deleteNote = async (id) => {
  const response = await Api.delete(`/notes/${id}`);
  return response.data;
};
