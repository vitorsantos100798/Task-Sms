import * as shape from 'd3-shape';
import React from 'react';
import { Defs, LinearGradient, Stop } from 'react-native-svg';
import { AreaChart, Grid, XAxis, YAxis } from 'react-native-svg-charts';
import { Card, Colors, MarginModifiers, PaddingModifiers, Text, View, Typography } from 'react-native-ui-lib';

import { widthPercentageToDP } from '../../../utils/dimensions';

type MetricCardProps = MarginModifiers &
  PaddingModifiers & {
    title: string;
    subtitle?: string;
    data: { label: string; value: number }[];
    width?: string;
  };

const axesSvg = { fontSize: 10, fill: Colors.grey30, ...Typography.medium };
const verticalContentInset = { top: 20, bottom: 10 };
const xAxisHeight = 30;

const stopColor = Colors.rgba(Colors.secondary, 1);

export function MetricCard({ title, subtitle, data, width = '100%', ...props }: MetricCardProps) {
  return (
    <Card padding-s4 width={widthPercentageToDP(width)} {...props}>
      <View height={70}>
        <Text text80BO marginB-1>
          {title}
        </Text>
        <Text grey30 text90R marginB-s2 numberOfLines={2}>
          {subtitle}
        </Text>
      </View>
      <View height={250} row>
        <YAxis
          data={data}
          yAccessor={({ item }) => item.value}
          style={{ marginBottom: xAxisHeight }}
          contentInset={verticalContentInset}
          svg={axesSvg}
        />
        <View flex marginL-10>
          <AreaChart
            style={{ flex: 1 }}
            data={data}
            curve={shape.curveNatural}
            yAccessor={({ item }) => item.value}
            contentInset={verticalContentInset}
            svg={{ fill: 'url(#gradient)' }}>
            <Defs key='gradient'>
              <LinearGradient id='gradient' x1='0%' y1='0%' x2='0%' y2='100%'>
                <Stop offset='0%' stopColor={stopColor} stopOpacity={1} />
                <Stop offset='100%' stopColor={stopColor} stopOpacity={0.4} />
              </LinearGradient>
            </Defs>
            <Grid />
          </AreaChart>
          <XAxis
            style={{ marginHorizontal: -10, height: xAxisHeight }}
            data={data}
            xAccessor={({ index }) => index}
            formatLabel={(_, index) => data[index].label}
            contentInset={{ left: 10, right: 10 }}
            svg={axesSvg}
          />
        </View>
      </View>
    </Card>
  );
}
