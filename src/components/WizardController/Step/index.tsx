import React, { useCallback } from 'react';
import { View } from 'react-native-ui-lib';

import styles from './style';

type WizardStepProps = {
  activeIndex: number;
  steps: number;
};

export function WizardStep({ activeIndex, steps }: WizardStepProps) {
  const isActiveStyle = useCallback(
    (index: number) => {
      if (activeIndex >= index) {
        return styles.enableStep;
      }
      return styles.disableStep;
    },
    [activeIndex]
  );

  return (
    <View row>
      {Array.from({ length: steps }).map((_, index) => (
        <View key={index.toString()} flexG style={isActiveStyle(index)} />
      ))}
    </View>
  );
}
