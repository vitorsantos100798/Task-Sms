export type Store = {
  id: number;
  address: string;
  city: string;
  description: string;
  logo_url: string;
  name: string;
  neighborhood: string;
  state: string;
  street_number?: any;
  whatsapp_phone_number: string;
  zip_code: string;
};

export type CreateStoreData = {
  name: string;
  description?: string;
  logo_url?: string;
  zip_code?: string;
  address?: string;
  street_number?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  whatsapp_phone_number?: string;
};

export type EditStoreData = {
  id: number;
  name: string;
  description?: string;
  logo_url?: string;
  zip_code?: string;
  address?: string;
  street_number?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  whatsapp_phone_number?: string;
};
