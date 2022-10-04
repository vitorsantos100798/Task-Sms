import React from 'react';
import { ScrollView } from 'react-native';
import { Chip, Colors, Spacings, Text, View } from 'react-native-ui-lib';

import { Format } from '../../types/format';
import { heightPercentageToDP } from '../../utils/dimensions';

type FormatsProps = {
  formats: Format[];
  selectedFormatId: number;
  onChange: (value: Format) => void;
};

export function Formats({ formats, selectedFormatId, onChange }: FormatsProps) {
  return (
    <ScrollView
      contentContainerStyle={{
        marginTop: -55,
        paddingTop: 50 + Spacings.s4,
        paddingHorizontal: Spacings.s4,
        paddingBottom: 0,
      }}>
      <Text text60M marginB-10>
        Formatos
      </Text>
      <View row style={{ flexWrap: 'wrap' }}>
        {formats.map(format => {
          const isSelected = format.id === selectedFormatId;

          return (
            <Chip
              key={format.id}
              label={format.name}
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
                onChange(format);
              }}
            />
          );
        })}
      </View>
    </ScrollView>
  );
}
