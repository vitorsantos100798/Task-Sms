import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import { LogoTitle } from '../components/LogoTitle';
import { ConfirmResetPasswordCode } from '../screens/ConfirmResetPasswordCode';
import { ForgotPassword } from '../screens/ForgotPassword';
import { ResetPassword } from '../screens/ResetPassword';
import { SignIn } from '../screens/SignIn';
import { SignUp } from '../screens/SignUp';
import { globalStyles } from '../theme/styles';
import { AuthStackParamList } from '../types/navigation';

const { Navigator, Screen } = createStackNavigator<AuthStackParamList>();

export function AuthStackNavigator() {
  return (
    <Navigator
      screenOptions={{
        headerTitle: () => <LogoTitle />,
        headerBackTitleVisible: false,
        headerTitleAlign: 'center',
        headerStyle: globalStyles.header,
      }}>
      <Screen name='SignIn' component={SignIn} />
      <Screen name='SignUp' component={SignUp} />
      <Screen name='ForgotPassword' component={ForgotPassword} />
      <Screen name='ConfirmResetPasswordCode' component={ConfirmResetPasswordCode} />
      <Screen name='ResetPassword' component={ResetPassword} />
    </Navigator>
  );
}
