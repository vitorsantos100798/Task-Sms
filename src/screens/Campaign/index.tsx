import { RouteProp, useRoute } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { TabController, View } from 'react-native-ui-lib';

import { Arts } from '../../components/Campaign/Arts';
import { Products } from '../../components/Campaign/Products';
import { SelectNameTypeDialog } from '../../components/SelectEditNameTypeDialog';
import { AppStackParamList } from '../../types/navigation';

export function Campaign() {
  const {
    params: { campaignId, activeTabIndex, campaignName, editWasClicked },
  } = useRoute<RouteProp<AppStackParamList, 'Campaign'>>();

  const [selectedIndex, setSelectedIndex] = useState(activeTabIndex || 0);
  const [createCampaignModalIsOpen, setCreateCampaignModalIsOpen] = useState(false);

  function handleNavigateToModalNameClose() {
    setCreateCampaignModalIsOpen(false);
  }

  function handleNavigateToModalName() {
    setCreateCampaignModalIsOpen(true);
  }

  useEffect(() => {
    if (editWasClicked) {
      handleNavigateToModalName();
    }
  }, [editWasClicked]);

  return (
    <View flex useSafeArea paddingV-page>
      <TabController
        initialIndex={selectedIndex}
        onChangeIndex={setSelectedIndex}
        items={[
          {
            label: 'Artes',
          },
          {
            label: 'Produtos',
          },
        ]}>
        <TabController.TabBar indicatorInsets={0} />
        <View flex>
          <TabController.TabPage index={0}>
            <Arts campaignName={campaignName} campaignId={campaignId} />
          </TabController.TabPage>
          <TabController.TabPage index={1}>
            <Products campaignId={campaignId} />
          </TabController.TabPage>
        </View>
      </TabController>

      <SelectNameTypeDialog visible={createCampaignModalIsOpen} onRequestClose={handleNavigateToModalNameClose} />
    </View>
  );
}
