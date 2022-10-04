import { StyleSheet } from 'react-native';
import { Spacings } from 'react-native-ui-lib';

import { heightPercentageToDP, widthPercentageToDP } from '../../utils/dimensions';

export default StyleSheet.create({
  submitButton: {
    width: '100%',
    height: 49,
  },
  signUpButton: {
    width: '100%',
    height: 49,
  },
  forgotPasswordButton: {
    marginTop: -Spacings.s2,
  },
  leadingAccessory: {
    marginRight: Spacings.s2,
  },
  logo: {
    height: heightPercentageToDP('30%'),
    width: widthPercentageToDP('70%'),
  },
});
