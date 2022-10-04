import React from 'react';
import { Colors, Text, View, Image, TouchableOpacity, TouchableOpacityProps } from 'react-native-ui-lib';
import { SharedElement } from 'react-navigation-shared-element';
import { widthPercentageToDP } from '../../utils/dimensions';
import styles from './styles';

type CategoryItemProps = TouchableOpacityProps & {
  name?: string;
  thumbnailURL?: string;
  height?: number | string;
  width?: number | string;
  sharedElementId?: string;
  selected?: boolean;
  onPress?: () => void;
};

export function CategoryItem({
  name,
  margin,
  width,
  sharedElementId,
  thumbnailURL,
  height,
  selected,
  onPress,
  ...rest
}: CategoryItemProps) {
  return (
    <TouchableOpacity
      activeBackgroundColor='transparent'
      style={{ marginHorizontal: widthPercentageToDP('3%') }}
      center
      onPress={onPress}
      {...rest}>
      <View backgroundColor={Colors.white} style={[styles.imageContainer, { opacity: selected ? 1 : 0.65 }]} marginB-s3>
        {sharedElementId ? (
          <SharedElement
            id={sharedElementId}
            style={{
              flex: 1,
            }}>
            <Image resizeMode='cover' resizeMethod='scale' style={styles.image} source={{ uri: thumbnailURL }} />
          </SharedElement>
        ) : (
          <Image
            resizeMode='cover'
            resizeMethod='auto'
            style={styles.image}
            source={{
              uri: thumbnailURL,
            }}
          />
        )}
      </View>

      {name && (
        <Text color={selected ? Colors.primary : Colors.grey30} text80BL numberOfLines={2} center>
          {name}
        </Text>
      )}
    </TouchableOpacity>
  );
}
