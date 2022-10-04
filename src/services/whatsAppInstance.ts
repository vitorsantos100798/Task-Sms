import { map } from 'lodash';

import { WhatsAppInstance, WhatsAppGroups } from '../types/whatsAppInstance';
import api from './api';

export const listWhatsAppInstanceService = async (): Promise<WhatsAppInstance[]> => {
  const response = await api.get<WhatsAppInstance[]>('/instancias', {
    baseURL: 'https://k5f5s4uhyh.execute-api.us-east-1.amazonaws.com/dev/crm',
  });

  return map(response.data, (instance: any) => ({
    id: instance.id,
    name: instance.nome,
  }));
};

export const checkWhatsAppInstanceConnectionService = async (client: number): Promise<boolean> => {
  const response = await api.get<{ content: { connected: boolean } }>('/whatsapp-v2-dev/zapi/is-connected', {
    params: {
      client,
    },
  });

  return response.data.content.connected;
};

export const listWhatsAppGroupsService = async (client: number): Promise<WhatsAppGroups[]> => {
  const response = await api.get<{ content: WhatsAppGroups[] }>('/whatsapp-v2-dev/groups/list', {
    params: {
      client,
    },
  });

  return response.data.content;
};
