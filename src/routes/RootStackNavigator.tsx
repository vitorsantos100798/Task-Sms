import { CardStyleInterpolators, TransitionPresets } from '@react-navigation/stack';
import React from 'react';
import { Platform } from 'react-native';
import { Colors, TouchableOpacity } from 'react-native-ui-lib';
import Feather from 'react-native-vector-icons/Feather';
import { createSharedElementStackNavigator } from 'react-navigation-shared-element';

import { ArtDetails } from '../screens/ArtDetails';
import { BackgroundFilter } from '../screens/BackgroundFilter';
import { CameraModal } from '../screens/CameraModal';
import { Campaign } from '../screens/Campaign';
import { NewArt } from '../screens/Campaign/NewArt';
import { ChangePassword } from '../screens/ChangePassword';
import { Distribute } from '../screens/Distribute';
import { FacebookPostList } from '../screens/FacebookPostList';
import { FastModels } from '../screens/FastModels';
import { PlaceAutocomplete } from '../screens/PlaceAutocomplete';
import { ProductAutocomplete } from '../screens/ProductAutocomplete';
import { ProductFastModelsAutocomplete } from '../screens/ProductFastModelsAutocomplete';
import { EditProduct } from '../screens/Products/Edit';
import { NewProduct } from '../screens/Products/New';
import { SearchProductImage } from '../screens/SearchProductImage';
import { StoreList } from '../screens/Stores';
import { EditStore } from '../screens/Stores/Edit';
import { NewStore } from '../screens/Stores/New';
import { StudioWeb } from '../screens/StudioWeb';
import { Subscription } from '../screens/Subscription';
import { VideoPlayer } from '../screens/VideoPlayer';
import { Dashboard } from '../screens/Dashboard';
import { fonts } from '../theme/fonts';
import { globalStyles } from '../theme/styles';
import { AppStackParamList } from '../types/navigation';
import { RootBottomTabNavigator } from './RootBottomTabNavigator';
import { ArtsHeaderFolder } from '../components/ArtsHeaderFolder';
import { LogoTitle } from '../components/LogoTitle';

type RootStackProps = {
  initialRouteName?: keyof AppStackParamList;
};

const { Navigator, Screen } = createSharedElementStackNavigator<AppStackParamList>();

const modalScreenOptions = {
  presentation: 'modal' as const,
  cardOverlayEnabled: true,
  ...(Platform.OS === 'ios' ? TransitionPresets.ModalPresentationIOS : TransitionPresets.RevealFromBottomAndroid),
  headerLeft: (props: any) => (
    <TouchableOpacity
      {...props}
      marginL-s2
      flex
      hitSlop={{
        top: 20,
        bottom: 20,
        left: 20,
        right: 20,
      }}>
      <Feather name={Platform.OS === 'ios' ? 'chevron-down' : 'chevron-left'} size={30} color={Colors.secondary} />
    </TouchableOpacity>
  ),
};

