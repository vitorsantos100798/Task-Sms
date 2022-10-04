import { StyleSheet } from 'react-native';
import { Colors, Spacings } from 'react-native-ui-lib';

export default StyleSheet.create({
  enableStep: {
    borderWidth: 1,
    borderColor: Colors.primary,
    marginHorizontal: Spacings.s1,
  },
  disableStep: {
    borderWidth: 1,
    borderColor: Colors.grey70,
    marginHorizontal: Spacings.s1,
  },
});
