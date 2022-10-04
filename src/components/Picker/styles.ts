import { StyleSheet } from 'react-native';
import { Spacings } from 'react-native-ui-lib';

import { BORDER_RADIUS } from '../../utils/constants';

export default StyleSheet.create({
  container: {
    paddingHorizontal: Spacings.s3,
    borderRadius: BORDER_RADIUS,
    width: '100%',
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