export function RootStackNavigator({ initialRouteName }: RootStackProps) {
  return (
    <Navigator
      initialRouteName={initialRouteName}
      screenOptions={{
        headerMode: 'screen',
        headerTitleStyle: {
          fontFamily: fonts.MontserratMedium,
        },
        headerStyle: globalStyles.header,
        headerTintColor: Colors.textColor,
        headerTitleAlign: 'center',
        headerBackTitleVisible: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        headerLeft: props => (
          <TouchableOpacity
            {...props}
            marginL-s2
            hitSlop={{
              top: 20,
              bottom: 20,
              left: 20,
              right: 20,
            }}>
            <Feather name='chevron-left' size={30} color={Colors.secondary} />
          </TouchableOpacity>
        ),
      }}>
      <Screen name='RootBottomTabNavigator' component={RootBottomTabNavigator} options={{ headerShown: false }} />
      <Screen name='Subscription' component={Subscription} options={{ headerShown: false }} />
      <Screen name='FastModels' component={FastModels} options={{ headerShown: false }} />
      <Screen
        name='Campaign'
        component={Campaign}
        options={({ route }) => ({
          headerTitle: () => <ArtsHeaderFolder {...route} />,
        })}
      />

      <Screen
        name='NewArt'
        component={NewArt}
        options={{
          headerStyle: { backgroundColor: Colors.primary },
          headerLeft: props => (
            <TouchableOpacity
              {...props}
              marginL-s2
              hitSlop={{
                top: 20,
                bottom: 20,
                left: 20,
                right: 20,
              }}>
              <Feather name='chevron-left' size={25} color={Colors.white} />
            </TouchableOpacity>
          ),
        }}
      />
      <Screen
        name='StudioWeb'
        component={StudioWeb}
        options={({ route }) => ({
          title: route.params.artName,
        })}
      />

      <Screen name='Stores' component={StoreList} options={{ title: 'Lojas' }} />
      <Screen
        name='Dashboard'
        component={Dashboard}
        options={{
          headerShown: true,
          headerTitleAlign: 'center',
          headerTitle: () => <LogoTitle />,
        }}
      />
      <Screen
        name='ChangePassword'
        component={ChangePassword}
        options={{
          title: 'Alterar senha',
        }}
      />
      <Screen
        name='NewProduct'
        component={NewProduct}
        options={{
          title: 'Cadastrar produto',
        }}
      />
      <Screen
        name='EditProduct'
        component={EditProduct}
        options={{
          title: 'Editar produto',
        }}
      />
      <Screen
        name='NewStore'
        component={NewStore}
        options={{
          title: 'Cadastrar loja',
        }}
      />
      <Screen
        name='EditStore'
        component={EditStore}
        options={{
          title: 'Editar loja',
        }}
      />
      <Screen
        name='BackgroundFilter'
        component={BackgroundFilter}
        options={{
          title: 'Filtros',
          ...modalScreenOptions,
        }}
      />
      <Screen
        name='Distribute'
        component={Distribute}
        options={{
          headerShown: false,
        }}
      />

      <Screen
        name='PlaceAutocomplete'
        component={PlaceAutocomplete}
        options={{
          headerShown: false,
          ...modalScreenOptions,
        }}
      />
      <Screen
        name='ProductAutocomplete'
        component={ProductAutocomplete}
        options={{
          headerShown: false,
          ...modalScreenOptions,
        }}
      />
      <Screen
        name='ProductFastModelsAutocomplete'
        component={ProductFastModelsAutocomplete}
        options={{
          headerShown: false,
          ...modalScreenOptions,
        }}
      />
      <Screen
        name='SearchProductImage'
        component={SearchProductImage}
        options={{
          headerShown: false,
          ...modalScreenOptions,
        }}
      />
      <Screen
        name='FacebookPostList'
        component={FacebookPostList}
        options={{
          headerTitle: 'Postagens',
          ...modalScreenOptions,
        }}
      />
      <Screen
        name='ArtDetails'
        component={ArtDetails}
        options={({ route }) => ({
          title: route.params.artName,
          cardStyleInterpolator: ({ current: { progress } }) => {
            return {
              cardStyle: {
                opacity: progress,
              },
            };
          },
        })}
        sharedElements={route => {
          const { artId } = route.params;
          return [
            {
              id: `art.${artId}.image_url`,
              animation: 'move',
              resize: 'clip',
            },
          ];
        }}
      />
      <Screen
        name='CameraModal'
        component={CameraModal}
        options={{
          headerShown: false,
          presentation: 'modal',
          ...TransitionPresets.ModalSlideFromBottomIOS,
        }}
      />
      <Screen
        name='VideoPlayer'
        component={VideoPlayer}
        options={{
          headerShown: false,
          presentation: 'modal',
          ...TransitionPresets.ModalFadeTransition,
        }}
      />
    </Navigator>
  );
}
