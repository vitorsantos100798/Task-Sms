import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native-ui-lib';

type SectionProps = {
  title: string;
  rightButtonLabel?: string;
  onRightButtonPress?: () => void;
  children: React.ReactNode;
};

export function Section({ title, rightButtonLabel = 'Ver todos', onRightButtonPress, children }: SectionProps) {
  return (
    <View marginB-s4>
      <View row spread centerV marginB-s3>
        <Text text70BO>{title}</Text>
        {onRightButtonPress && (
          <TouchableOpacity padding-s2 onPress={onRightButtonPress}>
            <Text text80R blue30>
              {rightButtonLabel}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {children}
    </View>
  );
}
