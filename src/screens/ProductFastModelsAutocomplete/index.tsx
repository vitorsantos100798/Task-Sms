import { RouteProp, useNavigation, useNavigationState, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { FlatList, RefreshControl } from 'react-native';
import { Colors, Image, Incubator, ListItem, Text, TouchableOpacity, Typography, View } from 'react-native-ui-lib';
import Feather from 'react-native-vector-icons/Feather';
import { useQuery } from 'react-query';

import { listSubcategoryByDescription } from '../../services/fastModels';
import { SubcategoryFilter } from '../../types/fastModels';
import { AppScreenProp, AppStackParamList } from '../../types/navigation';
import { getPreviousRouteFromState } from '../../utils/getPreviousRouteFromState';
import styles from './styles';

const { TextField } = Incubator;

export function ProductFastModelsAutocomplete() {
  const {
    params: { subcategoryDescription, categoryId },
  } = useRoute<RouteProp<AppStackParamList, 'ProductFastModelsAutocomplete'>>();

  const { goBack, navigate } = useNavigation<AppScreenProp>();

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  const previousRoute = useNavigationState(s => getPreviousRouteFromState(s));

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (subcategoryDescription) {
      setSearchTerm(subcategoryDescription);
    }
  }, [subcategoryDescription]);

  function handleClear() {
    setSearchTerm('');
    navigate(previousRoute.name, {
      ...previousRoute.params,
      subcategoryDescription: '',
      subcategoryId: undefined,
    });
  }

  const subcategories = useQuery(['subcategory', searchTerm], () =>
    listSubcategoryByDescription({ description: searchTerm, categoryId })
  );

  function handleSelect({ DESCRIPTION, ID }: SubcategoryFilter) {
    navigate(previousRoute.name, {
      ...previousRoute.params,
      subcategoryDescription: DESCRIPTION,
      subcategoryId: Number(ID),
    });
  }

  function renderRow(item: SubcategoryFilter) {
    return (
      <ListItem
        onPress={() => {
          handleSelect(item);
        }}>
        <ListItem.Part left marginH-14>
          <ListItem.Part containerStyle={{ marginBottom: 3 }}>
            <Text grey10 text70 flex numberOfLines={1}>
              {item.DESCRIPTION}
            </Text>
          </ListItem.Part>
        </ListItem.Part>
      </ListItem>
    );
  }

  function renderEmpty() {
    if (!subcategories.isFetching) {
      return (
        <View flex center>
          <Text grey10 text70 flex>
            Sem resultados para "{searchTerm}", tente outro produto!
          </Text>
        </View>
      );
    }

    return <></>;
  }

  return (
    <View flex useSafeArea>
      <View paddingH-page paddingT-page>
        <TextField
          migrate
          autoFocus={!subcategoryDescription}
          placeholder='Buscar produto'
          autoComplete='off'
          autoCorrect={false}
          value={searchTerm}
          onChangeText={setSearchTerm}
          fieldStyle={styles.searchBar}
          leadingAccessory={
            <TouchableOpacity marginR-s4 activeBackgroundColor={Colors.grey70} onPress={goBack}>
              <Feather name='arrow-left' size={Typography.text50?.fontSize} color={Colors.primary} />
            </TouchableOpacity>
          }
          trailingAccessory={
            searchTerm.length > 0 ? (
              <TouchableOpacity activeBackgroundColor={Colors.grey70} onPress={handleClear}>
                <Feather name='x-circle' size={Typography.text60?.fontSize} color={Colors.grey20} />
              </TouchableOpacity>
            ) : undefined
          }
        />
      </View>
      <FlatList
        keyExtractor={item => `${item.ID}`}
        data={subcategories.data}
        renderItem={({ item }) => renderRow(item)}
        showsVerticalScrollIndicator={false}
        refreshing={subcategories.isFetching}
        ListEmptyComponent={renderEmpty}
        refreshControl={<RefreshControl refreshing={subcategories.isFetching} tintColor={Colors.secondary} />}
      />
    </View>
  );
}
