import { User } from './user';

export type SignInCredentials = {
  email: string;
  password: string;
};

export type SignUpCredentials = {
  company_name: string;
  name: string;
  email: string;
  password: string;
};

export type SignInResponse = {
  token: string;
  refresh_token: string;
  user: User;
};

export type resetPasswordData = {
  token: string | number;
  password: string;
};

export type SignUpResponse = User;
