import { StyleSheet } from 'react-native';
import { Colors, Spacings } from 'react-native-ui-lib';

import { BORDER_RADIUS } from '../../utils/constants';

export default StyleSheet.create({
  header: {
    paddingHorizontal: Spacings.s4,
    paddingTop: Spacings.s8,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    alignItems: 'center',
  },
  content: {
    paddingHorizontal: Spacings.s2,
  },
  listItem: {
    borderRadius: BORDER_RADIUS,
  },
  listItemImage: {
    flex: 1,
    height: 180,
  },
  leadingAccessory: {
    marginRight: Spacings.s2,
  },
  searchInput: {
    height: 40,
    borderWidth: 0,
    backgroundColor: Colors.grey70,
  },
  searchBar: {
    borderWidth: 0,
    backgroundColor: Colors.grey70,
  },
});
