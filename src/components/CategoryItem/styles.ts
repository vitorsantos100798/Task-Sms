import { StyleSheet } from 'react-native';

import { BORDER_RADIUS } from '../../utils/constants';
import { widthPercentageToDP } from '../../utils/dimensions';

export default StyleSheet.create({
  imageContainer: {
    borderRadius: 48 / 2,
    height: 48,
    width: 48,
    overflow: 'hidden',
  },
  image: {
    flex: 1,
  },
  imageSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: BORDER_RADIUS,
  },
});
