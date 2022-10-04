// 👇️ ts-nocheck disables type checking for entire file
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { useNavigation } from '@react-navigation/native';
import { addDays, addMinutes } from 'date-fns';
import { FormikErrors } from 'formik';
import React, { useEffect, useMemo } from 'react';
import { ScrollView, ActivityIndicator, Platform, KeyboardAvoidingView } from 'react-native';
import MapView, { Circle } from 'react-native-maps';
import { Colors, Text, View, Carousel, Spacings, TouchableOpacity, Chip } from 'react-native-ui-lib';
import Feather from 'react-native-vector-icons/Feather';
import { useQuery } from 'react-query';

import { findPlaceDetailsService } from '../../../services/placeAutocomplete';
import { getUserBalanceService } from '../../../services/user';
import { DistributeArts } from '../../../types/distribution';
import { AppScreenProp } from '../../../types/navigation';
import { CAMPAIGN_OBJECTIVES, REACH } from '../../../utils/constants';
import { widthPercentageToDP, heightPercentageToDP } from '../../../utils/dimensions';
import { ArtCard } from '../../ArtCard';
import { DateTimePicker } from '../../DateTimePicker';
import { HelperText } from '../../Form/HelperText';
import { Picker } from '../../Picker';
import { TextField } from '../../TextField';
import { VideoCard } from '../../VideoCard';
import styles from './styles';

type TurbochargedActionProps = {
  placeId?: string;
  withVideo: boolean;
  arts: DistributeArts[];
  values: any;
  errors: FormikErrors<any>;
  onChange: (key: string, value: any) => void;
};

const PAGE_WIDTH = widthPercentageToDP('90%') - Spacings.s2;

