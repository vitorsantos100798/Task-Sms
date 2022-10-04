import React from 'react';
import { ScrollView } from 'react-native';
import { Colors, LoaderScreen, Spacings, View } from 'react-native-ui-lib';
import { useQuery } from 'react-query';

import { CountCard } from '../../../components/Home/CountCard';
import { MetricCard } from '../../../components/Home/MetricCard';
import { Section } from '../../../components/Section';
import {
  countEngagementsService,
  countImpressionsService,
  countLikesService,
  countViewsService,
  getCommentOverviewService,
  getImpressionOverviewService,
  getLikeOverviewService,
  getViewOverviewService,
} from '../../../services/metrics';

export function Overview() {
  const { data: impressions } = useQuery('impressions', countImpressionsService);
  const { data: views } = useQuery('views', countViewsService);
  const { data: likes } = useQuery('likes', countLikesService);
  const { data: engagements } = useQuery('engagements', countEngagementsService);

  const { data: impressionOverview } = useQuery('impressionOverview', getImpressionOverviewService);

  const { data: commentOverview } = useQuery('commentOverview', getCommentOverviewService);

  const { data: likeOverview } = useQuery('likeOverview', getImpressionOverviewService);

  const { data: engagementOverview } = useQuery('engagementOverview', getLikeOverviewService);

  const { data: viewOverview } = useQuery('viewOverview', getViewOverviewService);

  if (
    !impressions ||
    !views ||
    !likes ||
    !engagements ||
    !impressionOverview ||
    !commentOverview ||
    !likeOverview ||
    !engagementOverview ||
    !viewOverview
  ) {
    return (
      <View flex center>
        <LoaderScreen color={Colors.primary} message='Carregando...' overlay />
      </View>
    );
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        padding: Spacings.s4,
      }}>
      <View row spread marginB-s4>
        <CountCard title='Contas alcançadas' icon='users' iconColor={Colors.blue30} count={impressions} marginR-s4 />
        <CountCard title='Curtidas' icon='heart' iconColor={Colors.red30} count={likes} />
      </View>
      <View row spread marginB-s4>
        <CountCard title='Visualizações' icon='eye' iconColor={Colors.purple30} count={views} marginR-s4 />
        <CountCard title='Engajamento' icon='bar-chart' iconColor={Colors.cyan30} count={engagements} />
      </View>
      <Section title='Métricas Gerais'>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <MetricCard
            title='Comentários'
            subtitle='Quantas pessoas seguem sua página'
            data={commentOverview}
            width='80%'
            marginR-s4
          />
          <MetricCard
            title='Curtidas'
            subtitle='Quantas curtidas suas publicações tiveram'
            data={likeOverview}
            width='80%'
            marginR-s4
          />
          <MetricCard
            title='Contas alcançadas'
            subtitle='Quantas vezes sua publicação apareceu para alguém'
            data={likeOverview}
            width='80%'
            marginR-s4
          />
          <MetricCard
            title='Engajamento'
            subtitle='Quantas pessoas clicaram nas suas propagandas impulsionadas'
            data={engagementOverview}
            width='80%'
            marginR-s4
          />
          <MetricCard
            title='Visualizações'
            subtitle='Quantidade de pessoas que viram suas publicações'
            data={viewOverview}
            width='80%'
            marginR-s4
          />
        </ScrollView>
      </Section>
    </ScrollView>
  );
}
