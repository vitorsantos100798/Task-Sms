import { StyleSheet } from 'react-native';
import { Colors } from 'react-native-ui-lib';

import { heightPercentageToDP } from '../../utils/dimensions';

export default StyleSheet.create({
  container: {},
  headerContainer: {
    alignItems: 'flex-end',
  },
  cameraContainer: {
    flex: 1,
  },
  captureButtonContainer: {
    borderRadius: heightPercentageToDP('10%') / 2,
    borderWidth: 6,
    borderColor: Colors.grey50,
  },
  captureButton: {
    width: '100%',
    height: '100%',
    borderRadius: heightPercentageToDP('10%') / 2,
  },
  permissionText: {
    fontSize: 17,
  },
  hyperlink: {
    color: '#007aff',
    fontWeight: 'bold',
  },
  bold: {
    fontWeight: 'bold',
  },
});
