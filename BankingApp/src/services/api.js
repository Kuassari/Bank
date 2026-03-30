import axios from 'axios';
import { config } from '../config/env';

const api = axios.create({
  baseURL: `${config.apiBaseUrl}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (requestConfig) => {
    if (config.enableLogging) {
      console.log('API Request:', {
        method: requestConfig.method?.toUpperCase(),
        url: requestConfig.url,
        data: requestConfig.data,
      });
    }
    return requestConfig;
  },
  async (error) => {
    if (config.enableLogging) {
      console.error('Request Error:', error);
    }
    throw error;
  }
);

api.interceptors.response.use(
  async (response) => {
    if (config.enableLogging) {
      console.log('API Response:', {
        status: response.status,
        data: response.data,
      });
    }
    return response;
  },
  async (error) => {
    if (config.enableLogging) {
      console.error('API Error:', {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
      });
    }   
    throw error;
  }
);

export const transactionsApi = {
  async getAll() {
    const response = await api.get('/transactions');
    return response.data;
  },

  async create(data) {
    const response = await api.post('/transactions', data);
    return response.data;
  },

  async update(id, data) {
  const response = await api.put(`/transactions/${id}`, data);
  return response.data;
},

  async cancel(id) {
    const response = await api.delete(`/transactions/${id}`);
    return response.data;
  },
};

export default api;