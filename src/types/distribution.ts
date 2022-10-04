import { SocialProfile } from './socialProfile';
import { WhatsAppInstance } from './whatsAppInstance';

export type DistributeArts = {
  artId: number;
  artURL: string;
  artType: string;
  artName?: string;
  price?: string;
  artFormat?: number;
  designURL?: string;
};

export type SocialChanel = {
  label: string;
  value: string;
};

export type SendToWhomOptions = 'private' | 'group';

export type DistributeToCustomersData = {
  campaignId: number;
  credits?: number;
  endDate?: Date;
  endTime?: Date;
  startDate: Date;
  startTime: Date;
  text?: string;
  numbersInCopy?: string;
  socialChannels?: SocialChanel[];
  objective?: Objective;
  location?: Location;
  instance?: WhatsAppInstance;
  profile?: SocialProfile;
  sendToWhom: SendToWhomOptions[];
  steps: Slug[];
  arts: DistributeArts[];
  groups: string[];
};

export type Objective = {
  label: string;
  description: string;
  value: string;
};

export type Location = {
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  radius: string;
};

export type Slug = 'prices' | 'where-to-distribute' | 'whatsapp' | 'social-network' | 'turbocharged-action' | 'sms';
export type SlugSendToWhatsApp = 'private' | 'group';
export type ActionChange = 'remove' | 'add';
