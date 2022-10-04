import { StyleSheet } from 'react-native';
import { Colors } from 'react-native-ui-lib';
import { BORDER_RADIUS } from '../../../utils/constants';

export default StyleSheet.create({
  divider: {
    borderColor: Colors.grey70,
    borderBottomWidth: 2,
  },
  textfieldSearch: {
    backgroundColor: Colors.grey70,
    borderColor: 'transparent',
    borderRadius: BORDER_RADIUS,
  },
});
