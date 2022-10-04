import { CreateCampaignData } from './campaign';
import { Product } from './product';
import { Tag } from './tag';

export type Art = {
  id: number;
  company_id: number;
  offer_id: number;
  format_id: number;
  template_id: number;
  product_quantity: number;
  name: string;
  type: string;
  image_url: string;
  preview_url: string;
  json_url: string;
  is_active: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type CompanyData = {
  id: number;
  logo_url: string;
  description: string;
  address: string;
  phone_number: string;
};

export type RGBA = {
  r: number;
  g: number;
  b: number;
  a: number;
};

export type Colors = {
  text: string;
  price: string;
};

export type CreateArtData = {
  campaign: CreateCampaignData;
  templateId: number;
  formatId: number;
  segmentId: number;
  occasionId?: number;
  designURL: string;
  productQuantity: number;
  products: Product[];
  backgroundURL: string;
  colors: Colors;
  tag?: Tag;
  type: string;
  isVideo?: boolean;
  store: {
    id: number;
    logo_url: string;
    description: string;
    address: string;
    phone_number: string;
  };
};

export type Video = {
  createdAt: string;
  id: number;
  campaignId: number;
  videomatikId: number;
  videoURL: string;
  name: string;
  type: number;
};
