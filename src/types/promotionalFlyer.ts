export type PromotionalFlyer = {
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
