/* eslint-disable @typescript-eslint/no-use-before-define */
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacings, Text, TouchableOpacity, View } from 'react-native-ui-lib';
import Feather from 'react-native-vector-icons/Feather';
import Video from 'react-native-video';

import { AppScreenProp, AppStackParamList } from '../../types/navigation';

export function VideoPlayer() {
  const {
    params: { videoTitle, videoUrl },
  } = useRoute<RouteProp<AppStackParamList, 'VideoPlayer'>>();

  const { goBack } = useNavigation<AppScreenProp>();

  const { top } = useSafeAreaInsets();

  return (
    <View flex backgroundColor={Colors.black}>
      <View style={styles.header} height={top + 20} padding-s2>
        <View row centerV>
          <TouchableOpacity
            marginR-s2
            activeBackgroundColor='rgba(255,255,255,0.3)'
            style={{
              borderRadius: 50,
            }}
            hitSlop={{
              top: 10,
              bottom: 10,
              left: 10,
              right: 10,
            }}
            onPress={goBack}>
            <Feather name='chevron-left' size={30} color={Colors.white} />
          </TouchableOpacity>
          <Text text70M white>
            {videoTitle}
          </Text>
        </View>
      </View>
      <Video
        controls
        paused={false}
        style={{
          width: '100%',
          height: '100%',
        }}
        source={{ uri: videoUrl }}
        resizeMode='contain'
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  playButton: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacings.s4,
    paddingVertical: Spacings.s2,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'white',
  },
});
