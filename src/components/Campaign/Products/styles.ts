import { StyleSheet } from 'react-native';
import { getBottomSpace } from 'react-native-iphone-x-helper';
import { Colors, Spacings } from 'react-native-ui-lib';

export default StyleSheet.create({
  listItemContainer: {
    borderBottomWidth: 1,
    borderColor: Colors.grey60,
  },
  listItemImage: {
    width: 62,
    height: 62,
  },
  listContent: {
    paddingTop: Spacings.s4,
    paddingBottom: getBottomSpace() + 62,
  },
  newProductButton: {
    position: 'absolute',
    height: 52,
    bottom: getBottomSpace(),
    right: 10,
    left: 10,
  },
});
