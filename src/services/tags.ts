import { Tag } from '../types/tag';
import api from './api';

export const listTagService = async (): Promise<Tag[]> => {
  const response = await api.get<{ content: Tag[] }>('/editor-dev/tags');

  return response.data.content;
};
