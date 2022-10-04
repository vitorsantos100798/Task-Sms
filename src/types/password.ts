export type ChangePasswordData = {
  currentPassword: string;
  password: string;
};

export type ResetPasswordData = {
  token: string | number;
  password: string;
};
