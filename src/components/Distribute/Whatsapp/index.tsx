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
  TouchableOpacity,
  Typography,
} from 'react-native-ui-lib';
import Feather from 'react-native-vector-icons/Feather';
import { FormikErrors } from 'formik';
import { useQuery } from 'react-query';
import { HelperText } from '../../Form/HelperText';
import { ArtCard } from '../../ArtCard';
import { Picker } from '../../Picker';
import { SelectSendtoWhomWhatsApp } from '../../SelectSendToWhomWhatsAppDialog';
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

const PAGE_WIDTH = widthPercentageToDP('90%') - Spacings.s2;

const LINK_YOUTUBE = 'https://youtu.be/Lwixg8iwvqY';

export function Whatsapp({ withVideo, arts, values, errors, onChange }: WhatsappProps) {
  const [selectSendtoWhomWhatsAppIsOpen, setSelectSendtoWhomWhatsAppIsOpen] = useState<boolean>(false);

  const translateSendToWhom = useMemo(() => {
    return {
      private: 'Individual para meus contatos',
      group: `Grupos (${values.groups?.length})`,
    };
  }, [values.groups]);

  const instances = useQuery('whatsAppInstances', listWhatsAppInstanceService, {
    onSuccess: data => {
      onChange('instance', data[0]);
    },
  });

  const isConnected = useQuery(
    ['instanceConnection', values.instance?.id],
    () => checkWhatsAppInstanceConnectionService(values.instance?.id as number),
    {
      enabled: Boolean(values.instance?.id),
      onSuccess: instanceIsConnected => {
        onChange('instanceIsConnected', instanceIsConnected);
      },
    }
  );

  const handleChangeVisible = useCallback(() => {
    setSelectSendtoWhomWhatsAppIsOpen(prev => !prev);
  }, []);

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
            WhatsApp
          </Text>
          <View marginB-s6 paddingB-s3 style={styles.divider}>
            <Text marginT-s2 text80L color={Colors.grey30}>
              Envie mensagens no WhatsApp para seus grupos e contatos.
            </Text>
          </View>
          {instances.isLoading ? (
            <View flex center paddingT-s6>
              <LoaderScreen color={Colors.primary} message='Carregando...' overlay />
            </View>
          ) : (
            <>
              <View marginB-s4>
                <Text text70BO marginB-s2>
                  Qual número do WhatsApp deseja enviar?
                </Text>
                <TouchableOpacity onPress={() => Linking.openURL(LINK_YOUTUBE)} marginB-s2>
                  <Text text80BO color={Colors.blue40}>
                    Como conectar meu WhatsApp?
                  </Text>
                </TouchableOpacity>

                <Picker
                  loading={isConnected.isLoading}
                  severity={isConnected.data ? 'success' : 'error'}
                  topBarProps={undefined}
                  showSearch={false}
                  placeholder='Selecione uma instância'
                  getOptionLabel={option => option?.name}
                  getOptionValue={option => option?.id}
                  options={instances.data as WhatsAppInstance[]}
                  value={values.instance?.id}
                  onValueChange={item => {
                    onChange('instance', item);
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
                <Text text70BO marginB-s2>
                  Para quais contatos deseja enviar?
                </Text>
                <TouchableOpacity onPress={handleChangeVisible} style={[styles.picker, styles.textfieldSearch]}>
                  {isEmpty(values.sendToWhom) ? (
                    <Text text75 color={Colors.grey30}>
                      Selecione para quem enviar
                    </Text>
                  ) : (
                    map(values.sendToWhom, send => (
                      <Chip
                        key={send}
                        label={translateSendToWhom[send]}
                        marginR-s1
                        marginV-s1
                        labelStyle={{
                          color: Colors.grey10,
                        }}
                        containerStyle={{
                          borderColor: Colors.grey10,
                        }}
                      />
                    ))
                  )}

                  <Feather name='chevron-down' color={Colors.grey10} size={Typography.text50?.fontSize} />
                </TouchableOpacity>

                {errors?.sendToWhom ? (
                  <Text style={{ color: 'red' }}>{errors?.sendToWhom as string} </Text>
                ) : (
                  errors.groups && <Text style={{ color: 'red' }}>{errors.groups as string}</Text>
                )}

                <Text marginT-s1 text80L color={Colors.grey30}>
                  Contatos ativos são os que tiveram alguma interação dentro dos últimos 60 dias.
                </Text>
              </View>
              <View marginB-s4>
                <TextField
                  label='Adicionar número manualmente'
                  placeholder='Ex: 11999999999,11999999999'
                  autoCorrect={false}
                  autoCapitalize='sentences'
                  returnKeyType='next'
                  value={values.numbersInCopy}
                  onChangeText={numbersInCopy => {
                    onChange('numbersInCopy', numbersInCopy);
                  }}
                  numberOfLines={3}
                  error={Boolean(errors?.numbersInCopy)}
                  errorText={errors?.numbersInCopy as string}
                />
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

              <TextField
                label='Descrição do post'
                placeholder='Digite o texto...'
                autoCorrect={false}
                autoCapitalize='sentences'
                returnKeyType='done'
                value={values.text}
                onChangeText={text => {
                  onChange('text', text);
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
      <SelectSendtoWhomWhatsApp
        selectedGroups={values.groups}
        instanceId={values.instance?.id}
        visible={selectSendtoWhomWhatsAppIsOpen}
        selectedSendTo={values.sendToWhom}
        onClose={handleChangeVisible}
        onChangeSendTo={sendToWhom => onChange('sendToWhom', sendToWhom)}
        onSave={groupsId => onChange('groups', groupsId)}
      />
    </KeyboardAvoidingView>
  );
}
