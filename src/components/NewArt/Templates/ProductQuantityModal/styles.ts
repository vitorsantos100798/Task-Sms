import { StyleSheet } from 'react-native';
import { getBottomSpace } from 'react-native-iphone-x-helper';
import { Colors, Spacings } from 'react-native-ui-lib';

export default StyleSheet.create({
  header: {
    padding: Spacings.s3,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    justifyContent: 'center',
    marginBottom: Spacings.s8,
  },
  content: {
    paddingHorizontal: Spacings.s10,
    paddingTop: Spacings.s2,
    paddingBottom: getBottomSpace() + Spacings.s8,
  },
  slider: {
    flex: 1,
    marginRight: Spacings.s2,
  },
  track: {
    height: 6,
  },
  thumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderColor: Colors.white,
    borderWidth: 1,
    elevation: 20,
    shadowColor: Colors.grey30,
  },
  activeThumb: {
    width: 26,
    height: 26,
    borderRadius: 20,
  },
});
