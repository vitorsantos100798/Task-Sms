import { StyleSheet } from 'react-native';
import { Colors, Spacings } from 'react-native-ui-lib';
import { colors } from '../../theme/designSystem';

import { BORDER_RADIUS } from '../../utils/constants';

export default StyleSheet.create({
  header: {
    paddingHorizontal: Spacings.s4,
    paddingVertical: Spacings.s6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.grey60,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacings.s4,
    paddingVertical: Spacings.s6,
  },
  option: {
    backgroundColor: Colors.grey70,
    borderRadius: BORDER_RADIUS,
  },
  optionSelected: {
    backgroundColor: Colors.grey70,
    borderRadius: BORDER_RADIUS,
    borderColor: colors.secondary,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  icon: { color: colors.secondary },
});
