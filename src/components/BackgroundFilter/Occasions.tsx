import React from 'react';
import { ScrollView } from 'react-native';
import { Chip, Colors, Spacings, Text, View } from 'react-native-ui-lib';

import { Occasion } from '../../types/occasion';
import { heightPercentageToDP } from '../../utils/dimensions';

type OccasionsProps = {
  occasions: Occasion[];
  selectedOccasionId?: number;
  onChange: (value: Occasion) => void;
};

export function Occasions({ occasions, selectedOccasionId, onChange }: OccasionsProps) {
  return (
    <ScrollView
      contentContainerStyle={{
        marginTop: -50,
        paddingTop: 50,
        paddingHorizontal: Spacings.s4,
        paddingBottom: 16,
      }}>
      <Text text60M marginB-10>
        Ocasiões
      </Text>
      <View row style={{ flexWrap: 'wrap' }}>
        {occasions
          .filter(o => o.name !== '')
          .map(occasion => {
            const isSelected = occasion.id === selectedOccasionId;

            return (
              <Chip
                key={occasion.id}
                label={occasion.name}
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
                  onChange(occasion);
                }}
              />
            );
          })}
      </View>
    </ScrollView>
  );
}
