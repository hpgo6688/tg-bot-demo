import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8080', // 可选：设置基础 URL
  timeout: 10000, // 可选：设置请求超时时间
  headers: {
    'Content-Type': 'application/json',
  },
});

const get = async (url: string, params?: object) => {
  try {
    const response = await apiClient.get(url, { params });
    return response.data;
  } catch (error) {
    console.error('GET request error:', error);
    throw error;
  }
};

const post = async (url: string, data?: object) => {
  try {
    const response = await apiClient.post(url, data);
    return response.data;
  } catch (error) {
    console.error('POST request error:', error);
    throw error;
  }
};

export default { get, post };
