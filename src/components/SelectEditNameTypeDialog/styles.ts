import { StyleSheet } from 'react-native';
import { Colors, Spacings } from 'react-native-ui-lib';

export default StyleSheet.create({
  header: {
    paddingHorizontal: Spacings.s4,
    paddingVertical: Spacings.s6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.grey60,
  },
  option: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacings.s4,
    borderRadius: 4,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.grey40,
    marginBottom: Spacings.s2,
  },
  selectedOption: {
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacings.s4,
    paddingVertical: Spacings.s6,
  },
  textfieldSearch: {
    backgroundColor: '#E5E5E5',
    borderColor: 'transparent',
  },
});
