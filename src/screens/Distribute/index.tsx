/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// 👇️ ts-nocheck disables type checking for entire file
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useFormik } from 'formik';
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import { Button, Colors, TabController, View, Wizard, Text } from 'react-native-ui-lib';
import { useMutation } from 'react-query';
import * as yup from 'yup';

import { ConfirmateDistributeDialog } from '../../components/ConfirmateDistributeDialog';
import { Prices } from '../../components/Distribute/Prices';
import { SocialNetwork } from '../../components/Distribute/SocialNetwork';
import { Sms } from '../../components/Distribute/Sms';
import { TurbochargedAction } from '../../components/Distribute/TurbochargedAction';
import { Whatsapp } from '../../components/Distribute/Whatsapp';
import { WhereToDistribute } from '../../components/Distribute/WhereToDistribute';
import { SuccessDistributeDialog } from '../../components/SuccessDistributeDialog';
import { useToast } from '../../hooks/useToast';
import { distributeToCustomersService, distributeValidateFields } from '../../services/distribution';
import { createArtService } from '../../services/fastModels';
import { queryClient } from '../../services/queryClient';
import { Slug, DistributeToCustomersData, SlugSendToWhatsApp } from '../../types/distribution';
import { AppStackParamList } from '../../types/navigation';
import { SOCIAL_CHANNELS, CAMPAIGN_OBJECTIVES } from '../../utils/constants';
import styles from './styles';

const validationSchema = yup.object().shape({
  store: yup
    .object({
      id: yup.number().nullable(),
      logo_url: yup.string().nullable(),
      name: yup.string(),
    })
    .required('Selecione uma loja'),
  socialChannels: yup
    .array()
    .of(
      yup.object().shape({
        label: yup.string(),
        value: yup.string().required('Campo obrigatório'),
      })
    )
    .min(1, 'Selecione pelo menos uma rede')
    .required('Campo obrigatório'),
  sendToWhom: yup
    .array()
    .of(yup.string().required('Campo obrigatório'))
    .min(1, 'Selecione pelo menos um contato para enviar')
    .required('Campo obrigatório'),
  profile: yup
    .object()
    .shape({
      fb_user_id: yup.number().required('Campo obrigatório'),
      page_id: yup.number(),
    })
    .nullable()
    .required('Selecione uma conta'),
  instance: yup.object({ id: yup.number(), name: yup.string() }).required('Selecione uma instância'),
  instanceIsConnected: yup.bool().oneOf([true], 'Instância sem conexão'),
  groups: yup
    .array()
    .when('sendToWhom', {
      is: (sendToWhom: SlugSendToWhatsApp[]) => sendToWhom.some(sendTo => sendTo === 'group'),
      then: yup
        .array()
        .of(yup.string().required('Campo obrigatório'))
        .min(1, 'Selecione pelo menos um grupo')
        .required('Campo obrigatório'),
    })
    .notRequired()
    .default(undefined),
  startDate: yup.date().required('Campo obrigatório'),
  startTime: yup.date().required('Campo obrigatório'),
  endDate: yup.date().required('Campo obrigatório'),
  endTime: yup.date().required('Campo obrigatório'),
  location: yup
    .object({
      name: yup.string().required('Campo obrigatório'),
      description: yup.string().required('Campo obrigatório'),
      latitude: yup.number().required('Campo obrigatório'),
      longitude: yup.number().required('Campo obrigatório'),
      radius: yup.string().required('Campo obrigatório'),
    })
    .required('Campo obrigatório'),
  objective: yup
    .object({
      label: yup.string(),
      value: yup.string().required('Campo obrigatório'),
    })
    .required('Campo obrigatório'),
  credits: yup.number().min(1).max(5).required('Campo obrigatório'),
});

