import { Typography } from 'react-native-ui-lib';
import { BORDER_RADIUS } from '../../utils/constants';
import { colors } from '../designSystem';

export const buttonDefaultProps = {
  borderRadius: BORDER_RADIUS,
  backgroundColor: colors?.secondary,
  labelStyle: Typography.medium,
  customTypography: true,
};
