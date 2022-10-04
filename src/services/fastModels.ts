import { format } from 'date-fns';

import { Campaign } from '../types/campaign';
import { DistributeArts } from '../types/distribution';
import {
  ListCategoryQuery,
  ListSubcategoryQuery,
  Category,
  SubcategoryFilter,
  Subcategory,
  FastModels,
  ArtsWithPrice,
} from '../types/fastModels';
import { Store } from '../types/store';
import { asyncForEach } from '../utils/asyncForEach';
import api from './api';
import { createCampaignService, listCampaignService } from './campaigns';

export const listSubcategory = async ({
  categoryId = 0,
  subcategoryId = 0,
}: ListSubcategoryQuery): Promise<SubcategoryFilter[]> => {
  if (subcategoryId) {
    const response = await api.get<{ content: SubcategoryFilter[] }>(
      `/fast-models-dsmarketing-v1-dev/dev/templates/listByCategory/${categoryId}?id_subcategory=${subcategoryId}`
    );
    return response.data.content;
  }
  const response = await api.get<{ content: SubcategoryFilter[] }>(
    `/fast-models-dsmarketing-v1-dev/dev/templates/listByCategory/${categoryId}`
  );
  return response.data.content;
};

export const listCategoryBySegment = async ({ segmentId = 0 }: ListCategoryQuery): Promise<Category[]> => {
  const response = await api.get<{ content: Category[] }>(
    `/fast-models-dsmarketing-v1-dev/dev/categories/listBySegment/${segmentId}`
  );

  return response.data.content;
};

export const listSubcategoryByDescription = async ({
  categoryId = 0,
  description = '',
}: ListSubcategoryQuery): Promise<SubcategoryFilter[]> => {
  const response = await api.get<{ content: SubcategoryFilter[] }>(
    `/fast-models-dsmarketing-v1-dev/dev/subcategories/listByDescription/${categoryId}?description=${description}`
  );

  return response.data.content;
};

export const createThumbnail = async (data: DistributeArts, store: Store): Promise<any> => {
  const products = {
    club_price: parseFloat(data.price?.replace(/\./g, '').replace(',', '.').replace('R$', '') as string),
  };
  const generateThumbnailData = {
    backgroundURL: data.artURL,
    company_data: store,
    designURL:
      data.designURL ||
      'https://s3.amazonaws.com/datasalesio-imagens/TesteFastModels20220623T160720156Z-444c0b80-8fbc-4f5d-87f6-0b45e9b1b3d5.json',
    formatId: data.artFormat,
    productQuantity: 0,
    products: [products],
    tagId: null,
    tagURL: null,
    templateId: data.artId,
  };

  const generateThumbnailResponse = await api.post('/flyers', generateThumbnailData, {
    baseURL: 'https://api-editor-ctg.datasales.info',
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return generateThumbnailResponse.data.outArray;
};

export const listFastService = async (): Promise<FastModels[]> => {
  const response = await api.get<{ content: FastModels[] }>('/fast-models-dsmarketing-v1-dev/dev/segments/list');

  return response.data.content;
};

export const newSegmentService = async (segment: { id: number }): Promise<number> => {
  await api.put('/fast-models-dsmarketing-v1-dev/dev/company/update', {
    ID_SEGMENT: segment.id,
  });

  return segment.id;
};

export const createArtService = async (artsWithPrice: ArtsWithPrice, arts?: DistributeArts[]): Promise<any[]> => {
  if (arts) {
    const name = `Modelos Rápidos - ${format(new Date(), 'dd-MM-yyyy')}`;
    const campaigns = await listCampaignService(name);
    let folderCampaign: Campaign;

    if (campaigns.length === 0) {
      folderCampaign = await createCampaignService({ name });
    } else {
      folderCampaign = campaigns[0];
    }

    const createFlyersData = arts.map(art => {
      const createFlyer = {
        format_id: art.artFormat,
        image_url: artsWithPrice[art.artId].url,
        json_url: artsWithPrice[art.artId].design,
        name: art.artName,
        offer_id: folderCampaign.id,
        preview_url: artsWithPrice[art.artId].preview,
        product_quantity: 0,
        template_id: art.artId,
        type: art.artType,
      };
      return api.post('/editor-dev/flyers', createFlyer);
    });

    const createFlyersResponse = await Promise.all(createFlyersData);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return createFlyersResponse.map(response => response.data);
  }

  return [];
};
