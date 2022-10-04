import React, { useEffect } from 'react';
import { LogBox, StatusBar } from 'react-native';
import codePush from 'react-native-code-push';
import { Host } from 'react-native-portalize';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SplashScreen from 'react-native-splash-screen';
import messaging from '@react-native-firebase/messaging';
import { displayNotification } from './services/notifications';
import { codePushConfig } from './config/codePushConfig';
import { AppProvider } from './contexts';
import { Routes } from './routes';
import { configureDesignSystem } from './theme/designSystem';

LogBox.ignoreAllLogs();

function App() {
  useEffect(() => {
    configureDesignSystem();

    SplashScreen.hide();
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      displayNotification(remoteMessage);
    });

    return unsubscribe;
  }, []);

  return (
    <>
      <AppProvider>
        <Host>
          <StatusBar translucent backgroundColor='transparent' barStyle='dark-content' />
          <SafeAreaProvider>
            <Routes />
          </SafeAreaProvider>
        </Host>
      </AppProvider>
    </>
  );
}

export default codePush(codePushConfig)(App);
