import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { Theme } from 'react-native-paper/lib/typescript/types';
import Feather from 'react-native-vector-icons/Feather';
import { QueryClient, QueryClientProvider } from 'react-query';

import { queryClient } from '../services/queryClient';
import { navigationTheme, RNPaperTypographies, colors } from '../theme/designSystem';
import ArtProvider from './Art';
import { AuthProvider } from './Auth';
import { DialogProvider } from './Dialog';
import { ToastProvider } from './Toast';

type AppProviderProps = {
  client?: QueryClient;
  children: React.ReactNode;
};

const RNPaperTheme: Theme = {
  ...DefaultTheme,
  fonts: RNPaperTypographies,
  colors: { ...DefaultTheme.colors, ...colors },
};

export function AppProvider({ client, children }: AppProviderProps) {
  const queryClientConfig = client || queryClient;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClientConfig}>
        <DialogProvider>
          <ToastProvider>
            <AuthProvider>
              <ArtProvider>
                <PaperProvider settings={{ icon: props => <Feather {...props} /> }} theme={RNPaperTheme}>
                  <NavigationContainer theme={navigationTheme}>{children}</NavigationContainer>
                </PaperProvider>
              </ArtProvider>
            </AuthProvider>
          </ToastProvider>
        </DialogProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
