import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { DistributeArts } from './distribution';
import { ProductToEditType } from './product';

export type AuthStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  ConfirmResetPasswordCode: undefined;
  ResetPassword: {
    token: number;
  };
};

export type AppStackParamList = {
  RootBottomTabNavigator: {
    subcategoryDescription?: string;
    subcategoryId?: number;
  };
  MyComponentsDemo: undefined;
  CampaignList: undefined;
  Campaign: {
    campaignId: number;
    campaignName: string;
    activeTabIndex?: number;
    editWasClicked?: number;
  };
  ChangePassword: undefined;
  NewArt: {
    campaignName?: string;
    campaignId?: number;
    name?: string;
    image_url?: string;
    price?: number;
    price2?: number;
    productType?: number;
    editProduct?: number;
  };
  StudioWeb: {
    artId: number;
    artName: string;
    campaignId: number;
  };
  NewProduct: {
    campaignId?: number;
    productName?: string;
    productType?: string;
    price?: number;
    price2?: number;
    productImageUrl?: string;
    photoPath?: string;
    toEdit?: ProductToEditType;
  };
  EditProduct: {
    productId: number;
    productName?: string;
    price?: number;
    price2?: number;
    productImageUrl?: string;
    photoPath?: string;
  };
  SegmentSelect: undefined;
  Stores: undefined;
  NewStore: undefined;
  EditStore: { storeId: number; storeName: string };
  Subscription: undefined;
  BackgroundFilter: {
    campaignId: number;
    formatId: number;
    segmentId: number;
    occasionId?: number;
  };
  Distribute: {
    campaignId?: number;
    arts: DistributeArts[];
    placeId?: string;
    isFastModels?: boolean;
  };
  FastModels: undefined;
  PlaceAutocomplete: undefined;
  ProductAutocomplete: {
    productName?: string;
  };
  ProductFastModelsAutocomplete: {
    subcategoryDescription?: string;
    categoryId: number;
  };
  SearchProductImage: {
    productName?: string;
  };
  ArtDetails: {
    artId: number;
    artName: string;
    artURL: string;
    campaignId?: number;
  };
  CameraModal: undefined;
  FacebookPostList: undefined;
  Dashboard: undefined;
  VideoPlayer: {
    videoUrl: string;
    videoTitle: string;
  };
};

export type RootBottomTabParamList = {
  Home: undefined;
  CreateCampaign: undefined;
  Menu: undefined;
};

export type AuthScreenProp = StackNavigationProp<AuthStackParamList, 'SignIn'>;

export type AppScreenProp = CompositeNavigationProp<
  StackNavigationProp<AppStackParamList, 'RootBottomTabNavigator'>,
  BottomTabNavigationProp<RootBottomTabParamList, 'Home'>
>;
