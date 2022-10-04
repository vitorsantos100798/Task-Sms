import AsyncStorage from '@react-native-async-storage/async-storage';
import { AxiosResponse } from 'axios';
import { addDays, format } from 'date-fns';
import { FormikProps } from 'formik';

import { DistributeToCustomersData, SendToWhomOptions, Slug } from '../types/distribution';
import { User } from '../types/user';
import { asyncForEach } from '../utils/asyncForEach';
import { asyncMap } from '../utils/asyncMap';
import { combineDateAndTime } from '../utils/combineDateAndTime';
import api from './api';
import { findCampaignByIdService } from './campaigns';

export const getFacebookImageHashService = async (imageURL: string, isVideo = false): Promise<string> => {
  const response = await api.post<{ content: { hash: string } }>('/ads-manager-dev/adimages', {
    image_url: imageURL,
    isVideo,
  });

  return response.data.content.hash;
};

export const distributeToInstagram = ({
  text,
  arts,
  profile,
  campaignId,
  startDate,
  startTime,
}: DistributeToCustomersData): Promise<AxiosResponse<any, any>> => {
  const startDateTime = combineDateAndTime(startDate, startTime);
  const endDateTime = addDays(startDateTime, 7);
  const payloadToInstagram = {
    name: 'Instagram post',
    message: text,
    send_date: format(startDateTime, 'dd/MM/yyyy HH:mm'),
    start_date_campaign: format(startDateTime, 'dd/MM/yyyy HH:mm'),
    end_date_campaign: format(endDateTime, 'dd/MM/yyyy HH:mm'),
    is_midia: true,
    url: arts[0].artURL,
    advertising_id: campaignId,
    image_advertisement_id: arts[0].artId,
    page_id: profile?.page_id,
    fb_id: profile?.fb_user_id,
  };
  return api.post('/social-networks-v2-prd/campaing/instagram', payloadToInstagram);
};

export const distributeToInstagramCarousel = ({
  text,
  arts,
  profile,
  campaignId,
  startDate,
  startTime,
}: DistributeToCustomersData): Promise<AxiosResponse<any, any>> => {
  const startDateTime = combineDateAndTime(startDate, startTime);
  const endDateTime = addDays(startDateTime, 7);
  const urls = arts.map(art => ({
    item_advertisement_id: `${art.artId}`,
    url: art.artURL,
    is_video_media: art.artURL.endsWith('.mp4'),
  }));
  const payloadToInstagramCarousel = {
    name: 'Instagram post carousel',
    message: text,
    send_date: format(startDateTime, 'dd/MM/yyyy HH:mm'),
    start_date_campaign: format(startDateTime, 'dd/MM/yyyy HH:mm'),
    end_date_campaign: format(endDateTime, 'dd/MM/yyyy HH:mm'),
    is_midia: true,
    advertising_id: campaignId,
    page_id: profile?.page_id,
    fb_id: profile?.fb_user_id,
    urls,
  };
  return api.post('/social-networks-v2-prd/campaing/instagram/carousel', payloadToInstagramCarousel);
};

export const distributeToFacebook = ({
  text,
  arts,
  campaignId,
  profile,
  startDate,
  startTime,
}: DistributeToCustomersData): Promise<AxiosResponse<any, any>> => {
  const startDateTime = combineDateAndTime(startDate, startTime);
  const endDateTime = addDays(startDateTime, 7);
  const payloadToFacebook = {
    name: 'Facebook post',
    message: text,
    send_date: format(startDateTime, 'dd/MM/yyyy HH:mm'),
    start_date_campaign: format(startDateTime, 'dd/MM/yyyy HH:mm'),
    end_date_campaign: format(endDateTime, 'dd/MM/yyyy HH:mm'),
    is_midia: true,
    url: arts[0].artURL,
    advertising_id: campaignId,
    image_advertisement_id: arts[0].artId,
    page_id: profile?.page_id,
    fb_id: profile?.fb_user_id,
  };
  return api.post('/social-networks-v2-prd/campaing/facebook', payloadToFacebook);
};

