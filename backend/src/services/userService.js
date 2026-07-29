import apiClient from './apiClient.js';
import { mockUsers } from '../data/mockData.js';

export const getUsers = async () => {
  try {
    const response = await apiClient.get('/users');
    return response.data;
  } catch (error) {
    console.warn('Falling back to mock users', error.message);
    return mockUsers;
  }
};
