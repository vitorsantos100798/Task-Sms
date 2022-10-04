import { StyleSheet } from 'react-native';
import { Colors, Spacings } from 'react-native-ui-lib';

import { BORDER_RADIUS } from '../../utils/constants';

export default StyleSheet.create({
  listHeader: {
    padding: Spacings.s4,
  },
  searchBar: {
    borderWidth: 0,
    backgroundColor: Colors.grey70,
  },
  listItemImage: {
    flex: 1,
    height: 180,
  },
  listItem: {
    borderRadius: BORDER_RADIUS,
  },
  content: {
    paddingHorizontal: Spacings.s2,
  },
});
