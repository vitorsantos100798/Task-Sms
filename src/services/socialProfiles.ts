import { LoginManager, AccessToken, Profile } from 'react-native-fbsdk-next';

import { SocialProfile, SocialProfilePages } from '../types/socialProfile';
import { PERMISSIONS_FB } from '../utils/constants';
import api from './api';

type ResponseCreateAccessToken = {
  pages: SocialProfilePages[];
  userID?: string;
};

export const listSocialProfileService = async (): Promise<SocialProfile[]> => {
  const response = await api.get<{ content: SocialProfile[] }>('/social-networks-v2-dev/pages');

  return response.data.content;
};

export const createAccessTokenFacebookInstagram = async (): Promise<ResponseCreateAccessToken> => {
  const response = await LoginManager.logInWithPermissions(PERMISSIONS_FB);

  if (response.isCancelled) {
    throw new Error('Error linking account to DS Marketing');
  } else {
    const profile = await Profile.getCurrentProfile();

    const token = await AccessToken.getCurrentAccessToken();

    const objectPayloadUser = {
      fb_user_id: token?.userID,
      name: profile?.name,
      email: profile?.email,
      picture_url: profile?.imageURL,
      access_token: token?.accessToken,
      expires_in: token?.expirationTime,
      data_access_expiration_time: token?.dataAccessExpirationTime,
      is_connected: true,
    };
    const responseCreateUser = await api.post('/social-networks-v2-dev/users', objectPayloadUser);

    return {
      pages: responseCreateUser.data?.content?.pages,
      userID: token?.userID,
    };
  }
};

export const activatePagesFacebookInstagram = async (pages: string[], userID?: string) => {
  const requestActivatePages = pages.map(page =>
    api.put('/social-networks-v2-dev/pages', {
      fb_user_id: userID,
      page_id: page,
      active: 1,
    })
  );

  const responses = await Promise.all(requestActivatePages);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return responses.map(response => response.data);
};
