import { ListOccasionQuery, Occasion } from '../types/occasion';
import api from './api';

export const listOccasionService = async ({ formatId, segmentId }: ListOccasionQuery): Promise<Occasion[]> => {
  const response = await api.get<{ content: Occasion[] }>('/editor-dev/occasions', {
    params: {
      formatId,
      segmentId,
    },
  });

  return response.data.content;
};
