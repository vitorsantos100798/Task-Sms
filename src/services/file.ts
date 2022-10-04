import RNFS from 'react-native-fs';

import { getURLExtension } from '../utils/getURLExtension';
import api from './api';

export const uploadFileService = async (filePath: string): Promise<string> => {
  const extension = getURLExtension(filePath);

  const base64 = await RNFS.readFile(filePath, 'base64');

  const data = {
    extension,
    base64,
    uri: filePath,
  };

  const response = await api.post<{ url: string }>('/', data, {
    baseURL: 'https://kluip97pve.execute-api.us-east-1.amazonaws.com/prod',
  });

  return response.data.url;
};
