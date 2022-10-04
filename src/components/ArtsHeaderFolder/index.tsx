import React, { useCallback, useState } from 'react';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { Colors, TouchableOpacity, Text, View } from 'react-native-ui-lib';
import Feather from 'react-native-vector-icons/Feather';
import { AppStackParamList, AppScreenProp } from '../../types/navigation';
import styles from './styles';

export function ArtsHeaderFolder({ params: { campaignName } }: RouteProp<AppStackParamList, 'Campaign'>) {
  const { setParams } = useNavigation<AppScreenProp>();
  const [countClicked, setCountClicked] = useState<number>(0);
  const handleEditFolder = useCallback(() => {
    setCountClicked(prev => prev + 1);
    setParams({ editWasClicked: countClicked });
  }, [countClicked]);

  return (
    <View flex row style={styles.container}>
      <Text text60M numberOfLines={1}>
        {campaignName.length < 25 ? campaignName : `${campaignName.substring(0, 25).slice(0, -3)}...`}
      </Text>
      <TouchableOpacity marginL-s2 onPress={handleEditFolder}>
        <Feather name='edit' size={20} color={Colors.secondary} />
      </TouchableOpacity>
    </View>
  );
}
