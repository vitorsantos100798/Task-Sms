import { StyleSheet } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { Colors, Spacings } from 'react-native-ui-lib';

export default StyleSheet.create({
  submitButton: {
    width: '100%',
    height: 49,
  },
  leadingAccessory: {
    marginRight: Spacings.s2,
  },
  circle: {
    width: RFPercentage(10),
    height: RFPercentage(10),
    borderRadius: RFPercentage(5),
    borderColor: Colors.secondary,
    borderWidth: 4,
  },
});
