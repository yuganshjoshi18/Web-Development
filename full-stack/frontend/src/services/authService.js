import { api } from './api.js';

export async function login(credentials) {
  const { data } = await api.post('/auth/login', credentials);

  if (!data?.token || !data?.user) {
    throw new Error('The server did not return a valid session.');
  }

  return data;
}
