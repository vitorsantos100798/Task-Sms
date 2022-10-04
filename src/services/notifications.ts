import notifee from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';

import api from './api';

export const saveTokenToDatabase = async (token: string) => {
  const user = await AsyncStorage.getItem('@datasales:user');
  const response = await api.post('/notification-dev/datasales-client/store-token', {
    token,
    user,
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return response.data;
};

export const enabledPushNotification = async (): Promise<boolean> => {
  try {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    return enabled;
  } catch (err) {
    return false;
  }
};

export const registerAndGetToken = async () => {
  try {
    const token = await messaging().getToken();
    await messaging().registerDeviceForRemoteMessages();

    return token;
  } catch (err) {
    console.log('ERRO REGISTER AND TOKEN => ', err);
  }
};

export const tokenRefresh = () =>
  messaging().onTokenRefresh(async token => {
    await saveTokenToDatabase(token);
  });

export const displayNotification = async (params: FirebaseMessagingTypes.RemoteMessage) => {
  // Create a channel
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Diversos',
  });
  // Display notification
  await notifee.displayNotification({
    title: params.notification?.title,
    body: params.notification?.body,
    android: {
      channelId,
    },
  });
};
