import { StyleSheet } from 'react-native';
import { Spacings } from 'react-native-ui-lib';

export default StyleSheet.create({
  modalHeader: {
    padding: Spacings.s4,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    alignItems: 'center',
  },
  applyButton: {
    position: 'absolute',
    height: 52,
    bottom: 30,
    right: 10,
    left: 10,
    zIndex: 999,
  },
});
