import { RouteProp, useRoute } from '@react-navigation/native';
import React, { useMemo, useState } from 'react';
import { Colors, LoaderScreen, View } from 'react-native-ui-lib';
import { WebView } from 'react-native-webview';

import { useAuth } from '../../hooks/useAuth';
import { AppStackParamList } from '../../types/navigation';

export function StudioWeb() {
  const { token } = useAuth();

  const {
    params: { artId, artName, campaignId },
  } = useRoute<RouteProp<AppStackParamList, 'StudioWeb'>>();

  const [isLoading, setIsLoading] = useState(true);

  const uri = useMemo(() => {
    return `https://editor.datasales.info/flyer/${artId}/closed?access_token=${token}&name=${artName}&offer_id=${campaignId}`;
  }, [artId, artName, campaignId, token]);

  return (
    <View flex center={isLoading}>
      {isLoading && <LoaderScreen color={Colors.primary} message='Carregando...' overlay />}
      <WebView
        onLoadEnd={() => {
          setIsLoading(false);
        }}
        source={{
          uri,
        }}
      />
    </View>
  );
}
