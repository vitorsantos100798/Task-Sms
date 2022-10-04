import { StyleSheet } from 'react-native';
import { Colors } from 'react-native-ui-lib';
import { BORDER_RADIUS } from '../../utils/constants';

export default StyleSheet.create({
  picker: {
    backgroundColor: Colors.white,
    borderRadius: BORDER_RADIUS,
    borderColor: Colors.grey50,
    borderWidth: 1,
    height: 53,
  },
});
