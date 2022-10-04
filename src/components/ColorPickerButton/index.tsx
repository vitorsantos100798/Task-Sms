import React from 'react';
import { Text, TouchableOpacity, TouchableOpacityProps, View } from 'react-native-ui-lib';

import styles from './styles';

interface ColorPickerButtonProps extends TouchableOpacityProps {
  label: string;
  color: string;
  description?: string;
}

export function ColorPickerButton({ label, description, color, onPress, ...rest }: ColorPickerButtonProps) {
  const colorPreviewStyle = [styles.colorPreview, { backgroundColor: color }];

  return (
    <TouchableOpacity {...rest} style={styles.button} onPress={onPress}>
      <View style={colorPreviewStyle} />
      <View>
        <Text text70R>{label}</Text>
        {description && (
          <Text grey40 text90BO>
            {description}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}
