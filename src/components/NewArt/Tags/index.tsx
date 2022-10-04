import { useFormikContext } from 'formik';
import React, { useCallback } from 'react';
import { ActivityIndicator, FlatList, ScrollView } from 'react-native';
import { Colors, LoaderScreen, Spacings, Text, View } from 'react-native-ui-lib';
import { useQuery } from 'react-query';
import { listTagService } from '../../../services/tags';
import { CreateArtData } from '../../../types/art';
import { Tag } from '../../../types/tag';
import { ArtCard } from '../../ArtCard';
import style from '../style';

type TagProps = {
  onNext: () => void;
};

export function Tags({ onNext }: TagProps) {
  const formik = useFormikContext<CreateArtData>();
  const tags = useQuery('tags', listTagService);

  const handleTagPress = useCallback(
    tag => {
      formik.setFieldValue('tag', tag);
      onNext();
    },
    [formik, onNext]
  );

  function renderRow(tag: Tag) {
    return (
      <ArtCard
        imageURL={tag.imageURL}
        height={80}
        margin
        onPress={() => {
          handleTagPress(tag);
        }}
      />
    );
  }

  return (
    <>
      <View style={style.container}>
        <Text primary text65BL marginV-s2>
          4. Escolha a etiqueta
        </Text>
        <Text text750BL color={Colors.grey20}>
          O preço dos produtos serão adicionados na etiqueta.
        </Text>
      </View>
      {tags.isLoading ? (
        <View flex center>
          <LoaderScreen color={Colors.primary} message='Carregando...' overlay />
        </View>
      ) : (
        <FlatList<Tag>
          keyExtractor={item => item.name}
          showsVerticalScrollIndicator={false}
          data={tags.data}
          numColumns={3}
          renderItem={({ item }) => renderRow(item)}
          onEndReachedThreshold={0.1}
          ListFooterComponent={tags.isLoading ? <ActivityIndicator color={Colors.primary} /> : undefined}
        />
      )}
    </>
  );
}
