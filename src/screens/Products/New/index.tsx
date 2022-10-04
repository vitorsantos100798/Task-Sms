import { Picker } from '@components/Picker';
import { RouteProp, useNavigation, useNavigationState, useRoute } from '@react-navigation/native';
import api from '@services/api';
import { PRODUCT_TYPES } from '@utils/constants';
import { useFormik } from 'formik';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Keyboard, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import RNFS from 'react-native-fs';
import * as ImagePicker from 'react-native-image-picker';
import { Masks, useMaskedInputProps } from 'react-native-mask-input';
import { Modalize } from 'react-native-modalize';
import { Button, Colors, Image, LoaderScreen, Text, TouchableOpacity, View } from 'react-native-ui-lib';
import Feather from 'react-native-vector-icons/Feather';
import { useMutation } from 'react-query';
import * as Yup from 'yup';

import { ActionSheet } from '../../../components/ActionSheet';
import { TextField } from '../../../components/TextField';
// import { SearchImageModal } from '../../../components/SearchImageModal';
import { useToast } from '../../../hooks/useToast';
import { uploadFileService } from '../../../services/file';
import { createProductService } from '../../../services/products';
import { queryClient } from '../../../services/queryClient';
import { AppScreenProp, AppStackParamList } from '../../../types/navigation';
import { CreateProductData } from '../../../types/product';
import { getPreviousRouteFromState } from '../../../utils/getPreviousRouteFromState';
import styles from './styles';

const NO_IMAGE_URL = 'https://datasalesio-imagens.s3.amazonaws.com/no-image.png';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Campo obrigatório'),
  price: Yup.string().required('Campo obrigatório'),
  price2: Yup.string().notRequired(),
});

