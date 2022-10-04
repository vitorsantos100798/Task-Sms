import { useNavigation } from '@react-navigation/native';
import { useFormik } from 'formik';
import React, { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Keyboard, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import { Masks, useMaskedInputProps } from 'react-native-mask-input';
import { Button, Colors, Image, Text, Toast, TouchableOpacity, View } from 'react-native-ui-lib';
import Feather from 'react-native-vector-icons/Feather';
import { useMutation } from 'react-query';
import * as Yup from 'yup';

import { TextField } from '../../../components/TextField';
import { findAddressByZipCodeService } from '../../../services/address';
import { uploadFileService } from '../../../services/file';
import { queryClient } from '../../../services/queryClient';
import { createStoreService } from '../../../services/stores';
import { File } from '../../../types/file';
import { AppScreenProp } from '../../../types/navigation';
import { CreateStoreData } from '../../../types/store';
import { BORDER_RADIUS } from '../../../utils/constants';
import { getURLExtension } from '../../../utils/getURLExtension';
import styles from './styles';

const NO_IMAGE_URL = 'https://datasalesio-imagens.s3.amazonaws.com/no-image.png';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Campo obrigatório'),
  description: Yup.string().required('Campo obrigatório'),
});

export function NewStore() {
  const descriptionInputRef = useRef<any>(null);
  const zipCodeInputRef = useRef<any>(null);
  const addressInputRef = useRef<any>(null);
  const streetNumberInputRef = useRef<any>(null);
  const neighborhoodInputRef = useRef<any>(null);
  const cityInputRef = useRef<any>(null);
  const stateInputRef = useRef<any>(null);
  const phoneNumberInputRef = useRef<any>(null);

  const { goBack } = useNavigation<AppScreenProp>();

  const [file, setFile] = useState<File>();

  const [toastIsVisible, setToastIsVisible] = useState(false);

  const newStore = useMutation(
    async (data: CreateStoreData) => {
      if (file) {
        data.logo_url = await uploadFileService(file.uri);
      }

      const response = await createStoreService(data);

      return response;
    },
    {
      onSuccess: () => {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        queryClient.invalidateQueries('stores');

        goBack();
      },
      onError: () => {
        setToastIsVisible(true);
      },
    }
  );

  const handleNewStore = async (data: CreateStoreData) => {
    Keyboard.dismiss();

    await newStore.mutateAsync(data);
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      address: '',
      neighborhood: '',
      city: '',
      state: '',
      street_number: '',
      zip_code: '',
      whatsapp_phone_number: '',
      logo_url: NO_IMAGE_URL,
    },
    validateOnChange: false,
    validateOnMount: false,
    validationSchema,
    onSubmit: handleNewStore,
  });

  const phoneNumberInputProps = useMaskedInputProps({
    value: formik.values.whatsapp_phone_number,
    onChangeText: formik.handleChange('whatsapp_phone_number'),
    mask: Masks.BRL_PHONE,
  });

  const zipCodeInputProps = useMaskedInputProps({
    value: formik.values.zip_code,
    onChangeText: formik.handleChange('zip_code'),
    mask: Masks.ZIP_CODE,
  });

  const handleSearchAddressByZipCode = useCallback(() => {
    const { zip_code } = formik.values;

    if (zip_code) {
      findAddressByZipCodeService(zip_code)
        .then(data => {
          formik.setFieldValue('address', data.logradouro);
          formik.setFieldValue('neighborhood', data.bairro);
          formik.setFieldValue('city', data.localidade);
          formik.setFieldValue('state', data.uf);
        })
        .catch(() => {
          Alert.alert('Erro ao buscar CEP');
        });
    }
  }, [formik]);

  async function handlePickImage() {
    await ImagePicker.launchImageLibrary(
      {
        includeBase64: true,
        mediaType: 'photo',
        selectionLimit: 1,
        quality: 0.5,
      },
      response => {
        if (!response.didCancel && response.assets) {
          const extension = getURLExtension(response.assets[0].uri as string);

          setFile({
            extension,
            uri: response.assets[0].uri as string,
            base64: response.assets[0].base64 as string,
          });
        }
      }
    );

    return null;
  }

  return (
    <>
      <View flex>
        <KeyboardAvoidingView behavior={Platform.OS === 'android' ? undefined : 'padding'} style={{ flex: 1 }}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps='handled'
            contentContainerStyle={styles.content}>
            <View center marginB-s8>
              <TouchableOpacity
                backgroundColor={Colors.grey60}
                marginB-s4
                style={{ borderRadius: BORDER_RADIUS }}
                onPress={handlePickImage}>
                <Image
                  style={styles.logo}
                  resizeMethod='scale'
                  resizeMode='contain'
                  source={{
                    uri: file ? file.uri : NO_IMAGE_URL,
                  }}
                />
              </TouchableOpacity>
              <View row>
                <Button backgroundColor='#E7E7E7' onPress={handlePickImage}>
                  <Feather name='search' />
                  <Text marginL-s2>Escolher</Text>
                </Button>
              </View>
            </View>
            <TextField
              label='Nome'
              autoCorrect={false}
              autoCapitalize='none'
              returnKeyType='next'
              value={formik.values.name}
              onChangeText={formik.handleChange('name')}
              errorText={formik.errors.name}
              error={Boolean(formik.errors.name)}
              onSubmitEditing={() => {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
                descriptionInputRef.current?.focus();
              }}
            />
            <TextField
              ref={descriptionInputRef}
              label='Descrição'
              autoCorrect={false}
              autoCapitalize='none'
              returnKeyType='next'
              value={formik.values.description}
              onChangeText={formik.handleChange('description')}
              errorText={formik.errors.description}
              error={Boolean(formik.errors.description)}
              onSubmitEditing={() => {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
                phoneNumberInputRef.current?.focus();
              }}
            />
            <TextField
              {...phoneNumberInputProps}
              ref={phoneNumberInputRef}
              autoComplete='tel'
              label='Numero do WhatsApp'
              keyboardType='phone-pad'
              returnKeyType='next'
              errorText={formik.errors.whatsapp_phone_number}
              error={Boolean(formik.errors.whatsapp_phone_number)}
              onSubmitEditing={() => {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
                zipCodeInputRef.current?.focus();
              }}
            />
            <TextField
              {...zipCodeInputProps}
              ref={zipCodeInputRef}
              label='CEP'
              autoComplete='postal-address'
              keyboardType='phone-pad'
              returnKeyType='next'
              onBlur={handleSearchAddressByZipCode}
              errorText={formik.errors.zip_code}
              error={Boolean(formik.errors.zip_code)}
            />
            <TextField
              ref={addressInputRef}
              label='Endereço'
              autoCorrect={false}
              autoCapitalize='none'
              returnKeyType='next'
              value={formik.values.address}
              onChangeText={formik.handleChange('address')}
              errorText={formik.errors.address}
              error={Boolean(formik.errors.address)}
              onSubmitEditing={() => {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
                streetNumberInputRef.current?.focus();
              }}
            />
            <TextField
              ref={streetNumberInputRef}
              label='Número'
              autoCorrect={false}
              keyboardType='decimal-pad'
              autoCapitalize='none'
              returnKeyType='next'
              value={formik.values.street_number}
              onChangeText={formik.handleChange('street_number')}
              errorText={formik.errors.street_number}
              error={Boolean(formik.errors.street_number)}
              onSubmitEditing={() => {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
                neighborhoodInputRef.current?.focus();
              }}
            />
            <TextField
              ref={neighborhoodInputRef}
              label='Bairro'
              autoCorrect={false}
              autoCapitalize='none'
              returnKeyType='next'
              value={formik.values.neighborhood}
              onChangeText={formik.handleChange('neighborhood')}
              errorText={formik.errors.neighborhood}
              error={Boolean(formik.errors.neighborhood)}
              onSubmitEditing={() => {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
                cityInputRef.current?.focus();
              }}
            />
            <TextField
              ref={cityInputRef}
              label='Cidade'
              autoCorrect={false}
              autoCapitalize='none'
              returnKeyType='next'
              value={formik.values.city}
              onChangeText={formik.handleChange('city')}
              errorText={formik.errors.city}
              error={Boolean(formik.errors.city)}
              onSubmitEditing={() => {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
                stateInputRef.current?.focus();
              }}
            />
            <TextField
              ref={stateInputRef}
              label='Estado'
              autoCorrect={false}
              autoCapitalize='none'
              returnKeyType='send'
              value={formik.values.state}
              onChangeText={formik.handleChange('state')}
              errorText={formik.errors.state}
              error={Boolean(formik.errors.state)}
              onSubmitEditing={() => {
                formik.handleSubmit();
              }}
            />
            <Button
              marginT-s2
              animateLayout
              text70BO
              label={!formik.isSubmitting ? 'Salvar' : undefined}
              disabled={formik.isSubmitting}
              onPress={formik.handleSubmit}>
              {formik.isSubmitting && <ActivityIndicator color={Colors.white} />}
            </Button>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>

      <Toast
        visible={toastIsVisible}
        position='bottom'
        backgroundColor={Colors.red30}
        message='Erro ao cadastrar loja'
        onDismiss={() => {
          setToastIsVisible(false);
        }}
        autoDismiss={3000}
      />
    </>
  );
}
