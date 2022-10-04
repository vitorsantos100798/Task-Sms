import { StyleSheet } from 'react-native';
import { Colors, Spacings } from 'react-native-ui-lib';

import { BORDER_RADIUS } from '../../utils/constants';
import { widthPercentageToDP } from '../../utils/dimensions';

export default StyleSheet.create({
  listHeader: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  loopCarousel: {
    position: 'absolute',
    bottom: 15,
    left: 10,
  },
  carouselImage: {
    flex: 1,
    borderRadius: BORDER_RADIUS,
  },
  createListButton: {
    position: 'absolute',
    alignSelf: 'flex-end',
    borderRadius: BORDER_RADIUS,
    height: 50,
    bottom: 10,
    right: 15,
    left: widthPercentageToDP('65%'),
  },
  listContent: {
    paddingHorizontal: Spacings.s2,
    paddingBottom: Spacings.s2,
  },
  listItem: {
    flex: 1,
    flexDirection: 'column',
    margin: Spacings.s2,
  },
  listItemImage: {
    height: 225,
    borderColor: Colors.grey50,
    borderWidth: 1,
  },
  leadingAccessory: {
    marginRight: Spacings.s2,
  },
  leadingAccess: {
    marginLeft: Spacings.s4,
  },
  textfieldSearch: {
    backgroundColor: Colors.grey70,
    borderColor: 'transparent',
  },
});
