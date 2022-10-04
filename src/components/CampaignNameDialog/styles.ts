import { StyleSheet } from 'react-native';
import { Colors, Spacings } from 'react-native-ui-lib';

export default StyleSheet.create({
  header: {
    paddingHorizontal: Spacings.s4,
    paddingVertical: Spacings.s4,
    marginBottom: Spacings.s2,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.grey60,
  },

  actions: {
    paddingHorizontal: Spacings.s4,
    paddingVertical: Spacings.s6,
  },
});
