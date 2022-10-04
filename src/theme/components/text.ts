import { Typography, TextProps } from 'react-native-ui-lib';

export function getTextProps(props: TextProps) {
  return {
    style: [Typography.medium, props.style],
  };
}
