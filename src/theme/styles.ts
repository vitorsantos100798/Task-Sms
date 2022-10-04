import { StyleSheet } from 'react-native';
import { Colors, Typography } from 'react-native-ui-lib';

export const globalStyles = StyleSheet.create({
  header: {
    borderBottomColor: 'transparent',
    shadowRadius: 0,
    shadowOffset: {
      height: 0,
      width: 0,
    },
    elevation: 0,
    backgroundColor: Colors.screenBG,
  },
  tabBarLabel: { ...Typography.medium },
  tabBar: {
    elevation: 0,
    borderTopColor: Colors.grey60,
    borderTopWidth: StyleSheet.hairlineWidth,
    shadowOffset: {
      width: 0,
      height: 0,
    },
  },
});