export function Distribute() {
  const {
    params: { campaignId, arts, placeId, isFastModels },
  } = useRoute<RouteProp<AppStackParamList, 'Distribute'>>();
  const { goBack } = useNavigation();
  const toast = useToast();
  const [validatingForm, setValidatingForm] = useState<boolean>(false);
  const [countValidating, setCountValidating] = useState<number>(0);
  const [distributeErrors, setDistributeErrors] = useState<string[]>();
  const [confirmateDistributeDialogIsOpen, setConfirmateDistributeDialogIsOpen] = useState<boolean>(false);
  const [successDistributeDialogIsOpen, setSuccessDistributeDialogIsOpen] = useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [steps, setSteps] = useState<Slug[]>(['where-to-distribute']);
  const formik = useFormik({
    initialValues: {
      campaignId,
      socialChannels: arts.length > 1 ? [SOCIAL_CHANNELS[1]] : SOCIAL_CHANNELS,
      startDate: new Date(),
      startTime: new Date(),
      objective: CAMPAIGN_OBJECTIVES[0],
      sendToWhom: [],
      groups: [],
      credits: 1,
      location: {},
      arts: {},
      instanciaSms:'',
      sendToWhomSms: '',
      numbersInSmsCopy:'',
      smsPostDescription:'',
    } as any,
    onSubmit: () => {},
    validationSchema,
    validateOnChange: false,
    validateOnBlur: false,
  });
console.log("Numeros em copia",formik.values.numbersInSmsCopy)
  const selectedArts = useMemo(() => {
    return arts.map(art => ({
      ...art,
      artURL: formik.values.arts[art.artId]?.url || art.artURL,
      designURL: formik.values.arts[art.artId]?.design || art.designURL,
    }));
  }, [arts, formik.values.arts]);

  useEffect(() => {
    if (isFastModels) {
      setSteps(prev => ['prices', ...prev]);
    }
  }, [isFastModels]);

  const findOrCreateCampaing = useMutation(async (data: any) => {
    const response = await createArtService(data.artsWithPrice, data.arts);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return response;
  });

  const newCampaignId = useMemo(() => {
    if (findOrCreateCampaing?.data) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return findOrCreateCampaing?.data[0]?.content?.offer_id;
    }
    return campaignId;
  }, [findOrCreateCampaing.data]);

  const distributeToCustomers = useMutation(
    async (data: any) => {
      const response = await distributeToCustomersService({
        ...data,
        campaignId: newCampaignId,
        arts: selectedArts,
        steps,
      } as DistributeToCustomersData);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return response;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['campaign', newCampaignId]);
      },
      onError: () => {
        toast.show('Erro ao distribuir', {
          variant: 'error',
        });
      },
    }
  );

  const handleDistribute = async () => {
    const { errors } = await distributeToCustomers.mutateAsync(formik.values);

    if (errors && errors.length) {
      setDistributeErrors(errors);
    }

    setConfirmateDistributeDialogIsOpen(false);
    setSuccessDistributeDialogIsOpen(true);
  };

  const handleChangeForm = useCallback(
    (key: string, value: any) => {
      formik.setFieldValue(key, value);
    },
    [formik]
  );

  const channelsDistribute = useMemo(() => {
    return steps.filter(step => step !== 'where-to-distribute' && step !== 'prices');
  }, [steps]);

  const stepsQuantity = useMemo(() => {
    return steps.length;
  }, [steps]);
  const translateStep = () => {
    return {
      prices: (
        <View style={styles.FormatTabControllerTextContainer}>
          <Text style={steps[selectedIndex] === 'prices' ? styles.NumberSelect : styles.NumberDeselect}>1</Text>
          <Text style={steps[selectedIndex] === 'prices' ? styles.TextSelect : styles.TextDeselect}>Preços</Text>
        </View>
      ),
      'where-to-distribute': (
        <View style={styles.FormatTabControllerTextContainer}>
          <Text style={steps[selectedIndex] === 'where-to-distribute' ? styles.NumberSelect : styles.NumberDeselect}>
            2
          </Text>
          <Text style={steps[selectedIndex] === 'where-to-distribute' ? styles.TextSelect : styles.TextDeselect}>
            Onde distribuir
          </Text>
        </View>
      ),
      whatsapp: (
        <View style={styles.FormatTabControllerTextContainer}>
          <Text style={steps[selectedIndex] === 'whatsapp' ? styles.NumberSelect : styles.NumberDeselect}>
            {steps[selectedIndex] === 'whatsapp'
              ? selectedIndex + 1
              : steps[2] === 'whatsapp'
              ? 3
              : steps[3] === 'whatsapp'
              ? 4
              : steps[4] === 'whatsapp'
              ? 5
              : false}
          </Text>
          <Text style={steps[selectedIndex] === 'whatsapp' ? styles.TextSelect : styles.TextDeselect}>WhatsApp</Text>
        </View>
      ),
      'social-network': (
        <View style={styles.FormatTabControllerTextContainer}>
          <Text style={steps[selectedIndex] === 'social-network' ? styles.NumberSelect : styles.NumberDeselect}>
            {' '}
            {steps[selectedIndex] === 'social-network'
              ? selectedIndex + 1
              : steps[2] === 'social-network'
              ? 3
              : steps[3] === 'social-network'
              ? 4
              : steps[4] === 'social-network'
              ? 5
              : false}
          </Text>
          <Text style={steps[selectedIndex] === 'social-network' ? styles.TextSelect : styles.TextDeselect}>
            Redes sociais
          </Text>
        </View>
      ),
      'turbocharged-action': (
        <View style={styles.FormatTabControllerTextContainer}>
          <Text style={steps[selectedIndex] === 'turbocharged-action' ? styles.NumberSelect : styles.NumberDeselect}>
            {steps[selectedIndex] === 'turbocharged-action'
              ? selectedIndex + 1
              : steps[2] === 'turbocharged-action'
              ? 3
              : steps[3] === 'turbocharged-action'
              ? 4
              : steps[4] === 'turbocharged-action'
              ? 5
              : false}
          </Text>
          <Text style={steps[selectedIndex] === 'turbocharged-action' ? styles.TextSelect : styles.TextDeselect}>
            Ação turbinada
          </Text>
        </View>
      ),
      sms: (
        <View style={styles.FormatTabControllerTextContainer}>
          <Text style={steps[selectedIndex] === 'sms' ? styles.NumberSelect : styles.NumberDeselect}>
            {steps[selectedIndex] === 'sms'
              ? selectedIndex + 1
              : steps[2] === 'sms'
              ? 3
              : steps[3] === 'sms'
              ? 4
              : steps[4] === 'sms'
              ? 5
              : false}
          </Text>
          <Text style={steps[selectedIndex] === 'sms' ? styles.TextSelect : styles.TextDeselect}>SMS</Text>
        </View>
      ),
    };
  };
  const buttonLabelGoNext = useMemo(() => {
    const hasFastModels = isFastModels ? 2 : 1;

    return formik.isValidating
      ? undefined
      : selectedIndex + 1 === stepsQuantity && stepsQuantity > hasFastModels
      ? 'Distribuir'
      : 'Continuar';
  }, [formik.isValidating, selectedIndex, stepsQuantity, isFastModels]);

  const buttonDisabledGoNext = useMemo(() => {
    if (isFastModels) {
      const filledPriceFields = selectedArts.some(art => {
        const price = parseFloat(formik.values.arts[art.artId]?.price?.split('$')[1]?.replace(',', '.'));

        return !formik.values.arts[art.artId] || !formik.values.arts[art.artId]?.design || !price;
      });

      return (
        formik.isValidating ||
        filledPriceFields ||
        (stepsQuantity === 2 && steps[selectedIndex] === 'where-to-distribute')
      );
    }
    return formik.isValidating || stepsQuantity === 1;
  }, [formik.isValidating, selectedIndex, stepsQuantity, steps, isFastModels, formik.values.arts]);

  const hasVideoInArts = useMemo(() => {
    return selectedArts.some(art => art.artURL.endsWith('.mp4'));
  }, [selectedArts]);

  const generateCampaignId = useCallback(async () => {
    await findOrCreateCampaing.mutateAsync({
      artsWithPrice: formik.values.arts,
      arts: selectedArts,
    });
  }, [selectedArts, formik.values]);

  const handleGoBack = useCallback(() => {
    if (selectedIndex === 0) {
      setSteps([]);
      goBack();
    } else {
      formik.setErrors({});
      setSelectedIndex(prev => prev - 1);
    }
  }, [formik.setErrors, selectedIndex]);

  const handleGoNext = useCallback(async () => {
    if (isFastModels) {
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      await distributeValidateFields(formik, steps[selectedIndex], generateCampaignId);
    } else {
      await distributeValidateFields(formik, steps[selectedIndex]);
    }
    setCountValidating(prev => prev + 1);
  }, [isFastModels, formik.values, selectedIndex, steps]);

  useEffect(() => {
    if (countValidating !== 0) {
      if (formik.isValid && selectedIndex + 1 < stepsQuantity) {
        setSelectedIndex(prev => prev + 1);
      } else if (!formik.isValid) {
        toast.show('Preencha todos os campos obrigatórios', {
          variant: 'error',
        });
      } else if (selectedIndex + 1 === stepsQuantity) {
        setConfirmateDistributeDialogIsOpen(true);
      }
    }
  }, [countValidating]);

  const handleSuccessDistributeDialogClose = useCallback(() => {
    setSuccessDistributeDialogIsOpen(false);
    goBack();
  }, []);

  return (
    <View flex useSafeArea paddingT-page>
      <TabController
        initialIndex={selectedIndex}
        onChangeIndex={setSelectedIndex}
        items={
          steps.length <= 1
            ? [{ label: translateStep()['where-to-distribute'] }, { label: '' }]
            : steps.map(step => ({
                label: translateStep()[step],
                ignore: true,
              }))
        }>
        <TabController.TabBar
          faderProps={{ size: 10 }}
          centerSelected
          indicatorInsets={selectedIndex}
          selectedLabelColor={Colors.primary}
        />
        <View flex>
          <TabController.TabPage index={steps.findIndex(step => step === 'prices')}>
            <Prices onChange={handleChangeForm} values={formik.values} errors={formik.errors} arts={selectedArts} />
          </TabController.TabPage>
          <TabController.TabPage index={steps.findIndex(step => step === 'where-to-distribute')}>
            <WhereToDistribute channelSelected={steps} onChangeChannel={setSteps} />
          </TabController.TabPage>
          <TabController.TabPage index={steps.findIndex(step => step === 'social-network')}>
            <SocialNetwork
              onChange={handleChangeForm}
              values={formik.values}
              errors={formik.errors}
              arts={selectedArts}
              withVideo={hasVideoInArts}
            />
          </TabController.TabPage>
          <TabController.TabPage index={steps.findIndex(step => step === 'whatsapp')}>
            <Whatsapp
              onChange={handleChangeForm}
              values={formik.values}
              errors={formik.errors}
              arts={selectedArts}
              withVideo={hasVideoInArts}
            />
          </TabController.TabPage>
          <TabController.TabPage index={steps.findIndex(step => step === 'turbocharged-action')}>
            <TurbochargedAction
              onChange={handleChangeForm}
              values={formik.values}
              errors={formik.errors}
              arts={selectedArts}
              placeId={placeId}
              withVideo={hasVideoInArts}
            />
          </TabController.TabPage>
          <TabController.TabPage index={steps.findIndex(step => step === 'sms')}>
            <Sms
            onChange={handleChangeForm}
            values={formik.values}
            errors={formik.errors}
            arts={selectedArts}
            withVideo={hasVideoInArts}
            
            />
          </TabController.TabPage>
        </View>
      </TabController>
      <View row style={styles.footerContent}>
        <Button onPress={handleGoBack} backgroundColor={Colors.transparent} color={Colors.black} label='Voltar' />

        <Button onPress={handleGoNext} disabled={buttonDisabledGoNext} label={buttonLabelGoNext}>
          {validatingForm && <ActivityIndicator color={Colors.white} />}
        </Button>
      </View>
      <ConfirmateDistributeDialog
        visible={confirmateDistributeDialogIsOpen}
        title='Confirmar distribuição'
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        channels={channelsDistribute.map(step => translateStep()[step])}
        onClose={() => setConfirmateDistributeDialogIsOpen(false)}
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onConfirmate={handleDistribute}
        loading={distributeToCustomers.isLoading}
      />
      <SuccessDistributeDialog
        onClose={handleSuccessDistributeDialogClose}
        visible={successDistributeDialogIsOpen}
        errors={distributeErrors}
        title={
          distributeErrors && distributeErrors.length ? 'Distribuição concluída em partes' : 'Distribuição concluída'
        }
      />
    </View>
  );
}
