// 👇️ ts-nocheck disables type checking for entire file
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-disable react/display-name */
import React, { forwardRef, useMemo, useRef } from 'react';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import { Colors, ColorSliderGroup, Text, TouchableOpacity, View } from 'react-native-ui-lib';
import Feather from 'react-native-vector-icons/Feather';

import { useCombinedRefs } from '../../hooks/useCombinedRefs';
import { isHEX } from '../../utils/validators';
import { TextField } from '../TextField';
import styles from './styles';

type ColorPickerModalProps = {
  title: string;
  initialColor: string;
  color: string;
  onChange: (color: string) => void;
  // onSubmit: (color: string) => void;
  onRequestClose: () => void;
};

export const ColorPickerModal = forwardRef<Modalize, ColorPickerModalProps>(
  ({ title, initialColor, color, onChange, onRequestClose }, ref) => {
    const modalizeRef = useRef(null);
    const combinedRef = useCombinedRefs(ref, modalizeRef);

    const colorPreviewStyle = useMemo(() => {
      return [styles.colorPreview, { backgroundColor: color }];
    }, [color]);

    function renderContent() {
      return (
        <View flex style={styles.content}>
          <View row style={styles.header}>
            <View />
            <Text text70R numberOfLines={1}>
              {title}
            </Text>
            <TouchableOpacity onPress={onRequestClose}>
              <Feather name='x' size={22} color={Colors.gray30} />
            </TouchableOpacity>
          </View>
          <View padding-page>
            <View style={colorPreviewStyle} />
            <TextField
              label='Cor'
              value={color}
              onChangeText={onChange}
              errorText={isHEX(color) ? undefined : 'Hex inválido'}
              error={!isHEX(color)}
            />
            <ColorSliderGroup initialColor={color ?? initialColor} showLabels onValueChange={onChange} />
          </View>
        </View>
      );
    }

    return (
      <Portal>
        <Modalize ref={combinedRef} disableScrollIfPossible adjustToContentHeight>
          {renderContent()}
        </Modalize>
      </Portal>
    );
  }
);
