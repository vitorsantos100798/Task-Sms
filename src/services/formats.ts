import { Format } from '../types/format';
import api from './api';

export const listFormatService = async (): Promise<Format[]> => {
  const response = await api.get<{ content: Format[] }>('/editor-dev/formats');

  return response.data.content;
};

export const findOneFormatByIdService = async (id: number): Promise<Format> => {
  const response = await api.get<{ content: Format }>(`/editor-dev/formats/${id}`);

  return response.data.content;
};
