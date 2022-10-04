import React, { useCallback } from 'react';
import { Platform } from 'react-native';
import {
  Checkbox,
  Colors,
  Image,
  LoaderScreen,
  MarginModifiers,
  PaddingModifiers,
  Text,
  TextProps,
  TouchableOpacity,
  View,
} from 'react-native-ui-lib';
import Feather from 'react-native-vector-icons/Feather';
import Video from 'react-native-video';

// import { createThumbnail } from 'react-native-create-thumbnail';
import { Art } from '../../types/art';
import styles from './styles';

type ArtCardProps = MarginModifiers &
  PaddingModifiers & {
    name?: string;
    videoURL: string;
    height?: number | string;
    withMoreButton?: boolean;
    sharedElementId?: string;
    onPress?: (art: Art) => void;
    onMorePress?: () => void;
    nameProps?: TextProps;
    isProcessing?: boolean;
    isSelectable?: boolean;
    selected?: boolean;
  };

export function VideoCard({
  name,
  videoURL,
  height,
  margin,
  withMoreButton,
  isProcessing,
  onPress,
  onMorePress,
  nameProps = {
    text80M: true,
    numberOfLines: 1,
  },
  isSelectable = false,
  selected,
  ...rest
}: ArtCardProps) {
  // const [thumbVideo, setThumbVideo] = useState('');
  // useEffect(() => {
  //   createThumbnail({
  //     url: videoURL,
  //     timeStamp: 5000,
  //   })
  //     .then(response => setThumbVideo(response.path))
  //     .catch(err => console.log({ err }));
  // }, [videoURL]);

  const RenderCheckbox = useCallback(
    () => (
      <View flex style={styles.videoSelected}>
        <Checkbox color={Colors.primary} borderRadius={2} value />
      </View>
    ),
    []
  );

  const RenderButtonPlayer = useCallback(
    () => (
      <View flex center>
        <Feather name='play' size={30} color={Colors.white} style={styles.thumbnailPlay} />
      </View>
    ),
    []
  );

  return (
    <TouchableOpacity flex centerV activeBackgroundColor={Colors.white} margin-s2={margin} onPress={onPress} {...rest}>
      <View
        flex
        backgroundColor={Colors.grey60}
        style={isSelectable ? styles.videoContainerWithoutPadding : styles.videoContainer}
        marginB-s3>
        {selected && Platform.OS === 'ios' && (
          <View flex style={styles.videoSelectedContainer}>
            {RenderCheckbox()}
          </View>
        )}
        {isProcessing ? (
          <LoaderScreen color={Colors.primary} message='Processando...' overlay size='small' />
        ) : Platform.OS === 'ios' ? (
          <Video controls style={[styles.video, { height }]} source={{ uri: videoURL }} resizeMode='contain' paused />
        ) : (
          // <Image
          //   style={[styles.video, { height }]}
          //   source={{ uri: thumbVideo }}
          //   resizeMethod="resize"
          //   resizeMode="contain"
          //   customOverlayContent={
          //     selected ? RenderCheckbox() : RenderButtonPlayer()
          //   }
          // />
          <Image
            style={[styles.video, { height }]}
            source={{
              uri: 'https://datasalesio-imagens.s3.amazonaws.com/playvideo_videomatik.png?gWQDSR',
            }}
            resizeMethod='resize'
            resizeMode='contain'
            customOverlayContent={selected ? RenderCheckbox() : RenderButtonPlayer()}
          />
        )}

        {withMoreButton && (
          <TouchableOpacity
            hitSlop={{
              top: 10,
              left: 10,
              bottom: 10,
              right: 10,
            }}
            style={styles.moreButton}
            onPress={() => withMoreButton && onMorePress && onMorePress()}>
            <Feather name='more-horizontal' size={16} color={Colors.grey20} />
          </TouchableOpacity>
        )}
      </View>
      {name && (
        <Text marginL-s1 flex text60M numberOfLines={1} {...nameProps}>
          {name.length < 20 ? name : `${name.substring(0, 20).slice(0, -3)}...`}
        </Text>
      )}
    </TouchableOpacity>
  );
}
