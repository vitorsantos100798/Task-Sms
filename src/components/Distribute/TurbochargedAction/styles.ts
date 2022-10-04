import { StyleSheet } from 'react-native';
import { Colors, Spacings } from 'react-native-ui-lib';
import { BORDER_RADIUS } from '../../../utils/constants';
import { heightPercentageToDP } from '../../../utils/dimensions';

export default StyleSheet.create({
  divider: {
    borderColor: Colors.grey70,
    borderBottomWidth: 2,
  },
  mapContainer: {
    height: heightPercentageToDP('20%'),
    width: '100%',
    borderRadius: BORDER_RADIUS,
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
  textfieldSearch: {
    marginBottom: Spacings.s4,
  },
});
