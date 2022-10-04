import RNDateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import React, { useMemo, useState } from 'react';
import { ViewStyle } from 'react-native';
import { TextInput } from 'react-native-paper';
import { Colors, Constants, Dialog, Text, TouchableOpacity, View } from 'react-native-ui-lib';
import Feather from 'react-native-vector-icons/Feather';
import { TextField } from '../TextField';
import styles from './styles';

const MODES = {
  DATE: 'date',
  TIME: 'time',
};

type DateTimePickerProps = {
  headerTitle?: string;
  placeholder: string;
  mode?: 'date' | 'time';
  value?: Date;
  onChange: (date: Date) => void;
  minimumDate?: Date;
  maximumDate?: Date;
  dateFormat?: string;
  dateFormatter?: (date: Date) => string;
  timeFormat?: string;
  timeFormatter?: (date: Date) => string;
  locale?: string;
  style?: ViewStyle;
  is24Hour?: boolean;
  minuteInterval?: number;
  timeZoneOffsetInMinutes?: number;
  themeVariant?: 'light' | 'dark';
};

export function DateTimePicker({
  headerTitle,
  placeholder,
  mode = 'date',
  minimumDate,
  maximumDate,
  locale,
  is24Hour,
  minuteInterval,
  timeZoneOffsetInMinutes,
  themeVariant,
  value,
  onChange,
  dateFormat,
  dateFormatter,
  timeFormat,
  timeFormatter,
  style,
}: DateTimePickerProps) {
  const [chosenDate, setChosenDate] = useState<Date>(() => {
    if (value) {
      return value;
    }

    if (minimumDate) {
      return minimumDate;
    }

    return new Date();
  });
  const [isDialogVisible, setIsDialogVisible] = useState(false);

  function handleDialogOpen() {
    setIsDialogVisible(true);
  }

  function handleDialogClose() {
    setIsDialogVisible(false);
  }

  function handleDonePress() {
    handleDialogClose();
    if (chosenDate) {
      onChange(chosenDate);
    } else {
      const date = minimumDate || new Date();

      onChange(date);
    }
  }

  function handleChange(event: DateTimePickerEvent, date: Date | undefined) {
    if (event.type !== 'dismissed' && date !== undefined) {
      setChosenDate(date);

      if (Constants.isAndroid) {
        handleDonePress();
      }
    } else if (event.type === 'dismissed' && Constants.isAndroid) {
      handleDialogClose();
    }
  }
  const stringValue = useMemo(() => {
    if (value) {
      switch (mode) {
        case MODES.DATE:
          return dateFormatter
            ? dateFormatter(value)
            : dateFormat
            ? format(value, dateFormat)
            : value.toLocaleDateString();
        case MODES.TIME:
          return timeFormatter
            ? timeFormatter(value)
            : timeFormat
            ? format(value, timeFormat)
            : value.toLocaleTimeString();
        default:
          return value.toLocaleString();
      }
    }

    return placeholder;
  }, [dateFormat, dateFormatter, mode, placeholder, timeFormat, timeFormatter, value]);

  function renderHeader() {
    return (
      <View row spread bg-white paddingH-20 style={styles.header}>
        <TouchableOpacity onPress={handleDialogClose}>
          <Feather name='x' size={24} color={Colors.grey400} />
        </TouchableOpacity>
        {headerTitle && <Text text60M>{headerTitle}</Text>}
        <TouchableOpacity onPress={handleDonePress}>
          <Feather name='check' size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>
    );
  }

  function renderDateTimePicker() {
    if (isDialogVisible) {
      return (
        <RNDateTimePicker
          mode={mode}
          value={chosenDate}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
          locale={locale}
          is24Hour={is24Hour}
          minuteInterval={minuteInterval}
          timeZoneOffsetInMinutes={timeZoneOffsetInMinutes}
          display={Constants.isIOS ? 'spinner' : undefined}
          themeVariant={themeVariant}
          onChange={handleChange}
        />
      );
    }
  }

  function renderExpandableOverlay() {
    return (
      <Dialog
        visible={isDialogVisible}
        width='100%'
        height={null}
        bottom
        centerH
        onDismiss={handleDialogClose}
        containerStyle={styles.dialog}
        supportedOrientations={['portrait', 'landscape', 'landscape-left', 'landscape-right']} // iOS only
        // {...dialogProps}
      >
        <View>
          {renderHeader()}
          {renderDateTimePicker()}
        </View>
      </Dialog>
    );
  }

  function renderExpandable() {
    return Constants.isAndroid ? renderDateTimePicker() : renderExpandableOverlay();
  }

  return (
    <>
      <TextField
        style={style}
        placeholder={placeholder}
        label={headerTitle}
        value={stringValue === placeholder ? undefined : stringValue}
        onPressIn={handleDialogOpen}
        right={<TextInput.Icon name={mode === 'date' ? 'calendar' : 'clock'} size={18} color={Colors.grey20} />}
      />

      {renderExpandable()}
    </>
  );
}
