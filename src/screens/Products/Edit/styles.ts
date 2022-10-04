import { StyleSheet } from 'react-native';
import { getBottomSpace } from 'react-native-iphone-x-helper';
import { Spacings } from 'react-native-ui-lib';

import { BORDER_RADIUS } from '../../../utils/constants';

export default StyleSheet.create({
  content: {
    paddingHorizontal: Spacings.s4,
    paddingBottom: getBottomSpace() + Spacings.s4,
  },
  productImageContainer: {
    borderRadius: BORDER_RADIUS,
  },
  productImage: {
    height: 200,
    width: 200,
  },
});