export function TurbochargedAction({ arts, values, errors, placeId, withVideo, onChange }: TurbochargedActionProps) {
  const { navigate } = useNavigation<AppScreenProp>();

  useEffect(() => {
    async function fetchPlaceDetails() {
      const response = await findPlaceDetailsService(placeId as string);

      const {
        name,
        vicinity,
        geometry: { location },
      } = response;

      onChange('location', {
        name,
        description: vicinity,
        latitude: location.lat,
        longitude: location.lng,
        radius: '2',
      });
    }
    if (placeId) {
      fetchPlaceDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placeId]);

  const balance = useQuery('balance', getUserBalanceService);

  const sliderMaximumValue = useMemo(() => {
    if (!balance.data) return;

    if (balance.data > 5) {
      return 5;
    }

    return balance.data;
  }, [balance.data]);

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'android' ? undefined : 'padding'} style={{ flex: 1 }}>
      <ScrollView keyboardShouldPersistTaps='handled' showsVerticalScrollIndicator={false}>
        <View center backgroundColor={Colors.violet80} padding-s3>
          {balance.isLoading ? (
            <ActivityIndicator color={Colors.white} size={20} />
          ) : (
            <Text text80BO>Você possui {balance.data} créditos de ação turbinada</Text>
          )}
        </View>
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
            Ação turbinada
          </Text>
          <View marginB-s6 paddingB-s3 style={styles.divider}>
            <Text marginT-s2 text80L color={Colors.grey30}>
              As publicações do tipo de ação turbinada não aparecem no perfil das suas redes sociais. Elas aparecem
              apenas para as pessoas das quais você seleciona no perfil abaixo.
            </Text>
          </View>

          <View marginB-s4 paddingB-s6 style={styles.divider}>
            <Text text70BO>Objetivo da publicação</Text>

            <Text marginB-s4 text80L color={Colors.grey30}>
              Esta publicação atingirá entre {REACH[values.credits as 1 | 2 | 3 | 4 | 5]} pessoas
            </Text>

            <Picker
              topBarProps={undefined}
              showSearch={false}
              placeholder='Objetivo da publicação'
              // eslint-disable-next-line @typescript-eslint/no-unsafe-return
              getOptionLabel={option => option?.label}
              // eslint-disable-next-line @typescript-eslint/no-unsafe-return
              getOptionValue={option => option?.value}
              options={CAMPAIGN_OBJECTIVES}
              value={values.objective?.value}
              onValueChange={item => {
                onChange('objective', item);
              }}
              renderItem={(item, isSelected) => (
                <View padding-s4 row spread centerV>
                  <View>
                    <Text text70 grey10 marginB-s1>
                      {item.label}
                    </Text>
                    <Text text70 grey30>
                      {item.description}
                    </Text>
                  </View>
                  {isSelected && <Feather name='check' size={22} />}
                </View>
              )}
            />

            <Text marginV-s4 text80L color={Colors.grey30}>
              Essa ação vai consumir {values.credits} créditos
            </Text>
            <View row spread>
              {Array.from({ length: sliderMaximumValue as number }, (_, number) => (
                <Chip
                  key={number.toString()}
                  size={{
                    width: widthPercentageToDP('15%'),
                    height: 20,
                  }}
                  backgroundColor={values.credits === number + 1 ? Colors.secondary : undefined}
                  labelStyle={{
                    color: values.credits === number + 1 ? Colors.white : undefined,
                  }}
                  onPress={() => onChange('credits', number + 1)}
                  label={Number(number + 1).toString()}
                />
              ))}
            </View>
          </View>
          <View marginB-s4 paddingB-s6 style={styles.divider}>
            <Text text70BO marginB-s2>
              Selecione a faixa etária do seu público
            </Text>
            <View row spread>
              <View width='53%'>
                <DateTimePicker
                  mode='date'
                  headerTitle='Data de início'
                  placeholder='Data de início'
                  dateFormat='dd/MM/yyyy'
                  minimumDate={addMinutes(new Date(), 10)}
                  value={values.startDate}
                  onChange={date => {
                    onChange('startDate', date);
                  }}
                />
                {errors.startDate && <Text style={{ color: 'red' }}>{errors.startDate as string}</Text>}
              </View>
              <View width='45%'>
                <DateTimePicker
                  mode='time'
                  headerTitle='Hora de inicio'
                  placeholder='Hora de inicio'
                  is24Hour
                  timeFormat='HH:mm'
                  value={values.startTime}
                  onChange={date => {
                    onChange('startTime', date);
                  }}
                />
                {errors.startTime && <Text style={{ color: 'red' }}>{errors.startTime as string}</Text>}
              </View>
            </View>
            <View row spread>
              <View width='53%'>
                <DateTimePicker
                  mode='date'
                  headerTitle='Data de término'
                  placeholder='Data de término'
                  is24Hour
                  dateFormat='dd/MM/yyyy'
                  minimumDate={addDays(values.startDate || new Date(), 1)}
                  maximumDate={addDays(values.startDate || new Date(), values.credits)}
                  value={values.endDate}
                  onChange={date => {
                    onChange('endDate', date);
                  }}
                />
                {errors.endDate && <Text style={{ color: 'red' }}>{errors.endDate as string}</Text>}
              </View>
              <View width='45%'>
                <DateTimePicker
                  mode='time'
                  headerTitle='Hora de término'
                  placeholder='Hora de término'
                  is24Hour
                  timeFormat='HH:mm'
                  value={values.endTime}
                  onChange={date => {
                    onChange('endTime', date);
                  }}
                />
                {errors.endTime && <Text style={{ color: 'red' }}>{errors.endTime as string}</Text>}
              </View>
            </View>

            <TextField
              onPressIn={() => {
                navigate('PlaceAutocomplete');
              }}
              autoCorrect={false}
              autoCapitalize='sentences'
              label='Localização'
              value={values.location.name}
              errorText={errors.location?.latitude}
              error={Boolean(errors.location?.latitude)}
            />
            <TextField
              label='Raio em km'
              placeholder='Raio em km da localização'
              keyboardType='number-pad'
              value={values.location.radius}
              onChangeText={text => onChange('location.radius', text)}
              errorText='Localização inválida'
              error={Boolean(errors?.location?.radius)}
            />

            {values.location.latitude && values.location.longitude && (
              <MapView
                region={{
                  latitude: values.location?.latitude,
                  longitude: values.location?.longitude,
                  latitudeDelta: (0.0922 * Number(values.location.radius)) / 4,
                  longitudeDelta: (0.0421 * Number(values.location.radius)) / 4,
                }}
                zoomEnabled={false}
                scrollEnabled={false}
                style={styles.mapContainer}>
                <Circle
                  radius={Number(values.location.radius) * 1000}
                  fillColor='rgba(219, 215, 235, 0.5)'
                  strokeColor={Colors.primary}
                  center={{
                    latitude: values.location?.latitude,
                    longitude: values.location?.longitude,
                  }}
                />
              </MapView>
            )}
          </View>
          <View>
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
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
