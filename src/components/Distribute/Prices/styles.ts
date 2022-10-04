import { StyleSheet } from 'react-native';
import { Colors } from 'react-native-ui-lib';

import { BORDER_RADIUS } from '../../../utils/constants';
import { heightPercentageToDP } from '../../../utils/dimensions';

export default StyleSheet.create({
  contentStore: {
    alignItems: 'center',
  },
  pickerStore: {
    backgroundColor: Colors.white,
  },
  imageSubcategory: {
    width: 80,
    height: 80,
  },
  contentSubcategories: {
    borderTopWidth: 2,
    borderTopColor: Colors.white,
  },
  contentInfoPrice: {
    justifyContent: 'center',
    flex: 1,
  },
  textfieldPrice: {
    backgroundColor: Colors.white,
    borderRadius: BORDER_RADIUS,
    borderColor: Colors.grey50,
    height: heightPercentageToDP('6%'),
  },
});
