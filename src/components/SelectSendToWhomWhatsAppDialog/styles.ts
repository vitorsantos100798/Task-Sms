import { StyleSheet } from 'react-native';
import { Colors, Spacings } from 'react-native-ui-lib';
import { colors } from '../../theme/designSystem';

import { BORDER_RADIUS } from '../../utils/constants';

export default StyleSheet.create({
  header: {
    paddingHorizontal: Spacings.s4,
    paddingVertical: Spacings.s6,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: Spacings.s3,
    borderTopWidth: 2,
    borderTopColor: Colors.grey60,
  },
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
  listContent: {
    paddingHorizontal: Spacings.s2,
    paddingBottom: Spacings.s2,
  },
  optionItemGroup: {
    alignItems: 'center',
  },
});
