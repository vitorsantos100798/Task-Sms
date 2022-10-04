import { useFormik } from 'formik';
import React, { useRef, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Button, Colors, Text, View, LoaderScreen } from 'react-native-ui-lib';
import { useMutation } from 'react-query';
import * as Yup from 'yup';

import { TextField } from '../../components/TextField';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { signUpService } from '../../services/sessions';
import styles from './styles';

type FormValues = {
  company_name: string;
  name: string;
  email: string;
  password: string;
};

const validationSchema = Yup.object().shape({
  company_name: Yup.string().required('O nome da empresa é obrigatório'),
  name: Yup.string().required('O nome é obrigatório'),
  email: Yup.string().required('Digite seu e-mail').email('Email inválido'),
  password: Yup.string().required('Digite sua senha'),
});

export function SignUp() {
  const [feedbackSuccess, setFeedbackSucces] = useState<boolean>(false);
  const nameInputRef = useRef<any>(null);
  const emailInputRef = useRef<any>(null);
  const passwordInputRef = useRef<any>(null);

  const toast = useToast();

  const { signIn } = useAuth();

  const signUp = useMutation(
    async (data: FormValues) => {
      await signUpService(data);

      return data;
    },
    {
      onSuccess: ({ email, password }) => {
        setFeedbackSucces(true);
        signIn({ email, password });
      },
      onError: () => {
        toast.show('Erro ao criar conta', {
          variant: 'error',
        });
      },
    }
  );

  const handleSignUp = async (data: FormValues) => {
    setFeedbackSucces(false);
    await signUp.mutateAsync(data);
  };

  const formik = useFormik<FormValues>({
    initialValues: {
      company_name: '',
      name: '',
      email: '',
      password: '',
    },
    validationSchema,
    validateOnChange: false,
    onSubmit: handleSignUp,
  });

  if (feedbackSuccess) {
    return (
      <View flex useSafeArea center>
        <LoaderScreen color={Colors.primary} message='Carregando...' overlay />
      </View>
    );
  }

  return (
    <View flex useSafeArea>
      <KeyboardAvoidingView behavior={Platform.OS === 'android' ? undefined : 'padding'} style={{ flex: 1 }}>
        <ScrollView keyboardShouldPersistTaps='handled'>
          <View flex padding-page>
            <Text text60BO marginB-s10>
              Experimente gratis por 3 dias
            </Text>
            <TextField
              label='Nome da empresa'
              placeholder='Empresa...'
              autoCorrect={false}
              autoCapitalize='sentences'
              returnKeyType='next'
              value={formik.values.company_name}
              onChangeText={formik.handleChange('company_name')}
              errorText={formik.errors.company_name}
              error={Boolean(formik.errors.company_name)}
              onSubmitEditing={nameInputRef.current?.focus}
            />
            <TextField
              ref={nameInputRef}
              label='Nome completo'
              placeholder='Nome do usuário...'
              autoCorrect={false}
              autoCapitalize='sentences'
              returnKeyType='next'
              value={formik.values.name}
              onChangeText={formik.handleChange('name')}
              errorText={formik.errors.name}
              error={Boolean(formik.errors.name)}
              onSubmitEditing={emailInputRef.current?.focus}
            />
            <TextField
              ref={emailInputRef}
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
              onSubmitEditing={passwordInputRef.current?.focus}
            />
            <TextField
              ref={passwordInputRef}
              placeholder='Senha...'
              label='Senha'
              secureTextEntry
              returnKeyType='send'
              value={formik.values.password}
              onChangeText={formik.handleChange('password')}
              errorText={formik.errors.password}
              error={Boolean(formik.errors.password)}
              onSubmitEditing={() => {
                formik.handleSubmit();
              }}
            />

            <Button
              marginT-s4
              animateLayout
              label={!formik.isSubmitting ? 'Cadastrar' : undefined}
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
