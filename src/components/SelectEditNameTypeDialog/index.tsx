import { useNavigation } from '@react-navigation/native';
import { useFormik } from 'formik';
import React from 'react';
import { ActivityIndicator } from 'react-native';
import { Button, Colors, Dialog, PanningProvider, Text, TextField, View } from 'react-native-ui-lib';
import { useMutation } from 'react-query';
import * as Yup from 'yup';

import { useToast } from '../../hooks/useToast';
import { createCampaignService } from '../../services/campaigns';
import { queryClient } from '../../services/queryClient';
import { AppScreenProp } from '../../types/navigation';
import { widthPercentageToDP } from '../../utils/dimensions';
import styles from './styles';

export type NameType = 'String';

type FormValues = {
  name: string;
};

type ResponseCreateCampaign = {
  name: string;
  id: number;
};

// eslint-disable-next-line react-hooks/rules-of-hooks
const toast = useToast();

const validationSchema = Yup.object().shape({
  name: Yup.string().required('* obrigatório'),
});

type SelectNameTypeDialogProps = {
  visible: boolean;
  onRequestClose: () => void;
};

export function SelectNameTypeDialog({ visible, onRequestClose }: SelectNameTypeDialogProps) {
  const { navigate } = useNavigation<AppScreenProp>();

  const selectNameType = useMutation(
    async (data: FormValues) => {
      const response = await createCampaignService(data);

      return response;
    },
    {
      onSuccess: (data: ResponseCreateCampaign) => {
        toast.show('Campanha criada com sucesso!', {
          variant: 'success',
        });
        queryClient.invalidateQueries('campaigns');
        onRequestClose();
        navigate('Campaign', {
          campaignId: data.id,
          campaignName: data.name,
          activeTabIndex: 1,
        });
      },
      onError: () => {
        toast.show('Erro ao criar a campanha', {
          variant: 'error',
        });
      },
    }
  );

  const handleNameTypeChange = async (data: FormValues) => {
    await selectNameType.mutateAsync(data);
  };

  const formik = useFormik<FormValues>({
    initialValues: {
      name: '',
    },
    validationSchema,
    validateOnChange: false,
    onSubmit: handleNameTypeChange,
  });

  return (
    <Dialog
      visible={visible}
      height={250}
      onDismiss={onRequestClose}
      panDirection={PanningProvider.Directions.DOWN}
      width={widthPercentageToDP('90%')}
      containerStyle={{
        backgroundColor: Colors.white,
        borderRadius: 8,
      }}>
      <View flex>
        <View style={styles.header}>
          <Text text60M>Dê um nome a sua propaganda para começar</Text>
        </View>
        <View flex padding-page>
          <TextField
            placeholder='Nome da Propaganda'
            autoCorrect={false}
            autoCapitalize='none'
            returnKeyType='done'
            fieldStyle={styles.textfieldSearch}
            value={formik.values.name}
            onChangeText={formik.handleChange('name')}
            validationMessage={formik.errors.name}
            color={Colors.black}
          />
        </View>
        <View style={styles.actions}>
          <Button link label='Voltar' color={Colors.black} onPress={onRequestClose} />
          <Button
            disabled={formik.isSubmitting}
            label={!formik.isSubmitting ? 'Confirmar' : undefined}
            onPress={() => {
              formik.handleSubmit();
            }}>
            {formik.isSubmitting && <ActivityIndicator color={Colors.white} />}
          </Button>
        </View>
      </View>
    </Dialog>
  );
}
