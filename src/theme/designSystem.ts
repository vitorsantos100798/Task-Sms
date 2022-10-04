import { Assets, Colors, Spacings, ThemeManager, Typography } from 'react-native-ui-lib';
import { configureFonts } from 'react-native-paper';
import { assetsGroup } from './assets';
import { buttonDefaultProps } from './components/button';
import { imageDefaultProps } from './components/image';
import { listItemDefaultProps } from './components/listItem';
import { getLoaderScreenProps } from './components/loaderScreen';
import { getSliderProps } from './components/slider';
import { getTabBarProps } from './components/tabBar';
import { getTextProps } from './components/text';
import { getTextFieldProps } from './components/textField';
import { touchableOpacityDefaultProps } from './components/touchableOpacity';
import { getWizardProps } from './components/wizard';
import { spacings } from './spacings';
import { typographies } from './typographies';

export const colors = {
  primary: '#2813AD',
  secondary: '#2813AD',
  accent: '#FFC107',
  success: Colors.green40,
  warning: Colors.yellow30,
  error: Colors.red30,
  info: Colors.blue30,
  text: Colors.grey20,
};

export const navigationTheme = {
  dark: false,
  colors: {
    primary: colors.primary,
    background: Colors.white,
    card: Colors.white,
    text: Colors.grey10,
    border: Colors.grey60,
    notification: colors.primary,
  },
};

export const RNPaperTypographies = configureFonts({
  ios: typographies,
  android: typographies,
});

export const configureDesignSystem = () => {
  // Load colors
  Colors.loadColors(colors);

  // Load Spacings
  Spacings.loadSpacings(spacings);

  // Load Typography
  Typography.loadTypographies(typographies);

  // Load Assets
  Assets.loadAssetsGroup('icons', assetsGroup.icons);
  Assets.loadAssetsGroup('general', assetsGroup.general);
  Assets.loadAssetsGroup('signIn', assetsGroup.signIn);
  Assets.loadAssetsGroup('campaign', assetsGroup.campaign);
  Assets.loadAssetsGroup('subscription', assetsGroup.subscription);
  Assets.loadAssetsGroup('home', assetsGroup.home);
  Assets.loadAssetsGroup('emptyStates', assetsGroup.emptyStates);
  Assets.loadAssetsGroup('distribute', assetsGroup.distribute);

  // Load components theme
  ThemeManager.setComponentTheme('Button', buttonDefaultProps);
  ThemeManager.setComponentTheme('Image', imageDefaultProps);
  ThemeManager.setComponentTheme('ListItem', listItemDefaultProps);
  ThemeManager.setComponentTheme('TouchableOpacity', touchableOpacityDefaultProps);
  ThemeManager.setComponentForcedTheme('Text', getTextProps);
  ThemeManager.setComponentTheme('Wizard', getWizardProps);
  ThemeManager.setComponentForcedTheme('TabController.TabBar', getTabBarProps);
  ThemeManager.setComponentForcedTheme('Slider', getSliderProps);
  ThemeManager.setComponentForcedTheme('LoaderScreen', getLoaderScreenProps);
  ThemeManager.setComponentForcedTheme('Incubator.TextField', getTextFieldProps);

  /* Dark Mode Schemes */
  Colors.loadSchemes({
    light: {
      screenBG: Colors.white,
      textColor: Colors.grey10,
    },
    dark: {
      screenBG: Colors.white,
      textColor: Colors.grey10,
    },
  });
};
