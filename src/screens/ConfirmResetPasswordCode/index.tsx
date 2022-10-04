import { useNavigation, CommonActions } from '@react-navigation/native';
import { useFormik } from 'formik';
import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Keyboard } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { Button, Colors, Text, View } from 'react-native-ui-lib';
import Feather from 'react-native-vector-icons/Feather';
import { useMutation } from 'react-query';
import * as Yup from 'yup';

import { TextField } from '../../components/TextField';
import { useToast } from '../../hooks/useToast';
import { validateForgotPasswordTokenService } from '../../services/password';
import { AuthScreenProp } from '../../types/navigation';
import styles from './styles';

type FormValues = {
  code: string;
};

const validationSchema = Yup.object().shape({
  code: Yup.string().required('Digite o código').length(6, 'Código inválido'),
});

export function ConfirmResetPasswordCode() {
  const toast = useToast();

  const { dispatch } = useNavigation<AuthScreenProp>();

  const forgotPassword = useMutation(
    async (data: FormValues) => {
      const response = await validateForgotPasswordTokenService(Number(data.code));

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return response.data;
    },
    {
      onSuccess: (_, { code }) => {
        dispatch(
          CommonActions.reset({
            index: 1,
            routes: [
              { name: 'SignIn' },
              {
                name: 'ResetPassword',
                params: { token: Number(code) },
              },
            ],
          })
        );
      },
      onError: () => {
        toast.show('Código expirado ou invalido', {
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
      code: '',
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
            <View center marginB-s8>
              <View center style={styles.circle}>
                <Feather name='lock' color={Colors.secondary} size={RFPercentage(6)} />
              </View>
            </View>
            <Text text60BO marginB-s4 center color={Colors.secondary}>
              Enviamos um código no seu email
            </Text>
            <Text body marginB-s10 center textAlign='center' color={Colors.grey30}>
              Digite o código de 6 dígitos que enviamos para o seu email.
            </Text>
            <TextField
              placeholder='Código'
              keyboardType='number-pad'
              returnKeyType='done'
              value={formik.values.code}
              onChangeText={formik.handleChange('code')}
              errorText={formik.errors.code}
              error={Boolean(formik.errors.code)}
              maxLength={6}
              onSubmitEditing={() => {
                formik.handleSubmit();
              }}
            />
            <Button
              animateLayout
              label={!formik.isSubmitting ? 'Continuar' : undefined}
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
