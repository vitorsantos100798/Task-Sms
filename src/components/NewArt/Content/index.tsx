// 👇️ ts-nocheck disables type checking for entire file
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { useFormikContext } from 'formik';
import { map } from 'lodash';
import React, { useRef } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Masks, useMaskedInputProps } from 'react-native-mask-input';
import { Modalize } from 'react-native-modalize';
import { Avatar, Button, Colors, LoaderScreen, Text, View } from 'react-native-ui-lib';
import Feather from 'react-native-vector-icons/Feather';
import { useQuery } from 'react-query';

import { listStoreService } from '../../../services/stores';
import { CreateArtData } from '../../../types/art';
import { ColorPickerButton } from '../../ColorPickerButton';
import { ColorPickerModal } from '../../ColorPickerModal';
import { Picker } from '../../Picker';
import { TextField } from '../../TextField';
import style from '../style';

export function Content() {
  const descriptionInputRef = useRef<any>(null);
  const phoneNumberInputRef = useRef<any>(null);
  const textColorPickerModalRef = useRef<Modalize>(null);
  const priceColorPickerModalRef = useRef<Modalize>(null);

  const formik = useFormikContext<CreateArtData>();

  const phoneNumberInputProps = useMaskedInputProps({
    value: formik.values.store?.phone_number,
    onChangeText: formik.handleChange('store.phone_number'),
    mask: Masks.BRL_PHONE,
  });

  const stores = useQuery(
    'stores',
    async () => {
      const response = await listStoreService();

      return map(response, s => ({
        id: s.id,
        name: s.name,
        logo_url: s.logo_url,
        description: s.description,
        address: `${s.address}, ${s.street_number}, ${s.neighborhood}, ${s.zip_code},${s.city},${s.state}`,
        phone_number: s.whatsapp_phone_number,
      }));
    },
    {
      onSuccess: response => {
        formik.setFieldValue('store', response[0]);
      },
    }
  );

  function handleTextColorPickerOpen() {
    textColorPickerModalRef.current?.open();
  }

  function handlePriceColorPickerOpen() {
    priceColorPickerModalRef.current?.open();
  }

  function handleTextColorPickerClose() {
    textColorPickerModalRef.current?.close();
  }

  function handlePriceColorPickerClose() {
    priceColorPickerModalRef.current?.close();
  }

  return (
    <>
      <View style={style.container}>
        <Text primary text65BL marginV-s2>
          5. Adicione as informações da sua loja
        </Text>
        <Text text750BL color={Colors.grey20}>
          Adicione as informações da sua loja que aparecerão nas artes
        </Text>
      </View>
      {stores.isLoading ? (
        <View flex center>
          <LoaderScreen color={Colors.primary} message='Carregando...' overlay />
        </View>
      ) : (
        <KeyboardAvoidingView behavior={Platform.OS === 'android' ? undefined : 'padding'} style={{ flex: 1 }}>
          <ScrollView keyboardShouldPersistTaps='handled' showsVerticalScrollIndicator={false}>
            {stores.data && (
              <Picker<typeof stores.data[0]>
                placeholder='Loja'
                topBarProps={{ title: 'Lojas' }}
                getOptionLabel={option => option?.name}
                getOptionValue={option => option.id}
                options={stores.data}
                value={formik.values.store?.id}
                onValueChange={item => {
                  formik.setFieldValue('store', item);
                }}
                renderItem={(item, isSelected) => (
                  <View padding-s4 row spread centerV>
                    <View row centerV>
                      <Avatar size={35} source={{ uri: item?.logo_url }} />
                      <Text text70 grey10 marginL-s2>
                        {item?.name}
                      </Text>
                    </View>
                    {isSelected && <Feather name='check' size={22} />}
                  </View>
                )}
              />
            )}
            <TextField
              label='Endereço'
              autoCorrect={false}
              autoCapitalize='none'
              returnKeyType='next'
              value={formik.values.store?.address}
              onChangeText={formik.handleChange('store.address')}
              errorText={formik.errors.store?.address}
              error={Boolean(formik.errors.store?.address)}
              onSubmitEditing={() => {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
                phoneNumberInputRef.current?.focus();
              }}
            />
            <TextField
              ref={phoneNumberInputRef}
              {...phoneNumberInputProps}
              label='Celular'
              keyboardType='number-pad'
              autoCapitalize='none'
              returnKeyType='next'
              errorText={formik.errors.store?.phone_number}
              error={Boolean(formik.errors.store?.phone_number)}
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
              value={formik.values.store?.description}
              onChangeText={formik.handleChange('store.description')}
              errorText={formik.errors.store?.description}
              error={Boolean(formik.errors.store?.description)}
              description='Exemplo: oferta válida até dia mm/aa'
            />
            <ColorPickerButton
              marginV-s4
              label='Selecionar cor do texto'
              color={formik.values.colors?.text}
              description='Escolha a cor do texto da etiqueta'
              onPress={handleTextColorPickerOpen}
            />

            <ColorPickerButton
              label='Selecionar cor do preço'
              color={formik.values.colors?.price}
              description='Escolha a cor do texto do produto'
              onPress={handlePriceColorPickerOpen}
            />
          </ScrollView>
          <Button
            disabled={formik.isSubmitting}
            color={Colors.white}
            marginT-s4
            animateLayout
            label={formik.isSubmitting ? undefined : 'Salvar e gerar arte'}
            onPress={formik.handleSubmit}>
            {formik.isSubmitting && <ActivityIndicator color={Colors.white} />}
          </Button>
        </KeyboardAvoidingView>
      )}

      <ColorPickerModal
        ref={textColorPickerModalRef}
        initialColor='#FFF'
        title='Cor do texto'
        color={formik.values.colors.text}
        onChange={formik.handleChange('colors.text')}
        onRequestClose={handleTextColorPickerClose}
      />
      <ColorPickerModal
        ref={priceColorPickerModalRef}
        title='Cor do preço'
        initialColor='#000'
        color={formik.values.colors.price}
        onChange={formik.handleChange('colors.price')}
        onRequestClose={handlePriceColorPickerClose}
      />
    </>
  );
}
