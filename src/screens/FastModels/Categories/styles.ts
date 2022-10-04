import { StyleSheet } from 'react-native';
import { Colors, Spacings } from 'react-native-ui-lib';
import { BORDER_RADIUS } from '../../../utils/constants';

export default StyleSheet.create({
  leadingAccessory: { marginRight: Spacings.s2 },
  textFieldSearch: { backgroundColor: Colors.white, height: 40 },
  picker: {
    paddingHorizontal: Spacings.s3,
    borderRadius: BORDER_RADIUS,
    borderColor: Colors.grey50,
    borderWidth: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
  },
});
