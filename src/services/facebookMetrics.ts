import { map } from 'lodash';

import api from './api';

export const getFacebookCommentMetricService = async (): Promise<{ label: string; value: number }[]> => {
  const response = await api.get('/advertising-dashboard-dev/metrics/count/facebook-comments');

  return map(response.data.content, c => ({
    label: c.date,
    value: c.total,
  }));
};

export const getFacebookLikeMetricService = async (): Promise<{ label: string; value: number }[]> => {
  const response = await api.get('/advertising-dashboard-dev/metrics/count/facebook-likes');

  return map(response.data.content, c => ({
    label: c.date,
    value: c.total,
  }));
};

export const getFacebookEngagementMetricService = async (): Promise<{ label: string; value: number }[]> => {
  const response = await api.get('/advertising-dashboard-dev/metrics/count/facebook-engajament');

  return map(response.data.content, c => ({
    label: c.date,
    value: c.total,
  }));
};

export const getFacebookPaidViewMetricService = async (): Promise<{ label: string; value: number }[]> => {
  const response = await api.get('/advertising-dashboard-dev/metrics/count/facebook-paid-views');

  return map(response.data.content, c => ({
    label: c.date,
    value: c.total,
  }));
};

export const getFacebookViewMetricService = async (): Promise<{ label: string; value: number }[]> => {
  const response = await api.get('/advertising-dashboard-dev/metrics/count/facebook-views');

  return map(response.data.content, c => ({
    label: c.date,
    value: c.total,
  }));
};

export const getFacebookUniqueViewMetricService = async (): Promise<{ label: string; value: number }[]> => {
  const response = await api.get('/advertising-dashboard-dev/metrics/count/facebook-unique-views');

  return map(response.data.content, c => ({
    label: c.date,
    value: c.total,
  }));
};
