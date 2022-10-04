import { useNavigation } from '@react-navigation/native';
import { isEmpty } from 'lodash';
import React, { useCallback, useEffect } from 'react';
import { FlatList } from 'react-native';
import { Colors, TouchableOpacity, Text, View, Typography } from 'react-native-ui-lib';
import Feather from 'react-native-vector-icons/Feather';

import { CategoryItem } from '../../../components/CategoryItem';
import { Category } from '../../../types/fastModels';
import { AppScreenProp } from '../../../types/navigation';
import styles from './styles';

type CategoriesProps = {
  subcategoryDescription?: string;
  category?: Category;
  categories: Category[];
  onChange: (category: Category) => void;
  setdescription: (string: string) => void;
  setSubcategoryID: (string: number | undefined) => void;
};

export function Categories({
  subcategoryDescription,
  category,
  categories,
  onChange,
  setdescription,
  setSubcategoryID,
}: CategoriesProps) {
  const { navigate } = useNavigation<AppScreenProp>();

  const handleChangeCategory = useCallback((category: Category) => {
    onChange(category);
    setdescription('');
    setSubcategoryID(0);
  }, []);

  const RenderEmpty = useCallback(() => {
    return (
      <View paddingT-s10 paddingB-s2 center>
        <Text text70BO color={Colors.grey20}>
          Nenhuma categoria encontrada.
        </Text>
      </View>
    );
  }, []);

  if (isEmpty(categories)) {
    return RenderEmpty();
  }

  return (
    <View paddingT-s10 paddingB-s2 backgroundColor={category?.BACKGROUND_COLOR_HEX}>
      <FlatList<Category>
        horizontal
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        data={categories}
        keyExtractor={item => item.ID.toString()}
        renderItem={({ item }) => (
          <CategoryItem
            selected={category?.ID === item.ID}
            name={item.DESCRIPTION}
            thumbnailURL={item.URL_IMAGE_SHORTCUT}
            onPress={() => handleChangeCategory(item)}
          />
        )}
      />
      <TouchableOpacity
        activeBackgroundColor='transparent'
        marginH-s2
        marginT-s8
        style={[styles.picker, styles.textFieldSearch]}
        onPress={() => {
          navigate('ProductFastModelsAutocomplete', {
            subcategoryDescription,
            categoryId: Number(category?.ID),
          });
        }}>
        <Feather
          name='search'
          color={Colors.grey40}
          size={Typography.text60?.fontSize}
          style={styles.leadingAccessory}
        />

        <Text color={subcategoryDescription ? Colors.grey10 : Colors.grey40}>
          {subcategoryDescription || 'Pesquisa pelo nome do produto'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
