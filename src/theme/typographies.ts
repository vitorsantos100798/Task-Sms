import { Typography } from 'react-native-ui-lib';

import { fonts } from './fonts';

export const typographies = {
  black: {
    fontFamily: fonts.MontserratBlack,
    letterSpacing: 0.25,
  },
  bold: {
    fontFamily: fonts.MontserratBold,
    letterSpacing: 0.25,
  },
  semiBold: {
    fontFamily: fonts.MontserratSemiBold,
    letterSpacing: 0.25,
  },
  extraBold: {
    fontFamily: fonts.MontserratExtraBold,
    letterSpacing: 0.25,
  },
  light: {
    fontFamily: fonts.MontserratLight,
    letterSpacing: 0.25,
  },
  medium: {
    fontFamily: fonts.MontserratMedium,
    letterSpacing: 0.5,
  },
  extraLight: {
    fontFamily: fonts.MontserratExtraLight,
    letterSpacing: 0.25,
  },
  thin: {
    fontFamily: fonts.MontserratThin,
    letterSpacing: 0.25,
  },
  regular: {
    fontFamily: fonts.MontserratMedium,
    letterSpacing: 0.5,
  },
  h1: { ...Typography.text40 },
  h2: { ...Typography.text50 },
  h3: { ...Typography.text70M },
  body: Typography.text70,
  bodySmall: Typography.text80,
};
