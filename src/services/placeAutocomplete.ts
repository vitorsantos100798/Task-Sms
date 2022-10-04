import axios from 'axios';

import { Place, Prediction } from '../types/placeAutocomplete';

const client = axios.create({
  baseURL: 'https://maps.googleapis.com/maps/api/place',
  params: {
    key: 'AIzaSyAFnRCI6kHw0ICofnhMoI9zI2B0HexETeU',
    language: 'pt-BR',
    country: 'br',
  },
});

export const listPredictionService = async (input: string): Promise<Prediction[]> => {
  const response = await client.get<{ predictions: Prediction[] }>('/autocomplete/json', {
    params: {
      input,
    },
  });

  return response.data.predictions;
};

export const findPlaceDetailsService = async (placeId: string): Promise<Place> => {
  const response = await client.get<{ result: Place }>('/details/json', {
    params: {
      place_id: placeId,
    },
  });

  return response.data.result;
};
