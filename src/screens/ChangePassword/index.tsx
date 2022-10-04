import { useNavigation } from '@react-navigation/native';
import { useFormik } from 'formik';
import React, { useRef } from 'react';
import { ActivityIndicator, Keyboard, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Button, Colors, View } from 'react-native-ui-lib';
import { useMutation } from 'react-query';
import * as Yup from 'yup';

import { TextField } from '../../components/TextField';
import { useToast } from '../../hooks/useToast';
import { changePasswordService } from '../../services/password';
import { AppScreenProp } from '../../types/navigation';
import styles from './styles';

type FormValues = {
  password: string;
  currentPassword: string;
  passwordConfirmation: string;
};

const validationSchema = Yup.object().shape({
  password: Yup.string().required('Digite sua senha'),
  currentPassword: Yup.string().required('confirme sua senha atual'),
  passwordConfirmation: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match'),
});

export function ChangePassword() {
  const { goBack } = useNavigation<AppScreenProp>();

  const passwordConfirmationInputRef = useRef<any>(null);
  const passwordInputRef = useRef<any>(null);

  const toast = useToast();

  const changePassword = useMutation(
    async (data: FormValues) => {
      await changePasswordService(data);
      return data;
    },
    {
      onSuccess: () => {
        toast.show('Senha alterada com sucesso!', {
          variant: 'success',
        });

        goBack();
      },
      onError: () => {
        toast.show('Erro ao alterar senha', {
          variant: 'error',
        });
      },
    }
  );

  const handleChangePassword = async (data: FormValues) => {
    Keyboard.dismiss();

    await changePassword.mutateAsync(data);
  };

  const formik = useFormik<FormValues>({
    initialValues: {
      password: '',
      currentPassword: '',
      passwordConfirmation: '',
    },
    validationSchema,
    validateOnChange: false,
    onSubmit: handleChangePassword,
  });

  return (
    <View flex useSafeArea>
      <KeyboardAvoidingView behavior={Platform.OS === 'android' ? undefined : 'padding'} style={{ flex: 1 }}>
        <ScrollView keyboardShouldPersistTaps='handled'>
          <View flex padding-page>
            <TextField
              label='Confirmar senha atual'
              secureTextEntry
              returnKeyType='next'
              value={formik.values.currentPassword}
              onChangeText={formik.handleChange('currentPassword')}
              errorText={formik.errors.currentPassword}
              onSubmitEditing={() => {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
                passwordInputRef.current?.focus();
              }}
            />
            <TextField
              ref={passwordInputRef}
              label='Nova senha'
              secureTextEntry
              returnKeyType='next'
              value={formik.values.password}
              onChangeText={formik.handleChange('password')}
              errorText={formik.errors.password}
              onSubmitEditing={() => {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
                passwordConfirmationInputRef.current?.focus();
              }}
            />
            <TextField
              ref={passwordConfirmationInputRef}
              label='Confirmar nova senha'
              secureTextEntry
              returnKeyType='send'
              value={formik.values.passwordConfirmation}
              onChangeText={formik.handleChange('passwordConfirmation')}
              errorText={formik.errors.passwordConfirmation}
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
