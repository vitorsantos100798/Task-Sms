import React from 'react';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { Carousel, Colors, Image, Spacings, Text, View } from 'react-native-ui-lib';

import { widthPercentageToDP } from '../../../utils/dimensions';
import styles from './styles';

const PAGE_WIDTH = widthPercentageToDP('88%') - Spacings.s2;

const IMAGES = [
  'https://datasalesio-imagens.s3.amazonaws.com/banner1.png',
  'https://datasalesio-imagens.s3.amazonaws.com/banner2.png',
];

export function News() {
  return (
    <View marginB-s4>
      <Text text60M marginH-s2 marginB-s4>
        Novidades
      </Text>
      <Carousel
        itemSpacings={Spacings.s2}
        pageWidth={PAGE_WIDTH}
        containerStyle={{
          height: 220,
        }}
        pageControlPosition={Carousel.pageControlPositions.UNDER}
        pageControlProps={{
          size: RFPercentage(1),
          color: Colors.primary,
        }}>
        {IMAGES.map((image, index) => {
          return (
            <Image
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              source={{ uri: image }}
              resizeMode='stretch'
              style={styles.image}
            />
          );
        })}
      </Carousel>
    </View>
  );
}
