import axios from 'axios';
import { addDays } from 'date-fns';

import { SignInCredentials, SignInResponse, SignUpCredentials, SignUpResponse } from '../types/session';
import api from './api';

export const signInService = async ({ email, password }: SignInCredentials): Promise<SignInResponse> => {
  const response = await axios.post('https://api-backoffice.datasales.info/p2-dev/login', {
    email,
    password,
  });

  const {
    token,
    refresh_token,
    name,
    company: { id: companyId, name: companyName, trial, trialStartDate, trialEndDate, ID_SEGMENT: segmentId },
  } = response.data;

  return {
    token,
    refresh_token,
    user: {
      segmentId,
      companyId,
      companyName,
      name,
      email,
      trial,
      trialStartDate,
      trialEndDate,
    },
  };
};

export const signUpService = async ({
  company_name,
  name,
  email,
  password,
}: SignUpCredentials): Promise<SignUpResponse> => {
  const signUpData = {
    company_name,
    name,
    email,
    password,
    trialStartDate: new Date(),
    trialEndDate: addDays(new Date(), 3),
  };

  const response = await axios.post<SignUpResponse>(
    'https://api-backoffice.datasales.info/p3-prd/user/trial',
    signUpData
  );

  return response.data;
};

export const validateSegment = async () => {
  const response = await api.get<{ company: string }>(`/p3-dev/users/0`, {
    baseURL: 'https://api-backoffice.datasales.info',
  });
  return response.data?.company;
};
