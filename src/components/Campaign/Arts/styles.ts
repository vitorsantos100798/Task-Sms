import { StyleSheet } from 'react-native';
import { getBottomSpace } from 'react-native-iphone-x-helper';
import { Spacings } from 'react-native-ui-lib';

export default StyleSheet.create({
  carousel: {
    position: 'absolute',
    bottom: 15,
    left: 10,
  },
  image: {
    flex: 1,
    resizeMode: 'contain',
  },
  listContent: {
    paddingTop: Spacings.s4,
    paddingBottom: 62 + getBottomSpace(),
  },
  generateButton: {
    position: 'absolute',
    height: 52,
    bottom: getBottomSpace(),
    right: 10,
    left: 10,
  },
});