export function NewProduct() {
  const actionSheetRef = useRef<Modalize>(null);

  const priceInputRef = useRef<any>(null);

  const {
    params: { campaignId, productName, productType, price, price2, productImageUrl, photoPath, toEdit },
  } = useRoute<RouteProp<AppStackParamList, 'NewProduct'>>();

  const { navigate, goBack } = useNavigation<AppScreenProp>();

  const toast = useToast();

  const [filePath, setFilePath] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-assignment
  const previousRoute = useNavigationState(s => getPreviousRouteFromState(s));

  function handleCameraModalOpen() {
    actionSheetRef.current?.close();
    navigate('CameraModal');
  }

  const newProduct = useMutation(
    async (data: CreateProductData) => {
      if (filePath) {
        data.image_url = photoPath ? filePath : await uploadFileService(filePath);
      }

      if (typeof data.price === 'string') {
        data.price = parseFloat(data.price.split('$')[1].replace(',', '.'));
      }

      if (typeof data.price2 === 'string') {
        data.price2 = parseFloat(data.price2.split('$')[1].replace(',', '.'));
      }

      const response = await createProductService(data);

      return response;
    },
    {
      onSuccess: (_, { list_id }) => {
        queryClient.invalidateQueries(['products', list_id]);

        goBack();
      },
      onError: () => {
        toast.show('Erro ao criar produto', {
          variant: 'error',
        });
      },
    }
  );

  const handleNewProduct = async (data: CreateProductData) => {
    Keyboard.dismiss();

    if (!data.list_id) {
      if (filePath) {
        data.image_url = photoPath ? filePath : await uploadFileService(filePath);
      }

      if (typeof data.price === 'string') {
        data.price = parseFloat(data.price.replace('R$', '').replace(',', '.'));
      }
      if (typeof data.price2 === 'string') {
        data.price2 = parseFloat(data.price2.replace('R$', '').replace(',', '.'));
      }

      navigate(previousRoute.name, {
        ...previousRoute.params,
        ...data,
      });
    } else {
      await newProduct.mutateAsync(data);
    }
  };

  const handleEditNewProduct = async (formValues: CreateProductData) => {
    Keyboard.dismiss();
    handleNewProduct(formValues);
  };

  const formik = useFormik({
    initialValues: {
      list_id: campaignId,
      image_url: NO_IMAGE_URL,
      productType: 1,
    } as CreateProductData,
    validateOnChange: false,
    validateOnMount: false,
    validationSchema,
    onSubmit: formValues => (toEdit?.product ? handleEditNewProduct(formValues) : handleNewProduct(formValues)),
  });

  const priceInputProps = useMaskedInputProps({
    value: String(formik.values.price),
    onChangeText: formik.handleChange('price'),
    mask: Masks.BRL_CURRENCY,
  });

  const priceDeInputProps = useMaskedInputProps({
    value: String(formik.values.price2),
    onChangeText: formik.handleChange('price2'),
    mask: Masks.BRL_CURRENCY,
  });

  useEffect(() => {
    if (productName) {
      formik.setFieldValue('name', productName);
    }

    if (price) {
      formik.setFieldValue('price', price);
    }
    if (price2) {
      formik.setFieldValue('price2', price2);
    }

    if (productImageUrl) {
      formik.setFieldValue('image_url', productImageUrl);
      setFilePath(false);
    }
    if (productType) {
      formik.setFieldValue('productType', productType);
    }

    if (photoPath) {
      setLoading(true);
      const removeBackgroundPhoto = async () => {
        const base64 = await RNFS.readFile(photoPath, 'base64');
        const payload = {
          imagem_produto: `data:image/png;base64,${base64}`,
          imagem_produto_original_link: null,
          imagem_produto_original_s3: null,
          isBase64: true,
          new: true,
        };
        const response = await api.post('/lista-ofertas-p1-prd/postProdutoImagem', payload);

        const { image, imagem_produto_original_s3, imagem_produto_original_link } = response.data;
        setFilePath(image);
        setTimeout(() => {
          setLoading(false);
        }, 500);
      };
      removeBackgroundPhoto();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photoPath, productImageUrl]);

  const handlePickImage = useCallback(async () => {
    actionSheetRef.current?.close();

    await ImagePicker.launchImageLibrary(
      {
        mediaType: 'photo',
        selectionLimit: 1,
        quality: 0.5,
      },
      response => {
        if (!response.didCancel && response.assets) {
          setFilePath(response.assets[0].uri as string);

          formik.setFieldValue('image_url', undefined);
        }
      }
    );
  }, [formik]);

  function handleActionSheetOpen() {
    actionSheetRef.current?.open();
  }

  const handleNavigateToProductAutocomplete = useCallback(() => {
    actionSheetRef.current?.close();
    navigate('ProductAutocomplete', {
      productName: formik.values.name,
    });
  }, [formik.values.name, navigate]);

  const handleNavigateToSearchProductImage = useCallback(() => {
    navigate('SearchProductImage', {
      productName: formik.values.name,
    });
  }, [formik.values.name, navigate]);

  useEffect(() => {
    if (toEdit?.product) {
      formik.setFieldValue('image_url', toEdit.product.image_url);
      formik.setFieldValue('name', toEdit.product.name);
      formik.setFieldValue('productType', toEdit.product.productType);
      formik.setFieldValue('price', toEdit.product.price);
      formik.setFieldValue('price2', toEdit.product.price2);
    }
  }, []);

  return (
    <>
      <KeyboardAvoidingView behavior={Platform.OS === 'android' ? undefined : 'padding'} style={{ flex: 1 }}>
        <ScrollView keyboardShouldPersistTaps='handled' contentContainerStyle={styles.content}>
          <View center marginB-s4>
            {loading ? (
              <View
                style={{
                  width: '100%',
                  height: 250,
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <LoaderScreen color={Colors.primary} message='Carregando...' overlay />
              </View>
            ) : (
              <TouchableOpacity
                backgroundColor={Colors.grey60}
                padding-s3
                style={styles.productImageContainer}
                onPress={handleActionSheetOpen}>
                {filePath ? (
                  <Image
                    style={styles.productImage}
                    resizeMode='contain'
                    resizeMethod='scale'
                    source={{
                      uri: filePath,
                    }}
                  />
                ) : (
                  <Image
                    style={styles.productImage}
                    resizeMode='contain'
                    resizeMethod='scale'
                    source={{
                      uri: formik.values.image_url,
                    }}
                  />
                )}
              </TouchableOpacity>
            )}
          </View>

          <TextField
            label='Nome do produto'
            autoCorrect={false}
            autoCapitalize='none'
            returnKeyType='next'
            value={formik.values.name}
            onChangeText={formik.handleChange('name')}
            errorText={formik.errors.name}
            error={Boolean(formik.errors.name)}
            onSubmitEditing={() => {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
              priceInputRef.current?.focus();
            }}
          />

          <View style={styles.lineContainer}>
            <View style={styles.line} />
            <Text style={styles.lineText}> Preço </Text>
          </View>

          <Picker
            topBarProps={undefined}
            showSearch={false}
            placeholder='Tipos de Produtos'
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            getOptionLabel={option => option?.label}
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            getOptionValue={option => option?.id}
            options={PRODUCT_TYPES}
            value={formik.values.productType}
            onValueChange={item => {
              formik.setFieldValue('productType', item.id);
            }}
            renderItem={(item, isSelected) => (
              <View padding-s4 row spread centerV>
                <View>
                  <Text text70 grey10 marginB-s1>
                    {item.label}
                  </Text>
                </View>
                {isSelected && <Feather name='check' size={22} />}
              </View>
            )}
          />

          {formik.values.productType === 2 ? (
            <TextField
              {...priceDeInputProps}
              ref={priceInputRef}
              label='De (POR)'
              autoComplete='postal-address'
              keyboardType='decimal-pad'
              returnKeyType='send'
              errorText={formik.errors.price2}
              error={Boolean(formik.errors.price2)}
              onSubmitEditing={() => {
                formik.handleSubmit();
              }}
            />
          ) : null}
          {formik.values.productType === 2 ? (
            <TextField
              {...priceInputProps}
              ref={priceInputRef}
              label='Preço(POR)'
              autoComplete='postal-address'
              keyboardType='decimal-pad'
              returnKeyType='send'
              errorText={formik.errors.price}
              error={Boolean(formik.errors.price)}
              onSubmitEditing={() => {
                formik.handleSubmit();
              }}
            />
          ) : null}

          {formik.values.productType === 3 ? (
            <TextField
              {...priceDeInputProps}
              ref={priceInputRef}
              label='varejo'
              autoComplete='postal-address'
              keyboardType='decimal-pad'
              returnKeyType='send'
              errorText={formik.errors.price2}
              error={Boolean(formik.errors.price2)}
              onSubmitEditing={() => {
                formik.handleSubmit();
              }}
            />
          ) : null}
          {formik.values.productType === 3 ? (
            <TextField
              {...priceInputProps}
              ref={priceInputRef}
              label='Atacado'
              autoComplete='postal-address'
              keyboardType='decimal-pad'
              returnKeyType='send'
              errorText={formik.errors.price}
              error={Boolean(formik.errors.price)}
              onSubmitEditing={() => {
                formik.handleSubmit();
              }}
            />
          ) : null}
          {formik.values.productType === 1 ? (
            <TextField
              {...priceInputProps}
              ref={priceInputRef}
              label='Preço(POR)'
              autoComplete='postal-address'
              keyboardType='decimal-pad'
              returnKeyType='send'
              errorText={formik.errors.price}
              error={Boolean(formik.errors.price)}
              onSubmitEditing={() => {
                formik.handleSubmit();
              }}
            />
          ) : null}

          <Button
            marginT-s8
            animateLayout
            text70BO
            label={!formik.isSubmitting ? 'Salvar' : undefined}
            disabled={formik.isSubmitting}
            onPress={formik.handleSubmit}>
            {formik.isSubmitting && <ActivityIndicator color={Colors.white} />}
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>
      <ActionSheet
        ref={actionSheetRef}
        options={[
          {
            title: 'Tirar foto',
            // icon: 'camera',
            onPress: handleCameraModalOpen,
          },
          {
            title: 'Galeria de fotos',
            // icon: 'image',
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onPress: handlePickImage,
          },
          {
            title: 'Pesquisar imagem do produto',
            // icon: 'image',
            onPress: handleNavigateToProductAutocomplete,
          },
        ]}
      />
    </>
  );
}
