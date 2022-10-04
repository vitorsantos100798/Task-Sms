import { StyleSheet } from 'react-native';
import { Spacings } from 'react-native-ui-lib';

import { heightPercentageToDP, widthPercentageToDP } from '../../utils/dimensions';

export default StyleSheet.create({
  signButton: {
    width: '100%',
    height: 49,
  },
  leadingAccessory: {
    marginRight: Spacings.s2,
  },
  banner: {
    height: heightPercentageToDP('40%'),
    width: widthPercentageToDP('80%'),
  },
});
