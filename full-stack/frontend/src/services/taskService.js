import { api } from './api.js';

export async function fetchTasks() {
  const { data } = await api.get('/tasks');
  return Array.isArray(data) ? data : [];
}

export async function createTask(payload) {
  const { data } = await api.post('/tasks', payload);
  return data;
}

export async function deleteTask(id) {
  const { data } = await api.delete(`/tasks/${encodeURIComponent(id)}`);
  return data;
}
