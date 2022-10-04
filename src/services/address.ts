import axios from 'axios';

import { ViaCepAddress } from '../types/address';

export const findAddressByZipCodeService = async (zipCode: string): Promise<ViaCepAddress> => {
  const response = await axios.get<ViaCepAddress>(`https://viacep.com.br/ws/${zipCode}/json`);

  return response.data;
};
