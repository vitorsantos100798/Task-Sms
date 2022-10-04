// 👇️ ts-nocheck disables type checking for entire file
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { FormikErrors } from 'formik';
import React from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Colors, Image, Text, View, Typography } from 'react-native-ui-lib';
import { useQuery } from 'react-query';

import { listStoreService } from '../../../services/stores';
import { DistributeArts } from '../../../types/distribution';
import { Store } from '../../../types/store';
import { ArtPrice } from '../../ArtPrice';
import { HelperText } from '../../Form/HelperText';
import { Picker } from '../../Picker';
import styles from './styles';

type PricesProps = {
  arts: DistributeArts[];
  values: any;
  errors: FormikErrors<any>;
  onChange: (key: string, value: any) => void;
};

export function Prices({ arts, values, errors, onChange }: PricesProps) {
  const stores = useQuery('stores', listStoreService, {
    onSuccess: response => {
      onChange('store', response[0]);
    },
  });

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'android' ? undefined : 'padding'} style={{ flex: 1 }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View marginB-s4 padding-page backgroundColor={Colors.grey70}>
          <Text text70BO marginB-s2>
            Selecione a loja
          </Text>
          <Text color={Colors.grey30} text75BO>
            As informações da loja selecionada aparecerão nas imagens abaixo. Por exempo: logo, endereço e número de
            telefone.
          </Text>

          {stores.isLoading ? (
            <View center paddingV-s4>
              <ActivityIndicator size={Typography.text60BO?.fontSize} color={Colors.primary} />
            </View>
          ) : (
            <View paddingV-s4 row style={styles.contentStore}>
              <Image
                marginR-s2
                source={{ uri: values.store?.logo_url }}
                style={styles.imageSubcategory}
                resizeMode='contain'
              />
              <Picker
                outlineColor={Colors.grey50}
                style={styles.pickerStore}
                topBarProps={undefined}
                showSearch={false}
                placeholder='Selecione uma loja'
                // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                getOptionLabel={option => option?.name}
                // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                getOptionValue={option => option?.id}
                options={stores.data as Store[]}
                value={values.store?.id}
                onValueChange={item => {
                  onChange('store', item);
                }}
              />

              {errors?.store && <HelperText error text={errors?.store as string} />}
            </View>
          )}

          <Text color={Colors.grey30} text75BO>
            As informações da loja selecionada aparecerá nas suas imagens
          </Text>
        </View>
        <View padding-page backgroundColor={Colors.grey70}>
          <Text text70BO marginB-s4>
            Coloque preço nos produtos
          </Text>

          {arts.map(art => (
            <ArtPrice
              key={art.artId.toString()}
              onChange={onChange}
              art={art}
              arts={values.arts}
              store={values.store}
              errors={errors}
            />
          ))}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
