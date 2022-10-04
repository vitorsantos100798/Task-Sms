import React, { useMemo, useEffect } from 'react';
import { Colors, LoaderScreen, View } from 'react-native-ui-lib';

import { useAuth } from '../hooks/useAuth';
import {
  enabledPushNotification,
  saveTokenToDatabase,
  registerAndGetToken,
  tokenRefresh,
} from '../services/notifications';
import { AuthStackNavigator } from './AuthStackNavigator';
import { RootStackNavigator } from './RootStackNavigator';

export function Routes() {
  const { user, loading } = useAuth();

  const rootStackInitialRouteName = useMemo(() => {
    if (!user) return;

    return user.trialPeriodIsValid || !user.trial ? 'RootBottomTabNavigator' : 'Subscription';
  }, [user]);

  useEffect(() => {
    if (user) {
      (async () => {
        try {
          const enabled = await enabledPushNotification();
          if (enabled) {
            const token = await registerAndGetToken();
            await saveTokenToDatabase(token as string);
          }
        } catch (err) {
          console.log('ERRO => ', err);
        }
      })();

      return tokenRefresh();
    }
  }, [user]);

  if (loading) {
    return (
      <View flex center>
        <LoaderScreen color={Colors.primary} message='Carregando...' overlay />
      </View>
    );
  }

  return user ? <RootStackNavigator initialRouteName={rootStackInitialRouteName} /> : <AuthStackNavigator />;
}
