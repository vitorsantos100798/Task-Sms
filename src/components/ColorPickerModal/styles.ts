import { StyleSheet } from 'react-native';
import { getBottomSpace } from 'react-native-iphone-x-helper';
import { Spacings, Colors } from 'react-native-ui-lib';

import { heightPercentageToDP } from '../../utils/dimensions';

export default StyleSheet.create({
  header: {
    padding: Spacings.s3,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  content: {
    paddingBottom: getBottomSpace(),
  },
  listItemIcon: {
    marginRight: Spacings.s3,
  },
  colorPreview: {
    height: heightPercentageToDP('10%'),
    width: '100%',
    marginBottom: Spacings.s6,
    borderRadius: 4,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.grey40,
  },
  slider: {
    marginVertical: 6,
  },
  group: {
    padding: Spacings.s4,
  },
});
