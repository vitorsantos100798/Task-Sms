import { useNavigation } from '@react-navigation/native';
import { FormikErrors } from 'formik';
import React, { useCallback, useMemo } from 'react';
import { ActivityIndicator } from 'react-native';
import { Masks, useMaskedInputProps } from 'react-native-mask-input';
import { Colors, Text, View, Typography } from 'react-native-ui-lib';
import { useMutation } from 'react-query';

import { createThumbnail } from '../../services/fastModels';
import { DistributeArts } from '../../types/distribution';
import { AppScreenProp } from '../../types/navigation';
import { Store } from '../../types/store';
import { ArtCard } from '../ArtCard';
import { TextField } from '../TextField';
import styles from './styles';

type ArtPriceProps = {
  art: DistributeArts;
  arts: any;
  store: Store;
  errors: FormikErrors<any>;
  onChange: (key: string, value: string) => void;
};

export function ArtPrice({ errors, art, arts, store, onChange }: ArtPriceProps) {
  const { navigate } = useNavigation<AppScreenProp>();

  const newThumbnail = useMutation(
    async (data: DistributeArts) => {
      const response = await createThumbnail(data, store);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return response;
    },
    {
      onSuccess: response => {
        onChange(`arts.${art.artId}.url`, response[0].image_url);
        onChange(`arts.${art.artId}.design`, response[0].design_url);
        onChange(`arts.${art.artId}.preview`, response[0].preview_url);
      },
      onError: err => {
        console.log(err);
      },
    }
  );

  const handleEndEditing = useCallback(async (price: string, art: DistributeArts) => {
    await newThumbnail.mutateAsync({ ...art, price });
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const artURL = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return arts[art.artId]?.url || art.artURL;
  }, [arts, art.artId, art.artURL]);

  const phoneNumberInputProps = useMaskedInputProps({
    value: arts[art.artId]?.price,
    onChangeText: text => onChange(`arts.${art.artId}.price`, text),
    mask: Masks.BRL_CURRENCY,
  });

  return (
    <View paddingV-s4 style={styles.contentSubcategories}>
      <View marginB-s2 row centerV>
        <View center marginR-s2 style={styles.imageSubcategory}>
          {newThumbnail.isLoading ? (
            <ActivityIndicator color={Colors.primary} size={Typography.text40?.fontSize} />
          ) : (
            <ArtCard
              key={`${art.artId}-${art.artName}.${art.artURL}`}
              imageURL={artURL}
              // style={styles.imageSubcategory}
              isSelectable
              sharedElementId={`art.${art.artId}.image_url`}
              onPress={() => {
                navigate('ArtDetails', {
                  artId: art.artId,
                  artName: art.artName as string,
                  artURL,
                });
              }}
            />
          )}
        </View>

        <TextField
          {...phoneNumberInputProps}
          label={art.artName}
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onEndEditing={() => handleEndEditing(arts[art.artId]?.price, art)}
          keyboardType='decimal-pad'
          placeholder='Digite o preço'
          autoCorrect={false}
          autoCapitalize='none'
          returnKeyType='next'
          outlineColor={Colors.grey50}
          style={{ backgroundColor: Colors.white }}
        />
      </View>
      <Text color={Colors.grey30} text75BO>
        Este aparecerá nesta imagem
      </Text>
    </View>
  );
}
