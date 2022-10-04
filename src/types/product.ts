import { NewProduct } from '../screens/Products/New/index';

export type CreateProductData = {
  list_id: number;
  name: string;
  price: number | string;
  price2?: number | string;
  image_url?: string;
  productType?: number;
};

export type EditProductData = {
  id: number;
  list_id: number;
  name: string;
  price: number | string;
  image_url?: string;
};

export type Product = {
  id: number;
  list_id: number;
  name: string;
  productType: number;
  price: number;
  price2: number;
  formatted_price: string;
  image_url?: string;
};

export type NewProductType = {
  image_url?: string;
  name: string;
  price: number;
  price2: number;
  productType: number;
};

export type ProductToEditType = {
  product: NewProductType;
  id: number;
};
