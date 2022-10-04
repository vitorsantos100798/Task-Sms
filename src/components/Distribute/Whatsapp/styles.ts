import { StyleSheet } from 'react-native';
import { Colors, Spacings } from 'react-native-ui-lib';
import { BORDER_RADIUS } from '../../../utils/constants';

export default StyleSheet.create({
  divider: {
    borderColor: Colors.grey70,
    borderBottomWidth: 2,
  },
  picker: {
    paddingLeft: Spacings.s5,
    paddingRight: Spacings.s4,
    borderRadius: BORDER_RADIUS,
    height: 56,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  textfieldSearch: {
    backgroundColor: Colors.grey70,
    borderColor: 'transparent',
    borderRadius: BORDER_RADIUS,
  },
});
