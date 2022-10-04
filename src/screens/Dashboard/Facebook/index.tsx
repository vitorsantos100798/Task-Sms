import { useNavigation } from '@react-navigation/native';

import React, { useMemo } from 'react';
import { ScrollView } from 'react-native';
import { Colors, LoaderScreen, Spacings, View } from 'react-native-ui-lib';
import { useQuery } from 'react-query';

import { ArtCard } from '../../../components/ArtCard';
import { CountCard } from '../../../components/Home/CountCard';
import { MetricCard } from '../../../components/Home/MetricCard';
import { Section } from '../../../components/Section';
import {
  getFacebookCommentMetricService,
  getFacebookEngagementMetricService,
  getFacebookLikeMetricService,
  getFacebookPaidViewMetricService,
  getFacebookUniqueViewMetricService,
  getFacebookViewMetricService,
} from '../../../services/facebookMetrics';
import { listFacebookPostService } from '../../../services/facebookPosts';
import { AppScreenProp } from '../../../types/navigation';
import { widthPercentageToDP } from '../../../utils/dimensions';

export function Facebook() {
  const { navigate } = useNavigation<AppScreenProp>();

  const { data: facebookComments } = useQuery('facebookComments', getFacebookCommentMetricService);

  const { data: facebookLikes } = useQuery('facebookLikes', getFacebookLikeMetricService);

  const { data: facebookEngagements } = useQuery('facebookEngagements', getFacebookEngagementMetricService);

  const { data: facebookUniqueViews } = useQuery('facebookUniqueViews', getFacebookUniqueViewMetricService);

  const { data: facebookViews } = useQuery('facebookViews', getFacebookViewMetricService);

  const { data: facebookPaidViews } = useQuery('facebookPaidViews', getFacebookPaidViewMetricService);

  const { data: posts } = useQuery('facebookPosts', () => listFacebookPostService({}));

  const countViews = useMemo(() => {
    return facebookViews?.reduce((acc, curr) => acc + curr.value, 0);
  }, [facebookViews]);

  const countUniqueViews = useMemo(() => {
    return facebookUniqueViews?.reduce((acc, curr) => acc + curr.value, 0);
  }, [facebookUniqueViews]);

  const countLikes = useMemo(() => {
    return facebookLikes?.reduce((acc, curr) => acc + curr.value, 0);
  }, [facebookLikes]);

  const countEngagements = useMemo(() => {
    return facebookEngagements?.reduce((acc, curr) => acc + curr.value, 0);
  }, [facebookEngagements]);

  if (
    !countEngagements ||
    !countUniqueViews ||
    !countLikes ||
    !countViews ||
    !facebookComments ||
    !facebookLikes ||
    !facebookEngagements ||
    !facebookUniqueViews ||
    !facebookViews ||
    !facebookPaidViews
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
        <CountCard title='Contas alcançadas' icon='users' iconColor={Colors.blue30} count={countViews} marginR-s4 />
        <CountCard title='Curtidas' icon='heart' iconColor={Colors.red30} count={countLikes} />
      </View>
      <View row spread marginB-s4>
        <CountCard title='Visualizações' icon='eye' iconColor={Colors.purple30} count={countUniqueViews} marginR-s4 />
        <CountCard title='Engajamento' icon='bar-chart' iconColor={Colors.cyan30} count={countEngagements} />
      </View>
      <Section title='Métricas Gerais'>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingVertical: Spacings.s4,
          }}>
          <MetricCard
            title='Comentários'
            subtitle='Quantas pessoas seguem sua página'
            data={facebookComments}
            width='80%'
            marginR-s4
          />
          <MetricCard
            title='Curtidas'
            subtitle='Quantas curtidas suas publicações tiveram'
            data={facebookLikes}
            width='80%'
            marginR-s4
          />

          <MetricCard
            title='Contas alcançadas'
            subtitle='Quantas vezes sua publicação apareceu para alguém'
            data={facebookViews}
            width='80%'
            marginR-s4
          />

          <MetricCard
            title='Visualizações de impulsionamentos'
            subtitle='A média de vezes que seu anúncio foi visualizado por uma mesma pessoa'
            data={facebookPaidViews}
            width='80%'
            marginR-s4
          />

          <MetricCard
            title='Engajamento'
            subtitle='Quantas pessoas clicaram nas suas propagandas impulsionadas'
            data={facebookEngagements}
            width='80%'
            marginR-s4
          />

          <MetricCard
            title='Visualizações'
            subtitle='Quantidade de pessoas que viram suas publicações'
            data={facebookUniqueViews}
            width='80%'
            marginR-s4
          />
        </ScrollView>
      </Section>
      <Section
        title='Posts no facebook'
        onRightButtonPress={() => {
          navigate('FacebookPostList');
        }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingVertical: Spacings.s4,
          }}>
          {posts?.map((post, index) => (
            <ArtCard
              key={`dashboard-facebook-${post.id}`}
              name={post.name}
              imageURL={post.imageURL}
              paddingR-s4={index !== posts.length - 1}
              height={300}
              width={widthPercentageToDP('49%')}
            />
          ))}
        </ScrollView>
      </Section>
    </ScrollView>
  );
}
