import { map } from 'lodash';

import { Product, CreateProductData, EditProductData } from '../types/product';
import { formatPrice } from '../utils/format';
import api from './api';

export const listProductByCampaignIdService = async (offer_id: number): Promise<Product[]> => {
  const response = await api.get(`/offer-advertising-dev/list/${offer_id}/product`);

  return map(response.data, (product: Product) => ({
    ...product,
    price: Number(product.price),
    price2: Number(product.price2),
    formatted_price: formatPrice(Number(product.price)),
  }));
};

export const findProductBytIdService = async (id: number): Promise<Product> => {
  const response = await api.get(`/offer-advertising-dev/list/product/${id}`);

  const { name, image_url, list_id, price, price2, productType } = response.data;

  return {
    id,
    name,
    image_url,
    productType,
    price,
    price2,
    list_id,
    formatted_price: formatPrice(Number(price)),
  };
};

export const listProductByNameService = async (term: string): Promise<Omit<Product, 'id' | 'list_id'>[]> => {
  const response = await api.get(`/lista-ofertas-p1-dev/getProdutoNome`, {
    params: {
      nome: term,
      limit: 10,
    },
  });

  return map(response.data.response, data => ({
    name: data.nome_produto,
    image_url: data.imagem_produto,
    productType: data.tipo_produto,
    price: data.preco_sugerido,
    price2: data.preco_dois,
    formatted_price: formatPrice(Number(data.preco_sugerido)),
  }));
};

export const createProductService = async (data: CreateProductData): Promise<Product> => {
  const response = await api.post<Product>('/offer-advertising-prd/list/product', data);

  return response.data;
};

export const editProductService = async (data: EditProductData): Promise<Product> => {
  const response = await api.put<Product>(`offer-advertising-prd/list/product/${data.id}`, data);

  return response.data;
};

export const removeProductById = async (id: number): Promise<string> => {
  const response = await api.delete<string>(`/offer-advertising-prd/list/product/${id}`);

  return response.data;
};
