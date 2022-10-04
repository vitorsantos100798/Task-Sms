import { Typography, LoaderScreenProps } from 'react-native-ui-lib';

export function getLoaderScreenProps(props: LoaderScreenProps) {
  return {
    messageStyle: [Typography.medium, props.messageStyle],
  };
}