export const distributeToTurbochargedAction = async ({
  arts,
  campaignId,
  location,
  credits,
  objective,
  text,
  startDate,
  startTime,
  endDate,
  endTime,
}: DistributeToCustomersData): Promise<AxiosResponse<any, any>> => {
  const startDateTime = combineDateAndTime(startDate, startTime);
  const endDateTime = combineDateAndTime(endDate as Date, endTime as Date);
  let imagesHashes: any;
  let hash;
  let thumbnailVideo: string;
  const logo = 'https://s3.amazonaws.com/datasalesio-imagens/produto-imagem/new/logo_veja_essa_oferta.png';
  const hasCarousel = arts.length > 1;
  const user = await AsyncStorage.getItem('@datasales:user');
  const { companyId }: User = JSON.parse(user as string);
  const { name: campaignName, hash: campaignHash } = await findCampaignByIdService(campaignId);
  const name = `${companyId}_${campaignId}_${arts[0].artId}`;
  const link = `https://ofertas.meumercado.co/${companyId}/${campaignHash}`;
  const isVideo = arts[0].artURL ? arts[0].artURL.endsWith('.mp4') : false;

  if (isVideo) {
    thumbnailVideo = await getFacebookImageHashService(logo);
  }

  if (hasCarousel) {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    imagesHashes = await asyncMap(arts, async art => {
      const hashArts = await getFacebookImageHashService(art.artURL, isVideo);
      return hashArts;
    });
  } else {
    hash = await getFacebookImageHashService(arts[0].artURL, isVideo);
  }

  const attachedFiles =
    hasCarousel && imagesHashes
      ? arts.map((art, index) => {
          const cardHash = imagesHashes[index];
          if (!isVideo)
            return {
              image_hash: cardHash,
              link,
            };
          return {
            video_id: cardHash,
            link,
            image_hash: thumbnailVideo,
          };
        })
      : [];

  const targeting = JSON.stringify({
    age_min: 18,
    age_max: 65,
    genders: [],
    publisher_platforms: ['facebook', 'instagram'],
    geo_locations: {
      custom_locations: [
        {
          latitude: String(location?.latitude),
          longitude: String(location?.longitude),
          radius: String(location?.radius),
          distance_unit: 'kilometer',
        },
      ],
    },
  });

  const data = {
    campaign: {
      status: 'ACTIVE',
      special_ad_categories: [],
      objective: !hasCarousel ? objective?.value : 'REACH',
      name,
    },
    adSet: {
      start_time: startDateTime,
      end_time: endDateTime,
      bid_amount: 1000,
      billing_event: 'IMPRESSIONS',
      targeting,
      status: 'ACTIVE',
      page_id: '105559578146515',
      name,
      lifetime_budget: Number(credits) === 1 ? 900 : Number(credits) * 1000,
      optimization_goal: !hasCarousel ? objective?.value : 'REACH',
    },
    adCreative: {
      name,
      object_story_spec: {
        page_id: '105559578146515',
        instagram_actor_id: '3618289208274064',
        ...(hasCarousel
          ? {
              link_data: {
                child_attachments: attachedFiles,
                link,
              },
            }
          : isVideo
          ? {
              video_data: {
                image_url: logo,
                video_id: hash,
                call_to_action: {
                  type: 'LEARN_MORE',
                },
              },
            }
          : {
              link_data: {
                name: campaignName,
                description: text,
                call_to_action: {
                  type: 'LEARN_MORE',
                },
                image_hash: hash,
                link,
                message: text,
              },
            }),
      },
    },
    user_id: 2,
    offer_id: hasCarousel ? campaignId : arts[0].artId,
  };

  return api.post('/ads-manager-dev/ads', data);
};

export const distributeToWhatsApp = ({
  arts,
  numbersInCopy,
  instance,
  text,
  campaignId,
  startDate,
  startTime,
}: DistributeToCustomersData): Promise<AxiosResponse<any, any>>[] => {
  const startDateTime = combineDateAndTime(startDate, startTime);
  const endDateTime = addDays(startDateTime, 7);

  return arts.map(art => {
    const payloadToWhatsApp = {
      // onlyInCopy: Boolean(numbersInCopy?.length),
      onlyInCopy: false,
      numerosList: numbersInCopy && numbersInCopy.replace(/\s/g, '').split(','),
      idInstancia: instance?.id,
      nomeCampanha: 'WhatsApp post',
      message: text || '',
      dataInicio: format(startDateTime, 'dd/MM/yyyy HH:mm'),
      dataInicioCampanha: format(startDateTime, 'dd/MM/yyyy HH:mm'),
      dataFimCampanha: format(endDateTime, 'dd/MM/yyyy HH:mm'),
      origin: 'Minha Base',
      pareto: '100/00',
      selectedCelular: ['celular1'],
      custoCampanha: 0,
      whatsapp_midia: true,
      whatsapp_url: art.artURL,
      hostTracker: 'v-ja.co/a/',
      id_propaganda: campaignId,
      id_propaganda_imagem: art.artId,
      ...(art.artURL.endsWith('.mp4') ? { messageType: 'VIDEO' } : {}),
    };

    return api.post('/whatsapp-v2-prd/campaign/create', payloadToWhatsApp);
  });
};

