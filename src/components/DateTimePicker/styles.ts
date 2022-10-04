import { StyleSheet } from 'react-native';
import { Colors, Spacings } from 'react-native-ui-lib';

import { BORDER_RADIUS } from '../../utils/constants';

export default StyleSheet.create({
  header: {
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey80,
    alignItems: 'center',
  },
  container: {
    paddingHorizontal: Spacings.s3,
    borderRadius: BORDER_RADIUS,
    height: 56,
    width: '100%',
    marginBottom: Spacings.s5,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
  },
  dialog: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
});
