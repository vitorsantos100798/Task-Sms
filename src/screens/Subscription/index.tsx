import React from 'react';
import { Linking } from 'react-native';
import { View, Text, Button, Image } from 'react-native-ui-lib';

import { useAuth } from '../../hooks/useAuth';
import styles from './styles';

export function Subscription() {
  const { signOut } = useAuth();

  function handleWhatsAppOpen() {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    Linking.canOpenURL('whatsapp://send?text=oi').then(supported => {
      if (supported) {
        return Linking.openURL('whatsapp://send?phone=5508000000124&text=Oi');
      }
      return Linking.openURL('https://api.whatsapp.com/send?phone=5508000000124&text=Oi');
    });
  }

  return (
    <View flex>
      <Image assetGroup='subscription' assetName='logo' resizeMode='contain' style={styles.banner} />
      <View flex padding-s10>
        <View flex center>
          <Text text60 marginB-s4 style={{ textAlign: 'center' }}>
            Seu período de teste acabou
          </Text>
          <Text text70R grey30 style={{ textAlign: 'center' }}>
            Fale com um de nossos atendentes e saiba mais sobre nossos planos.
          </Text>
        </View>
        <Button label='Saiba mais' marginB-s4 onPress={handleWhatsAppOpen} />
        <Button outline label='Voltar' onPress={signOut} />
      </View>
    </View>
  );
}
