import { groupBy, map } from 'lodash';

import { CreateArtData, Art, Video } from '../types/art';
import { hexToRGBA } from '../utils/hexToRGBA';
import api from './api';
import { findOneFormatByIdService } from './formats';
import { listProductByCampaignIdService } from './products';

export const listArtByCampaignService = async (campaignId: number): Promise<{ [key: string]: Art[] }> => {
  const response = await api.get('/editor-dev/flyers', {
    params: {
      offer_id: campaignId,
    },
  });

  return groupBy(response.data.content, 'type');
};

export const listVideoByCampaignService = async (campaignId: number): Promise<Video[]> => {
  const response = await api.get('/lista-ofertas-p1-prd/getVideomatik', {
    params: {
      id_tabloide: campaignId,
    },
  });

  return map(response.data.response, a => ({
    createdAt: a.data,
    id: a.id,
    campaignId: a.id_tabloide,
    videomatikId: a.id_videomatik,
    videoURL: a.link,
    name: a.nome_produto,
    type: a.tipo,
  }));
};

export const createArtService = async (data: CreateArtData) => {
  const { campaign, formatId, templateId, productQuantity } = data;

  const format = await findOneFormatByIdService(formatId);

  const products = await listProductByCampaignIdService(campaign.id as number).then(result => {
    return map(result, product => ({
      club_price: product.price,
      dynamics: 'preco_unico',
      id: product.list_id,
      image_url: product.image_url,
      isOfertaSecreta: false,
      name: product.name,
      price: 0,
      var1: null,
      var2: null,
      var3: null,
    }));
  });

  if (data.isVideo) {
    const videoData = {
      seeRequests: false,
      id_tabloide: String(campaign.id),
      id_template: data.templateId,
      tipo: 1,
      idsNaoIncluidos: [],
      composition: 'feed',
      logo: data.store?.logo_url,
      fundo: data.backgroundURL,
      etiqueta: data.tag?.imageURL,
      texto: data.store?.description,
      corTexto1: data.colors.text,
      corTexto2: data.colors.text,
      corPreco1: data.colors.price,
    };

    const response = await api.post('/lista-ofertas-p1-dev/postVideomatik', videoData);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return response.data;
  }

  const generateArtData = {
    backgroundURL: data.backgroundURL,
    colors: {
      colorText: hexToRGBA(data.colors.text),
      colorPrice: hexToRGBA(data.colors.price),
    },
    company_data: data.store,
    designURL: data.designURL,
    formatId: 2,
    productQuantity: 10,
    products,
    tagId: data.tag?.id,
    tagURL: data.tag?.imageURL,
    templateId: data.templateId,
  };

  const generateArtResponse = await api.post('/flyers', generateArtData, {
    baseURL: 'https://api-editor-ctg.datasales.info',
  });

  if (!generateArtResponse.data.outArray || generateArtResponse.data.outArray.length <= 0) {
    throw new Error('Falha ao gerar arte');
  }

  const { image_url, preview_url, design_url } = generateArtResponse.data.outArray[0];

  const createArtData = {
    offer_id: campaign.id,
    name: 'Encarte - 10 Produtos',
    format_id: formatId,
    template_id: templateId,
    product_quantity: productQuantity,
    type: format.name,
    image_url,
    json_url: design_url,
    preview_url,
  };

  const createArtResponse = await api.post('/editor-dev/flyers', createArtData);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return createArtResponse.data;
};

export const removeArtByIdService = async (id: number): Promise<any> => {
  const response = await api.put(`/editor-dev/flyers/${id}`, {
    is_active: 0,
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return response.data;
};

export const generatePdf = async (arts: string[]): Promise<any> => {
  const response = await api.post('/editor-dev/flyers/pdf', {
    flyers: arts,
  });
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return response.data;
};
