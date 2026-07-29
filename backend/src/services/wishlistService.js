import apiClient from './apiClient.js';
import { mockWishlist } from '../data/mockData.js';

export const getWishlist = async () => {
  try {
    const response = await apiClient.get('/wishlist');
    return response.data;
  } catch (error) {
    console.warn('Falling back to mock wishlist', error.message);
    return mockWishlist;
  }
};
