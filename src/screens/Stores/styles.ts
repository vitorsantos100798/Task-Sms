import { StyleSheet } from 'react-native';
import { getBottomSpace } from 'react-native-iphone-x-helper';
import { BorderRadiuses, Spacings } from 'react-native-ui-lib';

export default StyleSheet.create({
  image: {
    width: 54,
    height: 54,
    borderRadius: BorderRadiuses.br20,
    marginHorizontal: 14,
  },
  listContent: {
    paddingTop: Spacings.s4,
    paddingBottom: getBottomSpace() + 62,
  },
  newStoreButton: {
    position: 'absolute',
    height: 52,
    bottom: getBottomSpace(),
    right: 10,
    left: 10,
  },
});
