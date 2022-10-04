import { RouteProp, useRoute } from '@react-navigation/native';
import React from 'react';
import { Colors, Image, View } from 'react-native-ui-lib';
import { SharedElement } from 'react-navigation-shared-element';

import { useToast } from '../../hooks/useToast';

import { AppStackParamList } from '../../types/navigation';

export function ArtDetails() {
  const {
    params: { artId, artURL, artName },
  } = useRoute<RouteProp<AppStackParamList, 'ArtDetails'>>();

  const toast = useToast();

  return (
    <View backgroundColor={Colors.white}>
      <SharedElement id={`art.${artId}.image_url`}>
        <Image
          style={{
            width: '100%',
            height: '100%',
          }}
          borderRadius={0}
          resizeMode='contain'
          source={{ uri: artURL }}
        />
      </SharedElement>
    </View>
  );
}
