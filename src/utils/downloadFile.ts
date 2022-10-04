import { Platform } from 'react-native';
import RNFetchBlob, { FetchBlobResponse, RNFetchBlobConfig } from 'rn-fetch-blob';

import { MIME_TYPES } from './constants';
import { getFileName } from './getFileName';
import { getURLExtension } from './getURLExtension';

const { config, fs } = RNFetchBlob;

export const downloadFile = (url: string, name: string, cache = false): Promise<FetchBlobResponse> => {
  const fileExt = getURLExtension(url);

  const { CacheDir, DocumentDir, PictureDir } = fs.dirs;

  const directoryPath = Platform.select({
    ios: cache ? CacheDir : DocumentDir,
    android: PictureDir,
  });

  const filePath = `${directoryPath}/${getFileName(name, fileExt)}`;

  const configOptions = Platform.select({
    ios: {
      fileCache: true,
      path: filePath,
      appendExt: fileExt,
      notification: true,
    },
    android: {
      fileCache: true,
      appendExt: fileExt,
      addAndroidDownloads: {
        useDownloadManager: true,
        mime: MIME_TYPES[fileExt],
        title: name,
        path: filePath,
        mediaScannable: true,
        notification: true,
      },
    },
  });

  return config(configOptions as RNFetchBlobConfig).fetch('GET', url);
};
