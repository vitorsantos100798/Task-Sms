import React from 'react';
import { Colors, Spacings, Text, TextProps } from 'react-native-ui-lib';

type HelperTextProps = TextProps & {
  text: string;
  error?: boolean;
};

export function HelperText({ text, error = false, ...rest }: HelperTextProps) {
  return (
    <Text
      bodySmall
      marginB-s4
      numberOfLines={1}
      color={error ? Colors.error : undefined}
      style={{
        marginTop: -Spacings.s4,
      }}
      {...rest}>
      {text}
    </Text>
  );
}
