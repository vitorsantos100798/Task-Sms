import CameraRoll from '@react-native-community/cameraroll';
import { PermissionsAndroid, Platform } from 'react-native';

import { downloadFile } from './downloadFile';

type DownloadMultArt = Array<{ imageURL: string; name: string }>;

async function hasAndroidPermission() {
  const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

  const hasPermission = await PermissionsAndroid.check(permission);
  if (hasPermission) {
    return true;
  }

  const status = await PermissionsAndroid.request(permission);
  return status === 'granted';
}

export const saveArt = async (imageURL: string, name: string, album?: string): Promise<any> => {
  if (Platform.OS === 'android') {
    if (!(await hasAndroidPermission())) {
      throw new Error('Permission denied');
    }

    return downloadFile(imageURL, name);
  }

  return CameraRoll.save(imageURL, {
    album,
    type: 'photo',
  });
};

export const saveMultiArts = async (arts: DownloadMultArt, album?: string): Promise<any> => {
  if (Platform.OS === 'android') {
    if (!(await hasAndroidPermission())) {
      throw new Error('Permission denied');
    }

    const downloadArts = arts.map(art => downloadFile(art.imageURL, art.name));

    return Promise.all(downloadArts);
  }

  const downloadArtsIos = arts.map(art =>
    CameraRoll.save(art.imageURL, {
      album,
      type: 'photo',
    })
  );

  return Promise.all(downloadArtsIos);
};
