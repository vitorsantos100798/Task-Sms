import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View, Text, Spacings } from 'react-native-ui-lib';

import { useAuth } from '../../../hooks/useAuth';

export function Header() {
  const { user } = useAuth();

  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        paddingTop: insets.top + Spacings.s4,
        paddingBottom: Spacings.s4,
        paddingHorizontal: Spacings.s4,
        flex: 1,
      }}>
      <Text text50BO>Olá {user.name}</Text>
    </View>
  );
}
