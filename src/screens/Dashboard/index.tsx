import React, { useState } from 'react';
import { TabController, View } from 'react-native-ui-lib';

import { Facebook } from './Facebook';
import { Overview } from './Overview';

export function Dashboard() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <View flex useSafeArea>
      <TabController
        initialIndex={selectedIndex}
        onChangeIndex={setSelectedIndex}
        items={[
          {
            label: 'Visão geral',
          },
          {
            label: 'Facebook',
          },
        ]}>
        <TabController.TabBar centerSelected indicatorInsets={0} />
        <View flex>
          <TabController.TabPage index={0}>
            <Overview />
          </TabController.TabPage>
          <TabController.TabPage index={1}>
            <Facebook />
          </TabController.TabPage>
        </View>
      </TabController>
    </View>
  );
}
