import React, { useState, useCallback, useMemo } from 'react';
import { addMinutes } from 'date-fns';
import { isEmpty, map } from 'lodash';
import { ScrollView, Platform, KeyboardAvoidingView, Linking } from 'react-native';
import {
  Chip,
  Colors,
  Text,
  View,
  Carousel,
  Spacings,
  LoaderScreen,
} from 'react-native-ui-lib';
import { FormikErrors } from 'formik';
import { useQuery } from 'react-query';
import { ArtCard } from '../../ArtCard';
import { Picker } from '../../Picker';
import { DateTimePicker } from '../../DateTimePicker';
import { DistributeArts } from '../../../types/distribution';
import { WhatsAppInstance } from '../../../types/whatsAppInstance';
import {
  listWhatsAppInstanceService,
  checkWhatsAppInstanceConnectionService,
} from '../../../services/whatsAppInstance';
import { widthPercentageToDP, heightPercentageToDP } from '../../../utils/dimensions';
import styles from './styles';
import { VideoCard } from '../../VideoCard';
import { TextField } from '../../TextField';

type WhatsappProps = {
  withVideo: boolean;
  arts: DistributeArts[];
  values: any;
  errors: FormikErrors<any>;
  onChange: (key: string, value: any) => void;
};
 type SmsInstance = {
    id: number;
    name: string;
  };
type SendContact = {
    id: number;
    name: string;
  };
const TosendForContactForSms = [
    {
        name :'Ativos',
        id:1
    },
    {
        name :'Inativos',
        id:0
    },
    {
        name :'Todos',
        id:2
    }
]

const PAGE_WIDTH = widthPercentageToDP('90%') - Spacings.s2;


export function Sms({ withVideo, arts, values, errors, onChange }: WhatsappProps) {
  const instances = useQuery('SmsInstances', listWhatsAppInstanceService, {
    onSuccess: data => {
      onChange('instanciaSms', data[0]);
    },
  });

  const isConnected = useQuery(
    ['instanceConnection', values.instanciaSms?.id],
    () => checkWhatsAppInstanceConnectionService(values.instanciaSms?.id as number),
    {
      enabled: Boolean(values.instanciaSms?.id),
      onSuccess: instanceIsConnected => {
        onChange('instanceIsConnected', instanceIsConnected);
      },
    }
  );

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'android' ? undefined : 'padding'} style={{ flex: 1 }}>
      <ScrollView keyboardShouldPersistTaps='handled' showsVerticalScrollIndicator={false}>
        <View flex padding-page>
          <Text text60L marginB-s4>
            {withVideo ? 'Vídeos selecionados' : 'Imagens selecionadas'}
          </Text>
          <Carousel
            itemSpacings={Spacings.s2}
            pageWidth={PAGE_WIDTH}
            pageControlPosition={Carousel.pageControlPositions.UNDER}
            containerStyle={{
              height: heightPercentageToDP('40%'),
            }}
            pageControlProps={{
              size: 8,
              color: Colors.primary,
            }}>
            {withVideo
              ? arts.map(art => (
                  <VideoCard key={`${art.artId}-${art.artType}.${art.artURL}`} videoURL={art.artURL} isSelectable />
                ))
              : arts.map(art => (
                  <ArtCard key={`${art.artId}-${art.artType}.${art.artURL}`} imageURL={art.artURL} isSelectable />
                ))}
          </Carousel>
          <Text text60L marginT-s2>
            Sms
          </Text>
          <View marginB-s6 paddingB-s3 style={styles.divider}>
            <Text marginT-s2 text80L color={Colors.grey30}>
              Mensagens de SMS são enviadas para números da sua lista de contatos que você selecionar. Cada mensagem
              enviada consome 1 crédito
            </Text>
          </View>
          {instances.isLoading ? (
            <View flex center paddingT-s6>
              <LoaderScreen color={Colors.primary} message='Carregando...' overlay />
            </View>
          ) : (
            <>
              <View marginB-s4>
                <Picker
                  loading={isConnected.isLoading}
                  severity={isConnected.data ? 'success' : 'error'}
                  topBarProps={undefined}
                  showSearch={false}
                  placeholder='Selecione uma instância'
                  getOptionLabel={option => option?.name}
                  getOptionValue={option => option?.id}
                  options={instances.data as SmsInstance[]}
                  value={values.instanciaSms?.id}
                  onValueChange={item => {
                    onChange('instanciaSms', item);
                  }}
                />
                {errors?.instance ? (
                  <Text style={{ color: 'red' }}>{errors?.instance as string}</Text>
                ) : (
                  errors.instanceIsConnected && (
                    <Text style={{ color: 'red' }}>{errors.instanceIsConnected as string}</Text>
                  )
                )}
              </View>
              <View marginB-s4>
                <DateTimePicker
                  mode='date'
                  headerTitle=' Qual a data da publicação?'
                  placeholder='Data da publicação'
                  dateFormat='dd/MM/yyyy'
                  minimumDate={addMinutes(new Date(), 10)}
                  value={values.startDate}
                  onChange={date => {
                    onChange('startDate', date);
                  }}
                />
                {errors.startDate && <Text style={{ color: 'red' }}>{errors.startDate as string}</Text>}
              </View>
              <View marginB-s4>
                <DateTimePicker
                  mode='time'
                  headerTitle='Qual a hora da publicação?'
                  placeholder='Hora da publicação'
                  is24Hour
                  timeFormat='HH:mm'
                  minimumDate={addMinutes(new Date(), 2)}
                  value={values.startTime}
                  onChange={date => {
                    onChange('startTime', date);
                  }}
                />
                {errors.startTime && <Text style={{ color: 'red' }}>{errors.startTime as string}</Text>}
              </View>

              <View marginB-s4>
                <Picker
                  topBarProps={undefined}
                  showSearch={undefined}
                  placeholder={'Quais contatos enviar?'}
                  loading={false}
                  options={TosendForContactForSms as SendContact[]}
                  value={values.sendToWhomSms}
                  getOptionLabel={option => option?.name}
                  getOptionValue={option => option?.id}
                  onValueChange={item => {
                  onChange('sendToWhomSms', item.id);
                  }}
                />

                <Text marginT-s1 text80L color={Colors.grey30}>
                  <Text>Ativos:</Text> contatos com interação em 60 dias.
                </Text>
                <Text marginT-s1 text80L color={Colors.grey30}>
                  <Text>Inativos:</Text>contatos sem iniiteração em 60 dias.
                </Text>
              </View>
              <View marginB-s4>
                <TextField
                  label='Adicione números em cópia'
                  placeholder='Ex: 11999999999,11999999999'
                  autoCorrect={false}
                  autoCapitalize='sentences'
                  returnKeyType='next'
                  value={values.numbersInSmsCopy}
                  onChangeText={number => {
                    onChange('numbersInSmsCopy', number);
                  }}
                  numberOfLines={3}
                  error={Boolean(errors?.numbersInCopy)}
                  errorText={errors?.numbersInCopy as string}
                />
                <Text style={{ fontSize: 12, marginLeft: 5 }}>Adicione uma vírgula após cada número</Text>
              </View>

              <TextField
                label='Descrição do post'
                placeholder='Digite o texto...'
                autoCorrect={false}
                autoCapitalize='sentences'
                returnKeyType='done'
                value={values.smsPostDescription}
                onChangeText={text => {
                  onChange('smsPostDescription', text);
                }}
                multiline
                numberOfLines={10}
                error={Boolean(errors?.text)}
                errorText={errors?.text as string}
              />
            </>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
