import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true,
});

API.interceptors.request.use((response) => response,
    (error) => {
        if(error.response?.status === 401) {
            if(window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
      return Promise.reject(error);
    }
);

export default API;