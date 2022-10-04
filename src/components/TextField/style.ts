import { StyleSheet } from 'react-native';
import { Colors, Typography } from 'react-native-ui-lib';
import { BORDER_RADIUS } from '../../utils/constants';

export default StyleSheet.create({
  containerMultiline: {
    height: 100,
    justifyContent: 'center',
    fontSize: Typography.text80?.fontSize,
    backgroundColor: Colors.grey70,
    borderColor: 'transparent',
    borderRadius: BORDER_RADIUS,
  },
  container: {
    height: 52,
    justifyContent: 'center',
    fontSize: Typography.text80?.fontSize,
    backgroundColor: Colors.grey70,
    borderColor: 'transparent',
    borderRadius: BORDER_RADIUS,
  },
});
