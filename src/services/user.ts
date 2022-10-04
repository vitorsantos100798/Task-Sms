import api from './api';

export const getUserBalanceService = async (): Promise<number> => {
  const response = await api.get('/ads-manager-dev/lastLimitHistory');

  const { content } = response.data;

  if (!content) {
    return 0;
  }

  if (content.balance / 1000 <= 0) {
    return 0;
  }

  return content.balance / 1000;
};
