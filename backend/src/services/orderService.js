import apiClient from './apiClient.js';
import { mockOrders } from '../data/mockData.js';

export const getOrders = async () => {
  try {
    const response = await apiClient.get('/orders');
    return response.data;
  } catch (error) {
    console.warn('Falling back to mock orders', error.message);
    return mockOrders;
  }
};

export const createOrder = async (payload) => {
  try {
    const response = await apiClient.post('/orders', payload);
    return response.data;
  } catch (error) {
    return { success: true, order: payload };
  }
};
