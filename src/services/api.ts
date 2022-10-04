/* eslint-disable @typescript-eslint/ban-ts-comment */
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosResponse } from 'axios';

import { refreshTokenService } from './refreshToken';

const api = axios.create({
  baseURL: 'https://api.datasales.info',
});

api.interceptors.response.use(
  response => {
    return response;
  },
  async (error: { response: AxiosResponse; config: any }) => {
    const access_token = await AsyncStorage.getItem('@datasales:token');
    if (error.response.status === 401 && access_token) {
      const token = await refreshTokenService();

      api.defaults.headers.common.authorization = `${token}`;

      const response = await api(error.response.config);

      return response;
    }

    return Promise.reject(error);
  }
);

export default api;
