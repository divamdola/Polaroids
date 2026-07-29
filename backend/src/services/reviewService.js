import apiClient from './apiClient.js';
import { mockReviews } from '../data/mockData.js';

export const getReviews = async () => {
  try {
    const response = await apiClient.get('/reviews');
    return response.data;
  } catch (error) {
    console.warn('Falling back to mock reviews', error.message);
    return mockReviews;
  }
};

export const createReview = async (payload) => {
  try {
    const response = await apiClient.post('/reviews', payload);
    return response.data;
  } catch (error) {
    return { success: true, review: payload };
  }
};
