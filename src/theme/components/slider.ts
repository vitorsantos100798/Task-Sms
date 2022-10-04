import { Colors, Spacings } from 'react-native-ui-lib';

import { colors } from '../designSystem';

export function getSliderProps(props: any) {
  return {
    containerStyle: [
      {
        flex: 1,
        marginRight: Spacings.s2,
      },
      props.containerStyle,
    ],
    trackStyle: [{ height: 6 }, props.trackStyle],
    thumbStyle: [
      {
        width: 26,
        height: 26,
        borderRadius: 13,
        borderColor: Colors.white,
        borderWidth: 1,
        elevation: 20,
        shadowColor: Colors.grey30,
      },
      props.thumbStyle,
    ],
    activeThumbStyle: [
      {
        width: 26,
        height: 26,
        borderRadius: 20,
      },
      props.activeThumbStyle,
    ],
    thumbTintColor: Colors.white,
    minimumTrackTintColor: colors.primary,
    maximumTrackTintColor: Colors.grey60,
  };
}
