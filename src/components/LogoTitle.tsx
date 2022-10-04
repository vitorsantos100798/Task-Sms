/* eslint-disable @typescript-eslint/no-use-before-define */
import React from 'react';
import { StyleSheet } from 'react-native';
import { Image } from 'react-native-ui-lib';

import { heightPercentageToDP } from '../utils/dimensions';

export function LogoTitle() {
  return <Image assetGroup='general' assetName='logo' style={styles.logo} resizeMethod='scale' resizeMode='contain' />;
}

const styles = StyleSheet.create({
  logo: {
    height: heightPercentageToDP('4%'),
    width: heightPercentageToDP('20%'),
  },
});
