import { StyleSheet } from 'react-native';
import { Colors, Spacings } from 'react-native-ui-lib';

import { BORDER_RADIUS } from '../../utils/constants';

export default StyleSheet.create({
  container: {
    // borderWidth: 1,
    borderRadius: BORDER_RADIUS,
    height: 56,
  },
  icon: {
    marginRight: Spacings.s4,
  },
  success: {
    backgroundColor: Colors.green80,
  },
  description: { flex: 1 },
  error: { backgroundColor: Colors.red80 },
  warning: { backgroundColor: Colors.yellow80 },
  info: { backgroundColor: Colors.blue80 },
});
