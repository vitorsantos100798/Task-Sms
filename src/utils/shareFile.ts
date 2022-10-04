import { Platform } from 'react-native';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';

import { MIME_TYPES } from './constants';
import { downloadFile } from './downloadFile';
import { getURLExtension } from './getURLExtension';

export const shareFile = async (url: string, name: string) => {
  const response = await downloadFile(url, name, true);

  const filePath = response.path();

  const fileExt = getURLExtension(url);

  if (Platform.OS === 'ios') {
    const options = {
      type: fileExt,
      url: filePath,
    };

    await Share.open(options);

    await RNFS.unlink(filePath);
  }

  if (Platform.OS === 'android') {
    const base64 = await RNFS.readFile(filePath, 'base64');

    const base64Data = `data:${MIME_TYPES[fileExt]};base64,${base64}`;

    await Share.open({ url: base64Data });

    await RNFS.unlink(filePath);
  }
};
