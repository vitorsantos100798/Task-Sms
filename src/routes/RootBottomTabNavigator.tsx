import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RouteProp, useRoute } from '@react-navigation/native';
import React from 'react';
import { Colors } from 'react-native-ui-lib';
import Feather from 'react-native-vector-icons/Feather';
import { useQuery } from 'react-query';

import { LogoTitle } from '../components/LogoTitle';
import { useAuth } from '../hooks/useAuth';
import { FastModels } from '../screens/FastModels';
import { Home } from '../screens/Home';
import { Menu } from '../screens/Menu';
import { SegmentSelect } from '../screens/SegmentSelect';
import { validateSegment } from '../services/sessions';
import { globalStyles } from '../theme/styles';
import { AppStackParamList } from '../types/navigation';

const { Navigator, Screen } = createBottomTabNavigator();

export function RootBottomTabNavigator() {
  const { user, changeUser } = useAuth();
  const { params } = useRoute<RouteProp<AppStackParamList, 'RootBottomTabNavigator'>>();

  useQuery('segment', validateSegment, {
    enabled: !user.segmentId,
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    onSuccess: async (response: { ID_SEGMENT: number }) => {
      await changeUser({ ...user, segmentId: response.ID_SEGMENT });
    },
  });

  if (!user.segmentId) {
    return <SegmentSelect />;
  }

  return (
    <Navigator
      screenOptions={{
        headerShown: true,
        headerTitleAlign: 'center',
        headerTitle: () => <LogoTitle />,
        tabBarActiveTintColor: Colors.secondary,
        tabBarInactiveTintColor: Colors.grey30,
        headerStyle: globalStyles.header,
        tabBarStyle: globalStyles.tabBar,
        tabBarLabelStyle: globalStyles.tabBarLabel,
      }}>
      <Screen
        name='FastModels'
        options={{
          headerShown: false,
          tabBarLabel: 'Início',
          title: 'Início',
          tabBarIcon: ({ color, size }) => <Feather name='home' color={color} size={size} />,
        }}>
        {() => <FastModels {...params} />}
      </Screen>
      <Screen
        name='Home'
        component={Home}
        options={{
          tabBarLabel: 'Campanhas',
          title: 'Campanhas',
          tabBarIcon: ({ color, size }) => <Feather name='image' color={color} size={size} />,
        }}
      />
      <Screen
        name='Menu'
        component={Menu}
        options={{
          tabBarLabel: 'Menu',
          title: 'Menu',
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Feather name='menu' color={color} size={size} />,
        }}
      />
    </Navigator>
  );
}
