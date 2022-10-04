import { StyleSheet } from 'react-native';
import { Incubator, Spacings, Colors, Typography } from 'react-native-ui-lib';

import { BORDER_RADIUS } from '../../utils/constants';

export function getTextFieldProps(props: Incubator.TextFieldProps) {
  return {
    ...Incubator.TextField.defaultProps,
    enableErrors: true,
    ...(props.validationMessage && {
      validationMessageStyle: [{ marginVertical: Spacings.s2 }, props.validationMessageStyle],
    }),
    style: [Typography.medium, props.style],
    fieldStyle: [
      {
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: Colors.grey40,
        paddingHorizontal: Spacings.s3,
        borderRadius: BORDER_RADIUS,
        width: '100%',
      },
      props.multiline ? { paddingVertical: Spacings.s3 } : { height: 56 },
      props.fieldStyle,
    ],
    ...(props.multiline && {
      style: [{ ...Typography.medium, textAlignVertical: 'top', height: 100 }, props.style],
    }),
    labelColor: {
      default: Colors.$textDefault,
      focus: Colors.$textGeneral,
      error: Colors.$textDangerLight,
      disabled: Colors.$textDisabled,
    },
  };
}
