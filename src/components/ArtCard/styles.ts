import { StyleSheet } from 'react-native';
import { Colors, Spacings } from 'react-native-ui-lib';

import { BORDER_RADIUS } from '../../utils/constants';

export default StyleSheet.create({
  imageContainer: {
    padding: Spacings.s2,
    borderRadius: BORDER_RADIUS,
  },
  imageContainerWithoutPadding: {
    borderRadius: BORDER_RADIUS,
  },
  image: {
    flex: 1,
    height: 250,
  },
  imageSelected: {
    backgroundColor: Colors.rgba(Colors.white, 0.5),
    borderRadius: BORDER_RADIUS,
    borderColor: Colors.primary,
    borderWidth: 1,
  },
  moreButton: {
    position: 'absolute',
    top: Spacings.s2,
    right: Spacings.s1,
    backgroundColor: Colors.white,
    borderRadius: BORDER_RADIUS,
    padding: Spacings.s1,
  },
});
