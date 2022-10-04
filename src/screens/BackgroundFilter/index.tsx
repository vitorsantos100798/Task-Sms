import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { isEmpty } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { Button, TabController, View } from 'react-native-ui-lib';
import { useQuery } from 'react-query';

import { Formats } from '../../components/BackgroundFilter/Formats';
import { Occasions } from '../../components/BackgroundFilter/Occasions';
import { Segments } from '../../components/BackgroundFilter/Segments';
import { listFormatService } from '../../services/formats';
import { listOccasionService } from '../../services/occasions';
import { listSegmentService } from '../../services/segments';
import { AppScreenProp, AppStackParamList } from '../../types/navigation';
import styles from './styles';

export type Query = {
  formatId: number;
  segmentId: number;
  occasionId?: number;
};

export function BackgroundFilter() {
  const { params } = useRoute<RouteProp<AppStackParamList, 'BackgroundFilter'>>();

  const { navigate } = useNavigation<AppScreenProp>();

  const [query, setQuery] = useState<Query>({} as Query);
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  useEffect(() => {
    if (params && isEmpty(query)) {
      setQuery({
        formatId: params.formatId,
        segmentId: params.segmentId,
        occasionId: params.occasionId,
      });
    }
  }, [params, query]);

  const formats = useQuery('formats', listFormatService, {
    onSuccess: data => {
      if (!query.formatId) setQuery(prevState => ({ ...prevState, formatId: data[0].id }));
    },
  });

  const segments = useQuery('segments', listSegmentService, {
    onSuccess: data => {
      if (!query.segmentId) setQuery(prevState => ({ ...prevState, segmentId: data[0].id }));
    },
  });

  const occasions = useQuery(
    ['occasions', { formatId: query.formatId, segmentId: query.segmentId }],
    async () => {
      const response = await listOccasionService({
        formatId: query.formatId,
        segmentId: query.segmentId,
      });

      return response;
    },
    {
      enabled: !!query.formatId && !!query.segmentId,
    }
  );

  const handleQueryChange = useCallback((key: keyof Query, value: number) => {
    setQuery(prevState => ({ ...prevState, [key]: value }));
  }, []);

  function handleApply() {
    navigate('NewArt', {
      campaignId: params.campaignId,
      formatId: query.formatId,
      segmentId: query.segmentId,
      occasionId: query.occasionId,
    });
  }

  return (
    <>
      <View flex>
        <TabController
          initialIndex={selectedTabIndex}
          onChangeIndex={setSelectedTabIndex}
          items={[
            {
              label: 'Formatos',
            },
            {
              label: 'Segmentos',
            },
            {
              label: 'Ocasiões',
            },
          ]}>
          <TabController.TabBar />

          <TabController.TabPage index={0}>
            {formats && (
              <Formats
                formats={formats.data || []}
                selectedFormatId={query.formatId}
                onChange={value => {
                  handleQueryChange('formatId', value.id);
                }}
              />
            )}
          </TabController.TabPage>

          <TabController.TabPage index={1}>
            {segments && (
              <Segments
                segments={segments.data || []}
                selectedSegmentId={query.segmentId}
                onChange={value => {
                  handleQueryChange('segmentId', value.id);
                }}
              />
            )}
          </TabController.TabPage>

          <TabController.TabPage index={2}>
            {occasions && (
              <Occasions
                occasions={occasions.data || []}
                selectedOccasionId={query.occasionId}
                onChange={value => {
                  handleQueryChange('occasionId', value.id);
                }}
              />
            )}
          </TabController.TabPage>
        </TabController>
      </View>
      <Button label='Ver Resultados' borderRadius={4} text60M style={styles.applyButton} onPress={handleApply} />
    </>
  );
}
