import { StyleSheet } from 'react-native';
import { getBottomSpace } from 'react-native-iphone-x-helper';
import { Colors, Spacings } from 'react-native-ui-lib';

import { BORDER_RADIUS } from '../../../utils/constants';

export default StyleSheet.create({
  content: {
    paddingHorizontal: Spacings.s4,
    paddingBottom: getBottomSpace() + Spacings.s4,
  },
  productImageContainer: {
    borderRadius: BORDER_RADIUS,
  },
  productImage: {
    height: 200,
    width: 200,
  },
  searchProductButton: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.grey40,
    paddingHorizontal: Spacings.s3,
    borderRadius: BORDER_RADIUS,
    height: 56,
    width: '100%',
    marginBottom: Spacings.s5,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
  },
  container: {
    borderBottomColor: Colors.grey70,
    borderBottomWidth: 5,
    paddingBottom: Spacings.s5,
    marginBottom: Spacings.s5,
  },
  lineContainer: {
    position: 'relative',
    paddingVertical: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  line: {
    height: 2,
    width: '100%',
    backgroundColor: Colors.grey70,
  },
  lineText: {
    bottom: 18,
    position: 'absolute',
    paddingHorizontal: 8,
    backgroundColor: Colors.white,
  },
});
