import { StyleSheet } from 'react-native';

import { heightPercentageToDP, widthPercentageToDP } from '../../utils/dimensions';

export default StyleSheet.create({
  banner: {
    height: heightPercentageToDP('50%'),
    width: widthPercentageToDP('100%'),
  },
});
