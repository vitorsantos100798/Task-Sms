import React from 'react';
import { ScrollView } from 'react-native';
import { Chip, Colors, Spacings, Text, View } from 'react-native-ui-lib';

import { Segment } from '../../types/segment';
import { heightPercentageToDP } from '../../utils/dimensions';

type SegmentsProps = {
  segments: Segment[];
  selectedSegmentId: number;
  onChange: (value: Segment) => void;
};

export function Segments({ segments, selectedSegmentId, onChange }: SegmentsProps) {
  return (
    <ScrollView
      contentContainerStyle={{
        marginTop: -65,
        paddingTop: 50 + Spacings.s4,
        paddingHorizontal: Spacings.s4,
        paddingBottom: 0,
      }}>
      <Text text60M marginB-10>
        Segmentos
      </Text>
      <View row style={{ flexWrap: 'wrap' }}>
        {segments.map(segment => {
          const isSelected = segment.id === selectedSegmentId;

          return (
            <Chip
              key={segment.id}
              label={segment.name}
              marginB-s2
              marginR-s1
              size={heightPercentageToDP('3.5%')}
              labelStyle={{
                fontWeight: isSelected ? 'bold' : 'normal',
                color: isSelected ? Colors.primary : Colors.grey20,
              }}
              containerStyle={{
                borderColor: isSelected ? 'transparent' : Colors.grey20,
                backgroundColor: isSelected ? '#DBD7EB' : Colors.white,
              }}
              onPress={() => {
                onChange(segment);
              }}
            />
          );
        })}
      </View>
    </ScrollView>
  );
}
