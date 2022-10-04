// 👇️ ts-nocheck disables type checking for entire file
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-disable import/no-unresolved */
import { map } from 'lodash';
import React, { useCallback } from 'react';
import { ActivityIndicator, ViewStyle } from 'react-native';
import { TextInput } from 'react-native-paper';
import { Colors, MarginModifiers, PaddingModifiers, Text, Typography, View } from 'react-native-ui-lib';
import {
  PickerProps as RNUIPickerProps,
  PickerValue,
} from 'react-native-ui-lib/generatedTypes/src/components/picker/types';
import RNUIPicker from 'react-native-ui-lib/picker';
import Feather from 'react-native-vector-icons/Feather';

import { HelperText } from '../Form/HelperText';
import { TextField } from '../TextField';
import styles from './styles';

type PickerProps<T> = Pick<RNUIPickerProps, 'topBarProps' | 'showSearch'> &
  MarginModifiers &
  PaddingModifiers & {
    outlineColor?: string;
    placeholder: string;
    validationMessage?: string;
    options: T[];
    value?: string | number;
    severity: 'success' | 'warning' | 'error' | 'info';
    loading: boolean;
    style?: ViewStyle;
    getOptionLabel: (option: T) => string;
    getOptionValue: (option: T) => string | number;
    getOptionDisabled?: (option: T) => boolean;
    onValueChange: (value: T) => void;
    renderItem?: (item: T, isSelected?: boolean) => React.ReactElement;
    flex?: boolean;
  };

const icons = {
  success: 'check-circle',
  warning: 'alert-triangle',
  error: 'x-circle',
  info: 'info',
};

const SEVERITY_COLORS = {
  success: {
    icon: Colors.green40,
  },
  warning: {
    icon: Colors.yellow40,
  },
  error: {
    icon: Colors.red40,
  },
  info: {
    icon: Colors.blue40,
  },
};

export function Picker<T>({
  flex = true,
  topBarProps,
  validationMessage,
  showSearch,
  placeholder,
  options,
  value,
  severity,
  loading,
  style,
  outlineColor,
  getOptionLabel,
  getOptionValue,
  getOptionDisabled,
  onValueChange,
  renderItem,
  ...rest
}: PickerProps<T>) {
  const handleChange = useCallback(
    (item: PickerValue) => {
      if (!onValueChange) return;

      const newValue = options.find(o => {
        const optionValue = getOptionValue(o);
        return optionValue === item;
      });

      if (newValue) {
        onValueChange(newValue);
      }
    },
    [getOptionValue, onValueChange, options]
  );

  const renderPicker = useCallback(
    item => {
      const newValue = options.find(o => {
        const optionValue = getOptionValue(o);
        return optionValue === item;
      });

      return (
        <TextField
          flex={flex}
          left={
            loading ? (
              <ActivityIndicator size={Typography.text60?.fontSize} color={Colors.grey10} />
            ) : (
              severity && (
                <TextInput.Icon
                  name={icons[severity]}
                  size={Typography.text60?.fontSize}
                  color={SEVERITY_COLORS[severity].icon}
                />
              )
            )
          }
          right={<TextInput.Icon name='chevron-down' size={Typography.text50?.fontSize} color={Colors.grey10} />}
          label={placeholder}
          value={getOptionLabel(newValue as T)}
          outlineColor={outlineColor}
          style={style}
        />
      );
    },
    [getOptionLabel, getOptionValue, options, placeholder, flex]
  );

  const getPickerItemBaseProps = useCallback(
    (option: T) => {
      return {
        key: getOptionLabel(option),
        label: getOptionLabel(option),
        value: getOptionValue(option),
        disabled: !!getOptionDisabled && getOptionDisabled(option),
        labelStyle: {
          ...Typography.medium,
          color: getOptionDisabled && getOptionDisabled(option) ? Colors.$textDisabled : Colors.grey10,
        },
        ...(renderItem && {
          renderItem: (_: any, { isSelected }: any) => renderItem(option, isSelected),
        }),
      };
    },
    [getOptionDisabled, getOptionLabel, getOptionValue, renderItem]
  );

  return (
    <>
      <View
        {...rest}
        style={{
          flex: 1,
        }}>
        <RNUIPicker
          migrate
          topBarProps={topBarProps}
          showSearch={showSearch}
          onChange={handleChange}
          value={value}
          renderPicker={renderPicker}>
          {map(options, option => {
            return <RNUIPicker.Item {...getPickerItemBaseProps(option)} />;
          })}
        </RNUIPicker>
      </View>
      {validationMessage && <HelperText error text={validationMessage} />}
    </>
  );
}
