import { CommonActions, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useFormik } from 'formik';
import React, { useRef } from 'react';
import { ActivityIndicator, Keyboard, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Button, Colors, Incubator, Text, View } from 'react-native-ui-lib';
import { useMutation } from 'react-query';
import * as Yup from 'yup';

import { useToast } from '../../hooks/useToast';
import { resetPasswordService } from '../../services/password';
import { AuthScreenProp, AuthStackParamList } from '../../types/navigation';
import styles from './styles';

const { TextField } = Incubator;

type FormValues = {
  password: string;
  passwordConfirmation: string;
};

const validationSchema = Yup.object().shape({
  password: Yup.string().required('Digite sua senha'),
  passwordConfirmation: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match'),
});

export function ResetPassword() {
  const passwordConfirmationInputRef = useRef<any>(null);
  const passwordInputRef = useRef<any>(null);

  const {
    params: { token },
  } = useRoute<RouteProp<AuthStackParamList, 'ResetPassword'>>();

  const { dispatch } = useNavigation<AuthScreenProp>();

  const toast = useToast();

  const resetPassword = useMutation(
    async (data: FormValues) => {
      const response = await resetPasswordService({
        token,
        password: data.password,
      });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return response.data;
    },
    {
      onSuccess: () => {
        toast.show('Senha alterada com sucesso', {
          variant: 'success',
        });

        dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'SignIn' }],
          })
        );
      },
      onError: () => {
        toast.show('Erro ao rosetar a senha', {
          variant: 'error',
        });
      },
    }
  );

  const handleResetPassword = async (data: FormValues) => {
    Keyboard.dismiss();

    await resetPassword.mutateAsync(data);
  };

  const formik = useFormik<FormValues>({
    initialValues: {
      password: '',
      passwordConfirmation: '',
    },
    validationSchema,
    validateOnChange: false,
    onSubmit: handleResetPassword,
  });

  return (
    <View flex useSafeArea>
      <KeyboardAvoidingView behavior={Platform.OS === 'android' ? undefined : 'padding'} style={{ flex: 1 }}>
        <ScrollView keyboardShouldPersistTaps='handled'>
          <View flex padding-page>
            <Text text60M marginB-s10>
              Redefinir senha
            </Text>
            <TextField
              ref={passwordInputRef}
              label='Nova senha'
              secureTextEntry
              returnKeyType='next'
              value={formik.values.password}
              onChangeText={formik.handleChange('password')}
              validationMessage={formik.errors.password}
              onSubmitEditing={() => {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
                passwordConfirmationInputRef.current?.focus();
              }}
            />
            <TextField
              ref={passwordConfirmationInputRef}
              label='Confirme a nova senha'
              secureTextEntry
              returnKeyType='send'
              value={formik.values.passwordConfirmation}
              onChangeText={formik.handleChange('passwordConfirmation')}
              validationMessage={formik.errors.passwordConfirmation}
              onSubmitEditing={() => {
                formik.handleSubmit();
              }}
            />
            <Button
              animateLayout
              label={!formik.isSubmitting ? 'Salvar' : undefined}
              text60BO
              disabled={formik.isSubmitting}
              style={styles.signButton}
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
