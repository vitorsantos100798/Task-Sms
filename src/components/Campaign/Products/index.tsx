import { useNavigation } from '@react-navigation/native';
import { isEmpty } from 'lodash';
import React, { useCallback } from 'react';
import { RefreshControl } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import {
  Button,
  Colors,
  Image,
  ListItem,
  LoaderScreen,
  Text,
  TouchableOpacity,
  Typography,
  View,
} from 'react-native-ui-lib';
import Feather from 'react-native-vector-icons/Feather';
import { useMutation, useQuery } from 'react-query';

import { useDialog } from '../../../hooks/useDialog';
import { useToast } from '../../../hooks/useToast';
import { listProductByCampaignIdService, removeProductById } from '../../../services/products';
import { queryClient } from '../../../services/queryClient';
import { AppScreenProp } from '../../../types/navigation';
import { Product } from '../../../types/product';
import styles from './styles';

type ProductsProps = {
  campaignId: number;
};

export function Products({ campaignId }: ProductsProps) {
  const { navigate } = useNavigation<AppScreenProp>();

  const toast = useToast();

  const dialog = useDialog();

  const { isLoading, isFetching, data } = useQuery(['products', campaignId], () =>
    listProductByCampaignIdService(campaignId)
  );

  function handleNavigateToNewProduct() {
    navigate('NewProduct', {
      campaignId,
    });
  }

  function handleNavigateToEditProduct(id: number) {
    navigate('EditProduct', {
      productId: id,
    });
  }

  const removeProduct = useMutation(
    async (id: number) => {
      const response = await removeProductById(id);

      return response;
    },
    {
      onSuccess: () => {
        toast.show('Produto removido!', {
          variant: 'success',
        });
        queryClient.invalidateQueries(['products', campaignId]);
      },
      onError: () => {
        toast.show('Erro ao remover produto', {
          variant: 'error',
        });
      },
    }
  );

  const handleRemoveProduct = useCallback(
    async (id: number) => {
      dialog.showAlert({
        title: 'Remover produto?',
        description: 'Tem certeza que deseja remover este produto?',
        confirmationText: 'Remover',
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onConfirmation: () => removeProduct.mutateAsync(id),
        confirmationButtonProps: {
          color: Colors.red40,
        },
      });
    },
    [dialog, removeProduct]
  );

  function renderRow(product: Product) {
    return (
      <ListItem
        height={77.5}
        onPress={() => {
          handleNavigateToEditProduct(product.id);
        }}>
        <ListItem.Part left marginH-14>
          <Image source={{ uri: product.image_url }} style={styles.listItemImage} resizeMode='contain' />
        </ListItem.Part>
        <ListItem.Part middle column>
          <ListItem.Part containerStyle={{ marginBottom: 3 }}>
            <Text grey10 text70 flex numberOfLines={1}>
              {product.name}
            </Text>
            <TouchableOpacity
              paddingH-s4
              onPress={() => {
                handleRemoveProduct(product.id);
              }}>
              <Feather name='trash' size={Typography.text50?.fontSize} color={Colors.grey20} />
            </TouchableOpacity>
          </ListItem.Part>
          <ListItem.Part>
            <Text text90 grey30 numberOfLines={1}>
              {product.formatted_price}
            </Text>
          </ListItem.Part>
        </ListItem.Part>
      </ListItem>
    );
  }

  return (
    <>
      {isLoading || removeProduct.isLoading ? (
        <View flex center>
          <LoaderScreen color={Colors.primary} message='Loading...' overlay />
        </View>
      ) : !isLoading && isEmpty(data) ? (
        <View flex center>
          <Text text70M style={{ textAlign: 'center' }}>
            Agora é só clicar no botão abaixo para adicionar um produto!
          </Text>
        </View>
      ) : (
        <View flex useSafeArea>
          <FlatList<Product>
            data={data}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => renderRow(item)}
            keyExtractor={item => item.name}
            refreshing={isFetching}
            refreshControl={<RefreshControl refreshing={isFetching} tintColor={Colors.secondary} />}
          />
        </View>
      )}

      <Button
        label='Adicionar mais produtos'
        text60BO
        style={styles.newProductButton}
        onPress={handleNavigateToNewProduct}
      />
    </>
  );
}
