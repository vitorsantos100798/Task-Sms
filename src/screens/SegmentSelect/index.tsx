/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-misused-promises */
// 👇️ ts-nocheck disables type checking for entire file
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { useNavigation } from '@react-navigation/native';
import { useFormik } from 'formik';
import React from 'react';
import { ActivityIndicator } from 'react-native';
import { Button, Colors, Text, Typography, View } from 'react-native-ui-lib';
import { useMutation, useQuery } from 'react-query';
import * as Yup from 'yup';

import { Picker } from '../../components/Picker';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { listFastService, newSegmentService } from '../../services/fastModels';
import { FastModels } from '../../types/fastModels';
import { AppScreenProp } from '../../types/navigation';
import styles from './styles';

const validationSchema = Yup.object().shape({
  segment: Yup.object().shape({
    id: Yup.number().required('Selecione um segmento'),
    description: Yup.string(),
  }),
});

export function SegmentSelect() {
  const toast = useToast();

  const { user, changeUser } = useAuth();

  const { navigate } = useNavigation<AppScreenProp>();

  const segments = useQuery('segments', listFastService);

  const newSegment = useMutation(
    async data => {
      const response = await newSegmentService(data as unknown as { id: number });
      return response;
    },
    {
      onSuccess: async segmentId => {
        const newUser = { ...user, segmentId };
        await changeUser(newUser);

        navigate('RootBottomTabNavigator', {});
        toast.show('Segmento atualizado com sucesso!', {
          variant: 'success',
        });
      },
    }
  );

  const handleConfirmateSegment = async (data: any) => {
    await newSegment.mutateAsync(data.segment);
  };

  const formik = useFormik({
    initialValues: { segment: {} },
    validateOnChange: false,
    validateOnMount: false,
    validationSchema,
    onSubmit: handleConfirmateSegment,
  });

  return (
    <View flex useSafeArea padding-page>
      <View flex centerV>
        <Text text60BO marginB-s6>
          Olá, {user.name}!
        </Text>

        <Text marginB-s6 grey30 text70BO style={{ lineHeight: 26 }}>
          A Datasales está sempre pensando em como podemos melhorar nossos produtos para facilitar o seu dia a dia. E
          por isso estamos com muitas novidades em breve para você. Para isso, precisamos que nos diga qual é o segmento
          que seu estabelecimento melhor se encaixa.
        </Text>
        {segments.isLoading ? (
          <ActivityIndicator color={Colors.primary} size={Typography.text50BO?.fontSize} />
        ) : (
          <>
            <Picker
              flex={false}
              topBarProps={undefined}
              showSearch={false}
              placeholder='Selecione o segmento'
              options={segments.data as FastModels[]}
              getOptionLabel={option => option?.description}
              getOptionValue={option => option?.id}
              onValueChange={item => formik.setFieldValue('segment', item)}
              value={formik.values.segment?.id}
            />
            <Text marginL-s4 marginT-s2 text90BO grey30>
              *Campo obrigatório
            </Text>
          </>
        )}
      </View>

      <Button
        disabled={formik.isSubmitting || !formik.values.segment?.id}
        onPress={formik.submitForm}
        label={!formik.isSubmitting ? 'Salvar e continuar' : undefined}>
        {formik.isSubmitting && <ActivityIndicator color={Colors.white} />}
      </Button>
    </View>
  );
}
