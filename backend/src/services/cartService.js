import apiClient from './apiClient.js';
import { mockCart } from '../data/mockData.js';

export const getCart = async () => {
  try {
    const response = await apiClient.get('/cart');
    return response.data;
  } catch (error) {
    console.warn('Falling back to mock cart', error.message);
    return mockCart;
  }
};

export const updateCart = async (payload) => {
  try {
    const response = await apiClient.post('/cart', payload);
    return response.data;
  } catch (error) {
    return { success: true, cart: payload };
  }
};
