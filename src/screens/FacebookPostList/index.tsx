import React, { useCallback } from 'react';
import { FlatList } from 'react-native';
import { Colors, LoaderScreen, Spacings, View } from 'react-native-ui-lib';
import { useQuery } from 'react-query';

import { ArtCard } from '../../components/ArtCard';
import { listFacebookPostService } from '../../services/facebookPosts';

export function FacebookPostList() {
  const { data: posts } = useQuery('facebookPosts', () => listFacebookPostService({ limit: 100 }));

  const renderItem = useCallback((post: any) => {
    return (
      <ArtCard
        key={`dashboard-facebook-${post.id}`}
        name={post.name}
        imageURL={post.imageURL}
        marginH-s1
        marginB-s4
        height={300}
      />
    );
  }, []);

  if (!posts) {
    return (
      <View flex center>
        <LoaderScreen color={Colors.primary} message='Carregando...' overlay />
      </View>
    );
  }

  return (
    <FlatList
      keyExtractor={item => String(item.id)}
      data={posts}
      renderItem={({ item }) => renderItem(item)}
      numColumns={2}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: Spacings.s2,
      }}
    />
  );
}
