import { StyleSheet } from 'react-native';
import { Colors } from 'react-native-ui-lib';

export default StyleSheet.create({
  footer: {
    backgroundColor: Colors.white,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopColor: Colors.grey50,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey50,
  },
});
