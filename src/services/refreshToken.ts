import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosError } from 'axios';

export async function refreshTokenService(): Promise<string> {
  try {
    const refreshToken = await AsyncStorage.getItem('@datasales:refresh_token');

    const body = {
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    };

    const response = await axios.post<{ access_token: string; refresh_token: string }>(
      'https://api-backoffice.datasales.info/p2-prd/refreshtoken',
      body,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: refreshToken as string,
        },
      }
    );

    const { access_token, refresh_token } = response.data;

    await AsyncStorage.multiSet([
      ['@datasales:token', access_token],
      ['@datasales:refresh_token', refresh_token],
    ]);

    return access_token;
  } catch (err) {
    const error = err as AxiosError;

    if (error.response) {
      const { status } = error.response;

      if (status === 401) {
        await AsyncStorage.multiRemove(['@datasales:token', '@datasales:refresh_token', '@datasales:user']);
      }
    }

    throw err;
  }
}
