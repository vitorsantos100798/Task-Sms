import { RouteProp, useNavigation, useNavigationState, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { FlatList, RefreshControl } from 'react-native';
import { Colors, Image, Incubator, ListItem, Text, TouchableOpacity, Typography, View } from 'react-native-ui-lib';
import Feather from 'react-native-vector-icons/Feather';
import { useQuery } from 'react-query';

import { listProductByNameService } from '../../services/products';
import { AppScreenProp, AppStackParamList } from '../../types/navigation';
import { Product } from '../../types/product';
import { getPreviousRouteFromState } from '../../utils/getPreviousRouteFromState';
import styles from './styles';

const { TextField } = Incubator;

export function ProductAutocomplete() {
  const {
    params: { productName },
  } = useRoute<RouteProp<AppStackParamList, 'ProductAutocomplete'>>();

  const { goBack, navigate } = useNavigation<AppScreenProp>();

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-return
  const previousRoute = useNavigationState(s => getPreviousRouteFromState(s));

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (productName) {
      setSearchTerm(productName);
    }
  }, [productName]);

  function handleClear() {
    setSearchTerm('');
  }

  const products = useQuery(['productSuggestions', searchTerm], () => listProductByNameService(searchTerm), {
    enabled: searchTerm.length > 0,
  });

  function handleSelect({ name, price, image_url }: Omit<Product, 'id' | 'list_id'>) {
    navigate(previousRoute.name, {
      productName: name,
      productPrice: price,
      productImageUrl: image_url,
    });
  }

  function renderRow(item: Omit<Product, 'id' | 'list_id'>) {
    return (
      <ListItem
        height={77.5}
        onPress={() => {
          handleSelect(item);
        }}>
        <ListItem.Part left marginH-14>
          <Image source={{ uri: item.image_url }} style={styles.listItemImage} resizeMode='contain' />
        </ListItem.Part>
        <ListItem.Part middle column>
          <ListItem.Part containerStyle={{ marginBottom: 3 }}>
            <Text grey10 text70 flex numberOfLines={1}>
              {item.name}
            </Text>
          </ListItem.Part>
          <ListItem.Part>
            <Text text90 grey30 numberOfLines={1}>
              {item.formatted_price}
            </Text>
          </ListItem.Part>
        </ListItem.Part>
      </ListItem>
    );
  }

  return (
    <View flex useSafeArea>
      <View paddingH-page paddingT-page>
        <TextField
          migrate
          autoFocus={!productName}
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
        keyExtractor={item => `${item.name}.${item.price}`}
        data={products.data}
        renderItem={({ item }) => renderRow(item)}
        showsVerticalScrollIndicator={false}
        refreshing={products.isFetching}
        refreshControl={<RefreshControl refreshing={products.isFetching} tintColor={Colors.secondary} />}
      />
    </View>
  );
}
