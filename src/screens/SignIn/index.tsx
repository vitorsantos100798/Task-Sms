import { useNavigation } from '@react-navigation/native';
import { useFormik } from 'formik';
import React, { useCallback, useRef } from 'react';
import { ActivityIndicator, Keyboard, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { TextInput } from 'react-native-paper';
import { Button, Colors, Image, Spacings, Text, TouchableOpacity, Typography, View } from 'react-native-ui-lib';
import Feather from 'react-native-vector-icons/Feather';
import * as Yup from 'yup';

import { TextField } from '../../components/TextField';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { AuthScreenProp } from '../../types/navigation';
import { SignInCredentials } from '../../types/session';
import styles from './styles';

type FormValues = {
  email: string;
  password: string;
};

const validationSchema = Yup.object().shape({
  email: Yup.string().required('Digite seu e-mail').email('Email inválido'),
  password: Yup.string().required('Digite sua senha'),
});

export function SignIn() {
  const passwordInputRef = useRef<any>(null);

  const { navigate } = useNavigation<AuthScreenProp>();

  const { signIn } = useAuth();

  const toast = useToast();

  function handleNavigateToForgotPassword() {
    navigate('ForgotPassword');
  }

  function handleNavigateToSignUp() {
    navigate('SignUp');
  }

  const handleSIgnIn = useCallback(
    async (values: SignInCredentials) => {
      Keyboard.dismiss();

      try {
        await signIn(values);
      } catch (err) {
        toast.show('E-mail ou senha inválidos', {
          variant: 'error',
        });
      }
    },
    [signIn, toast]
  );

  const formik = useFormik<FormValues>({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    validateOnChange: false,
    onSubmit: handleSIgnIn,
  });

  return (
    <View flex>
      <KeyboardAvoidingView behavior={Platform.OS === 'android' ? undefined : 'padding'} style={{ flex: 1 }}>
        <ScrollView keyboardShouldPersistTaps='handled' showsVerticalScrollIndicator={false}>
          <View flex padding-page>
            <View center>
              <Image assetGroup='signIn' assetName='banner' resizeMode='contain' style={styles.logo} />
            </View>
            <Text marginB-s2 text60M color={Colors.primary}>
              A plataforma N°1 em Automação de Marketing para o Varejo
            </Text>
            <Text marginB-16 body textAlign='left' color={Colors.text}>
              Para continuar, insira seu login e senha que recebeu por email
            </Text>
            <TextField
              testID='email-input'
              label='E-mail'
              placeholder='E-mail...'
              autoCorrect={false}
              autoCapitalize='none'
              keyboardType='email-address'
              returnKeyType='next'
              value={formik.values.email}
              onChangeText={formik.handleChange('email')}
              errorText={formik.errors.email}
              error={Boolean(formik.errors.email)}
              left={<TextInput.Icon name='mail' size={Typography.text60?.fontSize} style={styles.leadingAccessory} />}
              onSubmitEditing={() => {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
                passwordInputRef.current?.focus();
              }}
            />
            <TextField
              testID='password-input'
              ref={passwordInputRef}
              label='Senha'
              placeholder='Senha...'
              secureTextEntry
              returnKeyType='send'
              value={formik.values.password}
              onChangeText={formik.handleChange('password')}
              errorText={formik.errors.password}
              error={Boolean(formik.errors.password)}
              style={{ marginBottom: Spacings.s4 }}
              left={<TextInput.Icon name='lock' size={Typography.text60?.fontSize} style={styles.leadingAccessory} />}
              onSubmitEditing={() => {
                formik.handleSubmit();
              }}
            />
            <TouchableOpacity
              testID='forgot-password-button'
              marginB-s4
              style={styles.forgotPasswordButton}
              onPress={handleNavigateToForgotPassword}>
              <Text body color={Colors.primary}>
                Esqueceu sua senha?
              </Text>
            </TouchableOpacity>
            <Button
              testID='sign-in-button'
              label={!formik.isSubmitting ? 'Entrar' : undefined}
              text60BO
              marginB-s4
              disabled={formik.isSubmitting}
              style={styles.submitButton}
              onPress={() => {
                formik.handleSubmit();
              }}>
              {formik.isSubmitting && <ActivityIndicator color={Colors.white} />}
            </Button>
            {/* <Button
              outline
              label="Experimente gratis"
              text60BO
              disabled={formik.isSubmitting}
              style={styles.signUpButton}
              onPress={handleNavigateToSignUp}
            /> */}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
