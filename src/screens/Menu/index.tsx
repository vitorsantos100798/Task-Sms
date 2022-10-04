import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useMemo } from 'react';
import { Alert, FlatList, Linking } from 'react-native';
import { ListItem, Text, Typography, View } from 'react-native-ui-lib';
import Feather from 'react-native-vector-icons/Feather';

import { Header } from '../../components/Menu/Header';
import { useAuth } from '../../hooks/useAuth';
import { AppScreenProp } from '../../types/navigation';
import styles from './styles';

export function Menu() {
  const { navigate } = useNavigation<AppScreenProp>();

  const { signOut } = useAuth();

  const handleSignOut = useCallback(() => {
    Alert.alert('Sair', 'Deseja realmente sair?', [
      {
        text: 'Não',
        style: 'cancel',
      },
      {
        text: 'Sim',
        style: 'destructive',
        onPress: signOut,
      },
    ]);
  }, [signOut]);

  const listItens = useMemo(
    () => [
      {
        title: 'Alterar senha',
        icon: 'lock',
        onPress: () => {
          navigate('ChangePassword');
        },
      },
      {
        title: 'Lojas',
        icon: 'shopping-bag',
        onPress: () => {
          navigate('Stores');
        },
      },
      {
        title: 'Dashboard',
        icon: 'bar-chart-2',
        onPress: () => {
          navigate('Dashboard');
        },
      },
      {
        title: 'Suporte',
        icon: 'user',
        onPress: () => {
          Linking.canOpenURL('whatsapp://send?text=oi').then(supported => {
            if (supported) {
              return Linking.openURL(
                'whatsapp://send?phone=551131810653&text=Olá, gostaria de ajuda com o aplicativo Ds Markerting'
              );
            }
            return Linking.openURL(
              'https://wa.me/551131810653?text=Olá, gostaria de ajuda com o aplicativo DS Marketing'
            );
          });
        },
      },
      {
        title: 'Sair',
        icon: 'log-out',
        onPress: handleSignOut,
      },
    ],
    [handleSignOut, navigate]
  );

  function renderRow(row: any) {
    return (
      <ListItem height={60.5} onPress={row.onPress}>
        <ListItem.Part left>
          <Feather name={row.icon} size={Typography.text50?.fontSize} style={styles.listIcon} />
        </ListItem.Part>
        <ListItem.Part middle column>
          <ListItem.Part>
            <Text grey10 text70 numberOfLines={1}>
              {row.title}
            </Text>
          </ListItem.Part>
        </ListItem.Part>
      </ListItem>
    );
  }

  return (
    <FlatList
      keyExtractor={item => item.title}
      data={listItens}
      ListHeaderComponent={<Header />}
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => renderRow(item)}
    />
  );
}
