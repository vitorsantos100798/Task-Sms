import React from 'react';
import {
  Colors,
  Image,
  MarginModifiers,
  PaddingModifiers,
  Text,
  TextProps,
  TouchableOpacity,
  View,
  Checkbox,
} from 'react-native-ui-lib';
import Feather from 'react-native-vector-icons/Feather';
import { SharedElement } from 'react-navigation-shared-element';

import styles from './styles';

type ArtCardProps = MarginModifiers &
  PaddingModifiers & {
    name?: string;
    imageURL: string;
    thumbnailURL?: string;
    height?: number | string;
    width?: number | string;
    withMoreButton?: boolean;
    sharedElementId?: string;
    isSelectable?: boolean;
    selected?: boolean;
    onPress?: () => void;
    onMorePress?: () => void;
    nameProps?: TextProps;
  };

export function ArtCard({
  name,
  imageURL,
  thumbnailURL,
  height,
  width,
  margin,
  withMoreButton,
  sharedElementId,
  onPress,
  onMorePress,
  nameProps = {
    text80M: true,
    numberOfLines: 2,
  },
  isSelectable = false,
  selected,
  ...rest
}: ArtCardProps) {
  function RenderCheckbox() {
    return (
      <View flex padding-s2 style={styles.imageSelected}>
        <Checkbox onValueChange={onPress} color={Colors.primary} borderRadius={2} value />
      </View>
    );
  }

  return (
    <TouchableOpacity flex centerV activeBackgroundColor={Colors.white} margin-s2={margin} onPress={onPress} {...rest}>
      <View
        flex
        backgroundColor={Colors.grey60}
        style={[isSelectable ? styles.imageContainerWithoutPadding : styles.imageContainer, { width }]}>
        {sharedElementId ? (
          <SharedElement
            id={sharedElementId}
            style={{
              flex: 1,
            }}>
            <Image
              style={[styles.image, { height, width }]}
              source={{
                uri: thumbnailURL || imageURL,
              }}
              resizeMethod='resize'
              resizeMode='cover'
            />
          </SharedElement>
        ) : (
          <Image
            style={[styles.image, { height }]}
            source={{
              uri: thumbnailURL || imageURL,
            }}
            resizeMethod='resize'
            resizeMode='cover'
            customOverlayContent={isSelectable && selected ? <RenderCheckbox /> : undefined}
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
        <Text marginT-s3 {...nameProps}>
          {name}
        </Text>
      )}
    </TouchableOpacity>
  );
}
