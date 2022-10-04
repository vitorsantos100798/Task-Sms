import { StyleSheet } from 'react-native';
import { Colors, Spacings } from 'react-native-ui-lib';

export default StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorPreview: {
    height: 36,
    width: 36,
    borderWidth: 1,
    borderColor: Colors.grey40,
    borderRadius: 4,
    marginRight: Spacings.s3,
  },
});
