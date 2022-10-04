import { StyleSheet } from 'react-native';
import { Colors, WizardProps, Typography } from 'react-native-ui-lib';

import { colors } from '../designSystem';

export const getWizardProps = (props: WizardProps) => {
  return {
    containerStyle: [
      {
        ...Typography.medium,
        borderBottomColor: Colors.grey60,
        borderBottomWidth: StyleSheet.hairlineWidth,
        shadowRadius: 0,
        shadowOffset: {
          height: 0,
          width: 0,
        },
        elevation: 0,
      },
      props.containerStyle,
    ],
    activeConfig: [
      {
        circleColor: colors?.secondary,
        labelStyle: {
          color: colors?.secondary,
        },
        indexLabelStyle: {
          color: colors?.secondary,
        },
      },
      props.activeConfig,
    ],
  };
};
