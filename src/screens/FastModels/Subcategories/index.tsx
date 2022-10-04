import { isEmpty } from 'lodash';
import React, { useCallback } from 'react';
import { FlatList, ScrollView } from 'react-native';
import { Colors, LoaderScreen, Spacings, Text, View } from 'react-native-ui-lib';

import { ArtCard } from '../../../components/ArtCard';
import { Subcategory, SubcategoryBackgrounds } from '../../../types/fastModels';

type SubcategoriesProps = {
  subcategories: Subcategory[];
  subcategoriesSelected: number[];
  loading?: boolean;
  onChange: (seletected: boolean, subcategory: SubcategoryBackgrounds) => void;
};

export function Subcategories({ subcategoriesSelected, subcategories, loading, onChange }: SubcategoriesProps) {
  function renderItem(item: SubcategoryBackgrounds) {
    const selected = subcategoriesSelected.some(i => i === item.id);
    return (
      <ArtCard
        margin
        height={100}
        imageURL={item.imageURL as string}
        thumbnailURL={item.imageURL}
        isSelectable
        selected={selected}
        width={100}
        onPress={() => {
          onChange(selected, item);
        }}
      />
    );
  }

  const RenderEmpty = useCallback(() => {
    return (
      <View flex center>
        <Text text70BO color={Colors.grey20}>
          Nenhuma subcategoria encontrada.
        </Text>
      </View>
    );
  }, []);

  if (loading) {
    return (
      <View flex center>
        <LoaderScreen color={Colors.primary} message='Carregando...' overlay />
      </View>
    );
  }

  if (isEmpty(subcategories)) {
    return RenderEmpty();
  }

  return (
    <ScrollView style={{ paddingBottom: Spacings.s4 }} showsVerticalScrollIndicator={false}>
      {subcategories?.map(subcategory => (
        <View key={subcategory.ID.toString()}>
          <View paddingH-s2 paddingT-s3>
            <Text text70>{subcategory.DESCRIPTION}</Text>
          </View>

          <FlatList<SubcategoryBackgrounds>
            horizontal
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            data={subcategory.backgrounds}
            keyExtractor={item => item.id?.toString() as string}
            renderItem={({ item }) => renderItem(item)}
          />
        </View>
      ))}
    </ScrollView>
  );
}
