import { addMonths, format, subMonths } from 'date-fns';

import api from './api';

type IssuesInfo = {
  level: string;
  error_code: number;
  error_summary: string;
  error_message: string;
  error_type: string;
};

type Post = {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  imageURL: string;
};

type PaidPost = {
  campaign_id: string;
  account_id: string;
  status: string;
  name: string;
  created_time: Date;
  effective_status: string;
  preview_shareable_link: string;
  id: string;
  lifetime_budget: number;
  issues_info: IssuesInfo[];
};

export const listFacebookPostService = async ({
  startDate = format(subMonths(new Date(), 1), 'yyyy-MM-dd'),
  endDate = format(addMonths(new Date(), 1), 'yyyy-MM-dd'),
  limit = 5,
}): Promise<Post[]> => {
  const response = await api.get<{ campanhas: Post[] }>('/insights-p2-dev/dev/crm/performance/getPerformanceMes', {
    params: {
      grupoCampanha: 'CONCLUIDO',
      automacao: 0,
      filtroDataInicio: startDate,
      filtroDataFim: endDate,
    },
  });

  return response.data.campanhas
    .filter((c: any) => c.tipo_campanha === 'FACEBOOK')
    ?.map((c: any) => ({
      id: c.ID_CAMPANHA,
      name: c.nome_campanha,
      description: c.mensagem,
      startDate: c.data_inicio_campanha,
      endDate: c.data_fim_campanha,
      imageURL: c.whatsapp_url,
    }))
    .slice(0, limit);
};

export const listFacebookPaidPostService = async ({
  startDate = format(subMonths(new Date(), 1), 'yyyy-MM-dd'),
  endDate = format(addMonths(new Date(), 1), 'yyyy-MM-dd'),
}): Promise<PaidPost[]> => {
  const response = await api.get<{ content: PaidPost[] }>('/ads-manager-dev/ads', {
    params: {
      start_date: startDate,
      end_date: endDate,
    },
  });

  return response.data.content;
};
