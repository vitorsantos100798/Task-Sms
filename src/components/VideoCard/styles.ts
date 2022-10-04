import { StyleSheet } from 'react-native';
import { Colors, Spacings } from 'react-native-ui-lib';

import { BORDER_RADIUS } from '../../utils/constants';
import { heightPercentageToDP, widthPercentageToDP } from '../../utils/dimensions';

export default StyleSheet.create({
  videoContainer: {
    padding: Spacings.s2,
    height: heightPercentageToDP('25%'),
    width: widthPercentageToDP('50%'),
    borderRadius: BORDER_RADIUS,
  },
  videoContainerWithoutPadding: {
    borderRadius: BORDER_RADIUS,
    height: heightPercentageToDP('25%'),
  },
  video: {
    flex: 1,
    height: '100%',
    width: '100%',
  },
  moreButton: {
    position: 'absolute',
    top: Spacings.s2,
    right: Spacings.s1,
    backgroundColor: Colors.white,
    borderRadius: BORDER_RADIUS,
    padding: Spacings.s1,
  },
  videoSelectedContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  videoSelected: {
    backgroundColor: Colors.rgba(Colors.white, 0.5),
    borderRadius: BORDER_RADIUS,
    padding: Spacings.s2,
    borderColor: Colors.primary,
    borderWidth: 1,
  },
  thumbnailPlay: {
    backgroundColor: Colors.rgba(Colors.black, 0.4),
    padding: Spacings.s2,
    borderRadius: widthPercentageToDP('100%'),
  },
});
