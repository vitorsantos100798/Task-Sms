import { Template, ListTemplateQuery } from '../types/template';
import api from './api';

export const listTemplateService = async ({
  formats = 2,
  productQuantity = 10,
  tags,
  video = undefined,
}: ListTemplateQuery): Promise<Template[]> => {
  const response = await api.get<{ content: Template[] }>('/editor-dev/templates', {
    params: {
      formats,
      productQuantity,
      tags,
      video,
    },
  });

  return response.data.content;
};
