// import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { FlatList } from 'react-native';
import {
  Avatar,
  Button,
  Colors,
  ListItem,
  LoaderScreen,
  Text,
  TouchableOpacity,
  Typography,
  View,
} from 'react-native-ui-lib';
import Feather from 'react-native-vector-icons/Feather';
import { useMutation, useQuery } from 'react-query';

import { useDialog } from '../../hooks/useDialog';
import { useToast } from '../../hooks/useToast';
import { queryClient } from '../../services/queryClient';
import { listStoreService, removeStoreById } from '../../services/stores';
import { AppScreenProp } from '../../types/navigation';
import { Store } from '../../types/store';
import getInitials from '../../utils/getInitials';
import styles from './styles';

export function StoreList() {
  const { navigate } = useNavigation<AppScreenProp>();

  const toast = useToast();

  const dialog = useDialog();

  const stores = useQuery('stores', listStoreService);

  function handleNavigateToNewStore() {
    navigate('NewStore');
  }

  function handleNavigateToEditStore(storeId: number, storeName: string) {
    navigate('EditStore', {
      storeId,
      storeName,
    });
  }

  const removeStore = useMutation(
    async (id: number) => {
      const response = await removeStoreById(id);

      return response;
    },
    {
      onSuccess: () => {
        toast.show('Produto removido!', {
          variant: 'success',
        });
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        queryClient.invalidateQueries('stores');
      },
      onError: () => {
        toast.show('Erro ao remover produto', {
          variant: 'error',
        });
      },
    }
  );

  const handleRemoveStore = useCallback(
    async (id: number) => {
      dialog.showAlert({
        title: 'Remover produto?',
        description: 'Tem certeza que deseja remover essa loja?',
        confirmationText: 'Remover',
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onConfirmation: () => removeStore.mutateAsync(id),
        confirmationButtonProps: {
          color: Colors.red40,
        },
      });
    },
    [dialog, removeStore]
  );

  function renderRow(store: Store) {
    return (
      <View>
        <ListItem
          height={77.5}
          onPress={() => {
            handleNavigateToEditStore(store.id, store.name);
          }}>
          <ListItem.Part left marginH-14>
            <Avatar
              label={!store.logo_url ? getInitials(store.name) : undefined}
              source={store.logo_url ? { uri: store.logo_url } : undefined}
              size={54}
            />
          </ListItem.Part>
          <ListItem.Part middle column>
            <ListItem.Part containerStyle={{ marginBottom: 3 }}>
              <Text grey10 text70 style={{ flex: 1, marginRight: 10 }} numberOfLines={1}>
                {store.name}
              </Text>
              <TouchableOpacity
                paddingH-s4
                onPress={() => {
                  // eslint-disable-next-line @typescript-eslint/no-floating-promises
                  handleRemoveStore(store.id);
                }}>
                <Feather name='trash' size={Typography.text50?.fontSize} color={Colors.grey20} />
              </TouchableOpacity>
            </ListItem.Part>
            <ListItem.Part>
              <Text style={{ flex: 1, marginRight: 10 }} text90 grey40 numberOfLines={1}>
                {store.address}
              </Text>
            </ListItem.Part>
          </ListItem.Part>
        </ListItem>
      </View>
    );
  }

  if (stores.isLoading) {
    return (
      <View flex center>
        <LoaderScreen color={Colors.primary} message='Carregando...' overlay />
      </View>
    );
  }

  return (
    <>
      <View flex>
        <FlatList<Store>
          data={stores.data}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => renderRow(item)}
          keyExtractor={item => item.id.toString()}
        />
      </View>
      <Button label='Adicionar loja' text60BO style={styles.newStoreButton} onPress={handleNavigateToNewStore} />
    </>
  );
}
