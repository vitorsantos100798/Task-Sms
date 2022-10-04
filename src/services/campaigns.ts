import { addDays, addHours, format, parseISO, subHours } from 'date-fns';
import { map } from 'lodash';

import { Campaign, CreateCampaignData, EditCampaignData } from '../types/campaign';
import api from './api';

const DEFAULT_THUMBNAIL_URL = 'https://datasalesio-imagens.s3.amazonaws.com/empty_image_propaganda_02.png';

export const listCampaignService = async (artName: string): Promise<Campaign[]> => {
  const response = await api.get('/tabloide-digital-p1-dev/dev/crm/getTabloidesDigitais', {
    params: {
      nome: artName,
      artsLimit: 5,
      dataInicio: format(subHours(new Date(), 24), 'yyyy-MM-dd'),
      dataFim: format(addHours(new Date(), 24), 'yyyy-MM-dd'),
    },
  });

  return map(response.data, (item: any) => ({
    id: item.id_tabloide_digital,
    name: item.nome_tabloide_digital,
    thumbnailURL: item.artes[0]?.miniatura || DEFAULT_THUMBNAIL_URL,
    start_date: format(parseISO(item.data_inicio), 'dd/MM/yyyy'),
    end_date: format(parseISO(item.data_fim), 'dd/MM/yyyy'),
    hash: item.uuid,
    arts: map(item.artes, a => ({
      id: a.id,
      thumbnailURL: a.link,
    })),
  }));
};

export const findCampaignByIdService = async (id: number): Promise<Campaign> => {
  const response = await api.get<Campaign>(`/offer-advertising-prd/list/${id}`);

  return response.data;
};
export const editCampaignByIdService = async ({ name, campaignId }: EditCampaignData): Promise<Campaign> => {
  const response = await api.put<Campaign>(`/tabloide-digital-p1-dev/dev/crm/putTabloideDigital`, {
    nome_tabloide_digital: name,
    id_tabloide_digital: campaignId,
  });

  return response.data;
};

export const createCampaignService = async ({
  name = `Propaganda ${format(new Date(), 'dd/MM/yyyy HH:mm')}`,
  startDate = new Date(),
  endDate = addDays(new Date(), 7),
}: CreateCampaignData): Promise<Campaign> => {
  const response = await api.post<{ content: any }>('/offer-advertising-prd/list', {
    name,
    startDate,
    endDate,
  });

  const { id_tabloide_digital, nome_tabloide_digital, data_inicio, data_fim } = response.data.content;

  return {
    id: id_tabloide_digital,
    name: nome_tabloide_digital,
    start_date: data_inicio,
    end_date: data_fim,
  } as Campaign;
};
