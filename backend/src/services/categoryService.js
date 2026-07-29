import apiClient from './apiClient.js';
import { mockCategories } from '../data/mockData.js';

export const getCategories = async () => {
  try {
    const response = await apiClient.get('/categories');
    return response.data;
  } catch (error) {
    console.warn('Falling back to mock categories', error.message);
    return mockCategories;
  }
};
