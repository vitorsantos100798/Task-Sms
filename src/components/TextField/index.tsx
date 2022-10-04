// 👇️ ts-nocheck disables type checking for entire file
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import React, { forwardRef, useMemo, useRef } from 'react';
import { TextInput } from 'react-native-paper';
import { TextInputProps } from 'react-native-paper/lib/typescript/components/TextInput/TextInput';
import { View, Text } from 'react-native-ui-lib';

import { useCombinedRefs } from '../../hooks/useCombinedRefs';
import { HelperText } from '../Form/HelperText';
import styles from './style';

type TextFieldProps = Pick<TextInputProps, Exclude<keyof TextInputProps, 'theme'>> & {
  error?: boolean;
  errorText?: string;
  multiline?: boolean;
  outlineColor?: string;
  flex?: boolean;
  description?: string;
  theme?: ReactNativePaper.Theme;
};

// eslint-disable-next-line react/display-name
export const TextField = forwardRef<TextInputProps, TextFieldProps>(
  ({ flex = true, multiline = false, outlineColor, error, errorText, description, ...rest }, ref) => {
    const textFieldRef = useRef<HTMLInputElement>(null);

    const style = useMemo(() => {
      return [multiline ? styles.containerMultiline : styles.container, rest.style];
    }, [multiline]);

    const combinedRef = useCombinedRefs(ref, textFieldRef);
    return (
      <View marginV-s1 flex={flex}>
        <TextInput
          {...rest}
          ref={combinedRef}
          multiline={multiline}
          mode='outlined'
          outlineColor={outlineColor || 'transparent'}
          error={error}
          style={style}
        />
        {description && (
          <Text grey40 text90BO>
            {description}
          </Text>
        )}

        {error && errorText && (
          <Text>
            <HelperText error text={errorText} />
          </Text>
        )}
      </View>
    );
  }
);
