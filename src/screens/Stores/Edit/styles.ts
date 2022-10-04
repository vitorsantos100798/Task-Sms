import { StyleSheet } from 'react-native';
import { getBottomSpace } from 'react-native-iphone-x-helper';
import { Spacings } from 'react-native-ui-lib';

export default StyleSheet.create({
  logo: {
    height: 200,
    width: 200,
  },
  content: {
    paddingHorizontal: Spacings.s4,
    paddingBottom: getBottomSpace() + Spacings.s4,
  },
  fieldStyle: {
    marginBottom: Spacings.s6,
  },
});
