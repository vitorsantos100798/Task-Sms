import { Segment } from '../types/segment';
import api from './api';

export const listSegmentService = async (): Promise<Segment[]> => {
  const response = await api.get<{ content: Segment[] }>('/editor-dev/segments');

  return response.data.content;
};
