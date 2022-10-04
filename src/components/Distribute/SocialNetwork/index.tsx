// 👇️ ts-nocheck disables type checking for entire file
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { addMinutes } from 'date-fns';
import { FormikErrors } from 'formik';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, Platform, KeyboardAvoidingView, ActivityIndicator, Linking } from 'react-native';
import { Modalize } from 'react-native-modalize';
import {
  Colors,
  Text,
  View,
  Carousel,
  Spacings,
  LoaderScreen,
  TouchableOpacity,
  Typography,
} from 'react-native-ui-lib';
import { useQuery, useMutation } from 'react-query';

import { useToast } from '../../../hooks/useToast';
import { queryClient } from '../../../services/queryClient';
import {
  listSocialProfileService,
  createAccessTokenFacebookInstagram,
  activatePagesFacebookInstagram,
} from '../../../services/socialProfiles';
import { DistributeArts } from '../../../types/distribution';
import { SocialProfile, SocialProfilePages } from '../../../types/socialProfile';
import { SOCIAL_CHANNELS } from '../../../utils/constants';
import { widthPercentageToDP, heightPercentageToDP } from '../../../utils/dimensions';
import { ArtCard } from '../../ArtCard';
import { DateTimePicker } from '../../DateTimePicker';
import { HelperText } from '../../Form/HelperText';
import { Picker } from '../../Picker';
import { PickerMultiple } from '../../PickerMultiple';
import { SelectPagesModal } from '../../SelectPagesModal';
import { TextField } from '../../TextField';
import { VideoCard } from '../../VideoCard';
import styles from './styles';

type SocialNetworkProps = {
  arts: DistributeArts[];
  withVideo: boolean;
  values: any;
  errors: FormikErrors<any>;
  onChange: (key: string, value: any) => void;
};

const PAGE_WIDTH = widthPercentageToDP('90%') - Spacings.s2;

const LINK = 'https://www.instagram.com/accounts/convert_to_professional_account/';

export function SocialNetwork({
  withVideo,
  arts,
  values,
  errors,

  onChange,
}: SocialNetworkProps) {
  const toast = useToast();
  const selectPagesModalRef = useRef<Modalize>(null);

  const profiles = useQuery('profiles', listSocialProfileService, {
    onSuccess: profiles => {
      const selectedProfile = profiles[0];
      onChange('profile', profiles.length > 0 ? selectedProfile : null);
    },
  });

  const [isInstagramBusinessAccount, setIsInstagramBusinessAccount] = useState<number>(1);

  const connectFacebook = useMutation(
    async () => {
      const response = await createAccessTokenFacebookInstagram();
      return response;
    },
    {
      onSuccess: () => {
        selectPagesModalRef.current?.open();
      },
      onError: err => {
        toast.show('Não foi possível vincular a conta do Facebook', {
          variant: 'error',
        });
      },
    }
  );

  const activePagesFacebook = useMutation(
    async (data: { pages: string[]; userID?: string }) => {
      const response = await activatePagesFacebookInstagram(data.pages, data.userID);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return response;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['profiles']);
        selectPagesModalRef.current?.close();
        toast.show('Páginas ativadas com sucesso', {
          variant: 'success',
        });
      },
      onError: () => {
        toast.show('Não foi possível ativar as páginas', {
          variant: 'error',
        });
      },
    }
  );

  const handleConnectFacebook = useCallback(async () => {
    await connectFacebook.mutateAsync();
  }, []);

  const handleActivatePages = useCallback(
    async (pages: string[]) => {
      await activePagesFacebook.mutateAsync({
        pages,
        userID: connectFacebook.data?.userID,
      });
    },
    [connectFacebook.data]
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
            Redes sociais
          </Text>
          <View marginB-s6 paddingB-s3 style={styles.divider}>
            <Text marginT-s2 text80L color={Colors.grey30}>
              Poste no feed da sua página do Facebook e/ou no feed do seu perfil no Instagram.
            </Text>
          </View>
          {profiles.isLoading ? (
            <View flex center paddingT-s6>
              <LoaderScreen color={Colors.primary} message='Carregando...' overlay />
            </View>
          ) : (
            <>
              <View marginB-s4>
                <View row marginB-s2 style={{ alignItems: 'center' }}>
                  <Text text70BO>Qual publicar?</Text>
                  <TouchableOpacity disabled={connectFacebook.isLoading} onPress={handleConnectFacebook} marginL-s2>
                    {connectFacebook.isLoading ? (
                      <ActivityIndicator color={Colors.blue40} size={Typography.text70BO?.fontSize} />
                    ) : (
                      <Text body text80BO color={Colors.blue40}>
                        Conectar Facebook
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>

                <Picker
                  topBarProps={undefined}
                  showSearch={false}
                  placeholder='Selecione a conta'
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                  getOptionLabel={option => option?.page_name}
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                  getOptionValue={option => option?.page_id}
                  options={profiles.data as SocialProfile[]}
                  value={values.profile?.page_id}
                  onValueChange={item => {
                    onChange('profile', item);
                  }}
                />
                {errors?.profile && <Text style={{ color: 'red' }}>{errors?.profile as string}</Text>}
              </View>
              <View marginB-s4>
                <Text text70BO marginB-s2>
                  Quais redes sociais deseja distribuir
                </Text>
                <PickerMultiple
                  style={styles.textfieldSearch}
                  placeholder='Redes sociais'
                  renderItem={undefined}
                  topBarProps={undefined}
                  showSearch={false}
                  getOptionLabel={option => option?.label}
                  getOptionValue={option => option?.value}
                  options={SOCIAL_CHANNELS}
                  value={values.socialChannels}
                  onValueChange={item => {
                    onChange('socialChannels', item);
                  }}
                  getOptionDisabled={option => option.value === 'facebook' && arts.length > 1}
                />
                {errors?.socialChannels && <Text style={{ color: 'red' }}>{errors?.socialChannels as string}</Text>}
              </View>
              {arts.length > 1 ? (
                <View marginB-s4>
                  <Text>
                    Não é possível fazer distribuição de várias imagens (carrossel) no Facebook, apenas Instagram
                  </Text>
                </View>
              ) : null}
              {isInstagramBusinessAccount !== 1 ? (
                <View marginB-s4 backgroundColor={Colors.red60}>
                  <Text color={Colors.red20} text75BO>
                    Sua conta do Instagram não é do tipo comercial, por isso não será possível fazer a distribuição.
                    Para continuar, transforme sua conta em comercial.
                  </Text>
                  <TouchableOpacity onPress={() => Linking.openURL(LINK)} marginB-s2>
                    <Text text80BO color={Colors.blue40}>
                      Transformar em conta comercial
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : null}
              <View marginB-s4>
                <DateTimePicker
                  mode='date'
                  headerTitle='Qual a data da publicação?'
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

      <SelectPagesModal
        ref={selectPagesModalRef}
        title='Selecione as páginas'
        subtitle='Sua conta do Instagram precisar ser uma conta comercial e estar vinculada a sua página no Facebook.'
        pages={connectFacebook.data?.pages}
        pagesAlreadyActive={profiles.data?.map(profile => profile.page_id)}
        loading={activePagesFacebook.isLoading}
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onActivate={handleActivatePages}
        onClose={() => selectPagesModalRef.current?.close()}
      />
    </KeyboardAvoidingView>
  );
}
