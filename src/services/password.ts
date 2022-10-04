import { ChangePasswordData, ResetPasswordData } from '../types/password';
import api from './api';

export const changePasswordService = async ({ currentPassword, password }: ChangePasswordData) => {
  const response = await api.post('/session-service-dev/user/password/update', {
    currentPassword,
    password,
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return response.data;
};

export const forgotPasswordService = async (email: string) => {
  const response = await api.post('/session-service-dev/user/mail/password', {
    email,
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return response.data;
};

export const validateForgotPasswordTokenService = async (token: number) => {
  const response = await api.post('/session-service-dev/token/validate', {
    token,
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return response.data;
};

export const resetPasswordService = async ({ token, password }: ResetPasswordData) => {
  const response = await api.post('/session-service-dev/user/password/reset', {
    token,
    password,
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return response.data;
};
