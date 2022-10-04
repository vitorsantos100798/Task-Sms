import { Background, ListBackgroundQuery } from '../types/background';
import api from './api';

export const listBackgroundService = async ({
  page,
  occasions,
  formats,
  segments,
}: ListBackgroundQuery): Promise<Background[]> => {
  const response = await api.get<{ content: Background[] }>('/editor-dev/backgrounds', {
    params: {
      page,
      formats,
      segments,
      occasions,
    },
  });

  return response.data.content;
};
