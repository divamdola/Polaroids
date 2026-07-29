import apiClient from './apiClient.js';
import { mockUsers } from '../data/mockData.js';

export const login = async (email, password) => {
  try {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  } catch (error) {
    const user = mockUsers.find((candidate) => candidate.email === email && candidate.password === password);
    if (user) {
      return { user, token: 'mock-token' };
    }
    throw error;
  }
};

export const register = async (payload) => {
  try {
    const response = await apiClient.post('/auth/register', payload);
    return response.data;
  } catch (error) {
    return { user: { ...payload, id: `user_${Date.now()}` }, token: 'mock-token' };
  }
};
