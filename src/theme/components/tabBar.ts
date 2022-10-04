import { StyleSheet } from 'react-native';
import { Colors, TabBarProps, Typography } from 'react-native-ui-lib';

import { colors } from '../designSystem';

export function getTabBarProps(props: TabBarProps) {
  return {
    indicatorInsets: 0,
    activeBackgroundColor: Colors.white,
    labelColor: Colors.grey20,
    selectedLabelColor: colors?.secondary,
    labelStyle: Typography.medium,
    selectedLabelStyle: Typography.medium,
    indicatorStyle: [
      {
        backgroundColor: colors?.secondary,
        height: 2,
      },
      props.indicatorStyle,
    ],
    containerStyle: [
      {
        borderBottomColor: Colors.grey60,
        borderBottomWidth: StyleSheet.hairlineWidth,
      },
    ],
  };
}
