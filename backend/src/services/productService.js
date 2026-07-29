import apiClient from './apiClient.js';
import { mockProducts } from '../data/mockData.js';

export const getProducts = async () => {
  try {
    const response = await apiClient.get('/products');
    return response.data;
  } catch (error) {
    console.warn('Falling back to mock products', error.message);
    return mockProducts;
  }
};

export const getProductById = async (id) => {
  try {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.warn('Falling back to mock product', error.message);
    return mockProducts.find((product) => product.id === id) || null;
  }
};
