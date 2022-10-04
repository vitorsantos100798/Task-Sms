import React, { useCallback } from 'react';
import { StatusBar } from 'react-native';
import { Colors, TouchableOpacity, Text, View } from 'react-native-ui-lib';
import Feather from 'react-native-vector-icons/Feather';

import styles from './styles';

type CampaignHeaderProps = {
  label: string;
};

export function CampaignHeader({ label }: CampaignHeaderProps) {
  const handleEditFolder = useCallback(() => {}, []);

  return (
    <View flex row style={styles.container}>
      <StatusBar barStyle='light-content' />
      {/* <TouchableOpacity marginR-s2 onPress={handleEditFolder}>
        <Feather name="edit-3" size={18} color={Colors.white} />
      </TouchableOpacity> */}
      <Text text75BL numberOfLines={1} white>
        {label}
      </Text>
    </View>
  );
}