export const distributeToWhatsAppGroup = ({
  arts,
  groups,
  instance,
  text,
  campaignId,
  startDate,
  startTime,
}: DistributeToCustomersData): Promise<AxiosResponse<any, any>>[] => {
  const startDateTime = combineDateAndTime(startDate, startTime);
  const endDateTime = addDays(startDateTime, 7);
  return groups
    .map(group => {
      return arts.map(art => ({
        idInstancia: instance?.id,
        groupId: group,
        id_propaganda: campaignId,
        nomeCampanha: 'WhatsApp post',
        message: text || '',
        dataInicio: format(startDateTime, 'dd/MM/yyyy HH:mm'),
        dataInicioCampanha: format(startDateTime, 'dd/MM/yyyy HH:mm'),
        dataFimCampanha: format(endDateTime, 'dd/MM/yyyy HH:mm'),
        whatsapp_midia: true,
        whatsapp_url: art.artURL,
        ...(art.artURL.endsWith('.mp4') ? { messageType: 'VIDEO' } : {}),
      }));
    })
    .flat(1)
    .map(objectRequest => {
      return api.post('/whatsapp-v2-prd/campaign/create-group', objectRequest);
    });
};

export const distributeToCustomersService = async (distribute: DistributeToCustomersData): Promise<any> => {
  const success: any[] = [];
  const errors: any[] = [];
  const distributeRequests: any[] = [];
  await asyncForEach(distribute.steps, step => {
    if (step === 'whatsapp' && distribute.instance) {
      distribute.sendToWhom.forEach((sendTo: SendToWhomOptions) => {
        if (sendTo === 'private') {
          const distributesWhatsapp = distributeToWhatsApp(distribute);
          distributeRequests.push(...distributesWhatsapp);
        } else if (sendTo === 'group' && distribute.groups.length > 1) {
          const distributesWhatsapp = distributeToWhatsAppGroup(distribute);
          distributeRequests.push(...distributesWhatsapp);
        }
      });
    }
    if (step === 'social-network' && distribute.profile && distribute.socialChannels) {
      distribute.socialChannels.forEach((channel: any) => {
        if (channel.value === 'facebook') {
          const distributeFacebook = distributeToFacebook(distribute);
          distributeRequests.push(distributeFacebook);
        } else if (channel.value === 'instagram' && distribute.arts.length <= 1) {
          const distributeInstagram = distributeToInstagram(distribute);
          distributeRequests.push(distributeInstagram);
        } else if (channel.value === 'instagram' && distribute.arts.length > 1) {
          const distributeInstagramCarousel = distributeToInstagramCarousel(distribute);
          distributeRequests.push(distributeInstagramCarousel);
        }
      });
    }
    if (
      step === 'turbocharged-action' &&
      distribute.location &&
      distribute.location.latitude &&
      distribute.credits &&
      distribute.credits > 0
    ) {
      const distributeTurbochargedAction = distributeToTurbochargedAction(distribute);
      distributeRequests.push(distributeTurbochargedAction);
    }
  });

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  await asyncForEach(distributeRequests, async distribute => {
    try {
      const responseRequests = await Promise.resolve(distribute);

      success.push(responseRequests.data.content);
    } catch (err: any) {
      errors.push(err.response.data.message);
    }
  });

  return { errors, success };
};

export const distributeValidateFields = async (
  formik: FormikProps<object>,
  step: Slug,
  callback?: () => void
): Promise<void> => {
  try {
    formik.validateField('startDate');
    formik.validateField('startTime');

    if (step === 'turbocharged-action') {
      formik.validateField('endDate');
      formik.validateField('endTime');
      formik.validateField('location');
      formik.validateField('credits');
      formik.validateField('objective');
    } else if (step === 'social-network') {
      formik.validateField('socialChannels');
      formik.validateField('profile');
    } else if (step === 'whatsapp') {
      formik.validateField('instance');
      formik.validateField('sendToWhom');
      formik.validateField('groups');
      formik.validateField('instanceIsConnected');
    } else if (step === 'prices') {
      formik.validateField('store');
      if (callback) {
        callback();
      }
    }
  } catch (err) {
    console.log(err);
  }
};
