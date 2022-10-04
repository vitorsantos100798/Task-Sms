import { StyleSheet } from 'react-native';
import { Colors } from 'react-native-ui-lib';
import { colors } from '../../../theme/designSystem';

import { BORDER_RADIUS } from '../../../utils/constants';

export default StyleSheet.create({
  option: {
    backgroundColor: Colors.grey70,
    borderRadius: BORDER_RADIUS,
  },
  optionSelected: {
    backgroundColor: Colors.grey70,
    borderRadius: BORDER_RADIUS,
    borderColor: colors.secondary,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  icon: { color: colors.secondary },
  containerIconText: {
    alignItems: 'center',
  },
});
