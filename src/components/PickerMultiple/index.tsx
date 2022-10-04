/* eslint-disable import/no-unresolved */
// 👇️ ts-nocheck disables type checking for entire file
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { isArray, map } from 'lodash';
import React, { useCallback, useMemo } from 'react';
import { ViewStyle } from 'react-native';
import { Chip, Colors, MarginModifiers, PaddingModifiers, Text, Typography, View } from 'react-native-ui-lib';
import {
  PickerProps as RNUIPickerProps,
  PickerValue,
} from 'react-native-ui-lib/generatedTypes/src/components/picker/types';
import RNUIPicker from 'react-native-ui-lib/picker';
import Feather from 'react-native-vector-icons/Feather';

import { HelperText } from '../Form/HelperText';
import styles from './styles';

type PickerProps<T> = Pick<RNUIPickerProps, 'topBarProps' | 'showSearch' | 'renderItem'> &
  MarginModifiers &
  PaddingModifiers & {
    placeholder: string;
    validationMessage?: string;
    options: T[];
    value?: T[];
    style?: ViewStyle;
    getOptionLabel: (option: T) => string;
    getOptionValue: (option: T) => string | number;
    getOptionDisabled?: (option: T) => boolean;
    onValueChange: (value: T[]) => void;
    renderItem?: (value: T, isSelected: boolean) => React.ReactElement;
  };

export function PickerMultiple<T>({
  topBarProps,
  validationMessage,
  showSearch,
  placeholder,
  options,
  value,
  getOptionLabel,
  getOptionValue,
  getOptionDisabled,
  onValueChange,
  renderItem,
  style,
  ...rest
}: PickerProps<T>) {
  const handleChange = useCallback(
    (items: PickerValue) => {
      if (!onValueChange) return;

      if (!Array.isArray(items)) return;

      const newValue = map(items, item => {
        return options.find(o => {
          const optionValue = getOptionValue(o);
          return optionValue === item;
        });
      });

      if (newValue) {
        onValueChange(newValue as T[]);
      }
    },
    [getOptionValue, onValueChange, options]
  );

  const renderPicker = useCallback(
    items => {
      const selectedItems = map(items, item => {
        return options.find(o => {
          const optionValue = getOptionValue(o);
          return optionValue === item;
        });
      });

      return (
        <View row style={styles.container}>
          {selectedItems && selectedItems.length > 0 ? (
            <View flex row paddingV-s1 style={{ flexWrap: 'wrap' }}>
              {map(selectedItems, i => (
                <Chip
                  key={getOptionLabel(i as T)}
                  label={getOptionLabel(i as T)}
                  marginR-s1
                  marginV-s1
                  labelStyle={{
                    color: Colors.grey10,
                  }}
                  containerStyle={{
                    borderColor: Colors.grey10,
                  }}
                />
              ))}
            </View>
          ) : (
            <Text flex text70 grey30>
              {placeholder}
            </Text>
          )}

          <Feather name='chevron-down' size={Typography.text50?.fontSize} color={Colors.grey10} />
        </View>
      );
    },
    [getOptionLabel, getOptionValue, options, placeholder]
  );

  const pickerValue = useMemo(() => {
    if (!value) return [];
    if (!isArray(value)) return [];
    return map(value, item => {
      return getOptionValue(item);
    });
  }, [getOptionValue, value]);

  const getPickerItemBaseProps = useCallback(
    (option: T) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return {
        key: getOptionLabel(option),
        label: getOptionLabel(option),
        value: getOptionValue(option),
        disabled: !!getOptionDisabled && getOptionDisabled(option),
        labelStyle: {
          ...Typography.text70,
          color: getOptionDisabled && getOptionDisabled(option) ? Colors.$textDisabled : Colors.grey10,
        },
        ...(renderItem && {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
          renderItem: (_: any, { isSelected }: any) => renderItem(option, isSelected),
        }),
      };
    },
    [getOptionDisabled, getOptionLabel, getOptionValue, renderItem]
  );

  return (
    <>
      <View style={style} {...rest}>
        <RNUIPicker
          {...rest}
          migrate
          showSearch={showSearch}
          onChange={handleChange}
          value={pickerValue}
          renderPicker={renderPicker}
          mode={RNUIPicker.modes.MULTI}
          topBarProps={{
            ...topBarProps,
            doneLabel: 'Salvar',
          }}>
          {map(options, option => {
            return <RNUIPicker.Item {...getPickerItemBaseProps(option)} />;
          })}
        </RNUIPicker>
      </View>
      {validationMessage && <HelperText marginT-s6 error text={validationMessage} />}
    </>
  );
}
