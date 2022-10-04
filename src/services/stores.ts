import { Store, CreateStoreData, EditStoreData } from '../types/store';
import api from './api';

export const listStoreService = async (): Promise<Store[]> => {
  const response = await api.get<Store[]>(`/offer-advertising-dev/store`);

  return response.data;
};

export const findStoreByIdService = async (id: number): Promise<Store> => {
  const response = await api.get<Store>(`/offer-advertising-dev/store/${id}`);

  return response.data;
};

export const createStoreService = async (data: CreateStoreData): Promise<Store> => {
  const response = await api.post<Store>('/offer-advertising-dev/store', data);

  return response.data;
};

export const editStoreService = async (data: EditStoreData): Promise<Store> => {
  const response = await api.put<Store>(`offer-advertising-dev/store/${data.id}`, data);

  return response.data;
};

export const removeStoreById = async (id: number): Promise<string> => {
  const response = await api.delete<string>(`/offer-advertising-prd/store/${id}`);

  return response.data;
};
