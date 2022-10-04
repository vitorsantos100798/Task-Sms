export type User = {
  companyId: number;
  name: string;
  email: string;
  companyName: string;
  trial: boolean;
  trialStartDate: string;
  trialEndDate: string;
  trialPeriodIsValid?: boolean;
  segmentId?: number;
};

export type ChangePasswordData = {
  currentPassword: string;
  password: string;
};
