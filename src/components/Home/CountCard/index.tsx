import React from 'react';
import { Card, Colors, MarginModifiers, PaddingModifiers, Text } from 'react-native-ui-lib';
import Feather from 'react-native-vector-icons/Feather';

type CountCardProps = MarginModifiers &
  PaddingModifiers & {
    title: string;
    count?: number;
    icon: string;
    iconColor?: string;
  };

export function CountCard({ title, count, icon, iconColor = Colors.grey10, ...rest }: CountCardProps) {
  return (
    <Card flex padding-s4 {...rest}>
      <Feather name={icon} size={30} color={iconColor} />
      <Text text80BO marginT-s4 marginB-s1>
        {title}
      </Text>
      <Text>{count}</Text>
    </Card>
  );
}
