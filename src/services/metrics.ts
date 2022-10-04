import { map } from 'lodash';

import api from './api';

export const countImpressionsService = async (): Promise<number> => {
  const response = await api.get<{ content: [{ total?: number }] }>(
    '/advertising-dashboard-dev/metrics/count/instfaceoverview-impressions'
  );

  return response.data.content[0]?.total ?? 0;
};

export const countLikesService = async (): Promise<number> => {
  const response = await api.get<{ content: [{ total?: number }] }>(
    '/advertising-dashboard-dev/metrics/count/instfaceoverview-likes'
  );

  return response.data.content[0]?.total ?? 0;
};

export const countViewsService = async (): Promise<number> => {
  const response = await api.get<{ content: [{ total?: number }] }>(
    '/advertising-dashboard-dev/metrics/count/instfaceoverview-views'
  );

  return response.data.content[0]?.total ?? 0;
};

export const countEngagementsService = async (): Promise<number> => {
  const response = await api.get<{ content: [{ total?: number }] }>(
    '/advertising-dashboard-dev/metrics/count/instfaceoverview-engagaments'
  );

  return response.data.content[0]?.total ?? 0;
};

export const getCommentOverviewService = async (): Promise<{ label: string; value: number }[]> => {
  const response = await api.get('/advertising-dashboard-dev/metrics/count/instfacegraphicoverview-comments');

  return map(response.data.content, c => ({
    label: c.month,
    value: c.total,
  }));
};

export const getLikeOverviewService = async (): Promise<{ label: string; value: number }[]> => {
  const response = await api.get('/advertising-dashboard-dev/metrics/count/instfacegraphicoverview-likes');

  return map(response.data.content, c => ({
    label: c.month,
    value: c.total,
  }));
};

export const getImpressionOverviewService = async (): Promise<{ label: string; value: number }[]> => {
  const response = await api.get('/advertising-dashboard-dev/metrics/count/instfacegraphicoverview-impressions');

  return map(response.data.content, c => ({
    label: c.month,
    value: c.total,
  }));
};

export const getEngagementOverviewService = async (): Promise<{ label: string; value: number }[]> => {
  const response = await api.get('/advertising-dashboard-dev/metrics/count/instfacegraphicoverview-engagaments');

  return map(response.data.content, c => ({
    label: c.month,
    value: c.total,
  }));
};

export const getViewOverviewService = async (): Promise<{ label: string; value: number }[]> => {
  const response = await api.get('/advertising-dashboard-dev/metrics/count/instfacegraphicoverview-views');

  return map(response.data.content, c => ({
    label: c.month,
    value: c.total,
  }));
};
