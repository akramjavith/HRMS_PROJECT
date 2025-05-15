// axiosInstance.js
import axios from 'axios';
import cancelTokenManager from './CancelTokenManager';

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(
  (config) => {
    const source = axios.CancelToken.source();
    config.cancelToken = source.token;

    // Save the cancel function globally
    cancelTokenManager.addCancelToken(source.cancel);

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
