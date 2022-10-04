import codePush, { CodePushOptions } from 'react-native-code-push';

export const codePushConfig: CodePushOptions = {
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
  installMode: codePush.InstallMode.ON_NEXT_RESTART,
};
