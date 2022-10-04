import { RouteProp, useNavigation, useNavigationState, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { FlatList, RefreshControl } from 'react-native';
import { Colors, Image, Incubator, TouchableOpacity, Typography, View } from 'react-native-ui-lib';
import Feather from 'react-native-vector-icons/Feather';
import { useQuery } from 'react-query';

import api from '../../services/api';
import { AppScreenProp, AppStackParamList } from '../../types/navigation';
import { getPreviousRouteFromState } from '../../utils/getPreviousRouteFromState';
import styles from './styles';

const { TextField } = Incubator;

export function SearchProductImage() {
  const {
    params: { productName },
  } = useRoute<RouteProp<AppStackParamList, 'SearchProductImage'>>();

  const { goBack, navigate } = useNavigation<AppScreenProp>();

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  const previousRoute = useNavigationState(s => getPreviousRouteFromState(s));

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (productName && productName !== '') {
      setSearchTerm(productName);
    }
  }, [productName]);

  function handleClear() {
    setSearchTerm('');
  }

  const images = useQuery(
    ['productSuggestions', searchTerm],
    async () => {
      const response = await api.get('/lista-ofertas-p1-prd/getSerpApi', {
        params: {
          query: searchTerm,
        },
      });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return response.data.images_results;
    },
    { enabled: searchTerm.length > 0 }
  );

  function handleSelect(imageURL: string) {
    navigate(previousRoute.name, {
      productImageUrl: imageURL,
    });
  }

  function renderRow(item: { thumbnail: string }) {
    return (
      <TouchableOpacity
        flex
        centerV
        margin-s2
        backgroundColor={Colors.grey60}
        padding-s3
        style={styles.listItem}
        onPress={() => {
          handleSelect(item.thumbnail);
        }}>
        <Image
          style={styles.listItemImage}
          resizeMethod='resize'
          resizeMode='contain'
          source={{
            uri: item.thumbnail,
          }}
        />
      </TouchableOpacity>
    );
  }

  return (
    <View flex useSafeArea>
      <View paddingH-page paddingT-page>
        <TextField
          migrate
          autoFocus={!productName}
          placeholder='Buscar imagem'
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
        data={images.data}
        renderItem={({ item }) => renderRow(item)}
        showsVerticalScrollIndicator={false}
        numColumns={3}
        contentContainerStyle={styles.content}
        refreshing={images.isFetching}
        refreshControl={<RefreshControl refreshing={images.isFetching} tintColor={Colors.secondary} />}
      />
    </View>
  );
}
