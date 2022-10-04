/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useNavigation } from '@react-navigation/native';
import { useFormik } from 'formik';
import React from 'react';
import { ActivityIndicator, Keyboard, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Button, Colors, Text, View } from 'react-native-ui-lib';
import { useMutation } from 'react-query';
import * as Yup from 'yup';
import { TextField } from '../../components/TextField';

import { useToast } from '../../hooks/useToast';
import { forgotPasswordService } from '../../services/password';
import { AuthScreenProp } from '../../types/navigation';
import styles from './styles';

type FormValues = {
  email: string;
};

const validationSchema = Yup.object().shape({
  email: Yup.string().required('Digite seu e-mail').email('Email inválido'),
});

export function ForgotPassword() {
  const toast = useToast();

  const { navigate } = useNavigation<AuthScreenProp>();

  const forgotPassword = useMutation(
    async (data: FormValues) => {
      await forgotPasswordService(data.email);

      return data;
    },
    {
      onSuccess: () => {
        navigate('ConfirmResetPasswordCode');
      },
      onError: () => {
        toast.show('Erro ao enviar o e-mail', {
          variant: 'error',
        });
      },
    }
  );

  const handleForgotPassword = async (data: FormValues) => {
    Keyboard.dismiss();
    await forgotPassword.mutateAsync(data);
  };

  const formik = useFormik<FormValues>({
    initialValues: {
      email: '',
    },
    validationSchema,
    validateOnChange: false,
    onSubmit: handleForgotPassword,
  });

  return (
    <View flex useSafeArea>
      <KeyboardAvoidingView behavior={Platform.OS === 'android' ? undefined : 'padding'} style={{ flex: 1 }}>
        <ScrollView keyboardShouldPersistTaps='handled'>
          <View flex paddingH-page paddingT-s10>
            <Text text60BO marginB-40 center color={Colors.secondary}>
              Qual o seu -email?
            </Text>
            <Text body marginB-s10 center textAlign='center' color={Colors.grey30}>
              Enviaremos um link em seu e-email para você alterar sua senha
            </Text>
            <TextField
              label='Digite o seu e-mail'
              autoCorrect={false}
              autoCapitalize='none'
              autoComplete='email'
              keyboardType='email-address'
              returnKeyType='done'
              value={formik.values.email}
              onChangeText={formik.handleChange('email')}
              errorText={formik.errors.email}
              error={Boolean(formik.errors.email)}
              onSubmitEditing={() => {
                formik.handleSubmit();
              }}
            />
            <Button
              marginT-s4
              animateLayout
              label={!formik.isSubmitting ? 'Enviar e-mail' : undefined}
              text60BO
              backgroundColor={Colors.secondary}
              disabled={formik.isSubmitting}
              style={styles.submitButton}
              onPress={() => {
                formik.handleSubmit();
              }}>
              {formik.isSubmitting && <ActivityIndicator color={Colors.white} />}
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
