import { useNavigation } from '@react-navigation/native';
import { isEmpty } from 'lodash';
import React, { useState, useRef } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, ActivityIndicator, Linking } from 'react-native';
import { TextInput } from 'react-native-paper';
import {
  Button,
  Image,
  Colors,
  LoaderScreen,
  Text,
  View,
  TouchableOpacity,
  Typography,
  Spacings,
} from 'react-native-ui-lib';
import Feather from 'react-native-vector-icons/Feather';
import { useQuery } from 'react-query';

import { ArtCard } from '../../components/ArtCard';
import { TextField } from '../../components/TextField';
import { listCampaignService } from '../../services/campaigns';
import { Campaign } from '../../types/campaign';
import { AppScreenProp } from '../../types/navigation';
import styles from './styles';

const LINK_YOUTUBE = 'https://www.youtube.com/watch?v=9PBDfHH1cgU';

export function Home() {
  const { navigate } = useNavigation<AppScreenProp>();

  const artNameInputRef = useRef<any>(null);

  const [refreshing, setRefreshing] = useState(false);

  const [artName, setArtName] = useState('');

  const campaigns = useQuery(['campaigns', artName], () => listCampaignService(artName));

  async function handleRefresh() {
    setRefreshing(true);

    await campaigns.refetch();

    setRefreshing(false);
  }

  function handleNavigateToModalName() {
    navigate('NewArt', {});
  }

  function handleClear() {
    setArtName('');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    artNameInputRef.current?.focus();
  }

  function handleNavigateToCampaign(offer: Campaign) {
    navigate('Campaign', {
      campaignId: offer.id,
      campaignName: offer.name,
    });
  }

  function renderItem(item: Campaign) {
    return (
      <ArtCard
        name={item.name}
        imageURL={item.thumbnailURL}
        thumbnailURL={item.thumbnailURL}
        height={200}
        margin
        nameProps={{
          text90M: true,
          numberOfLines: 1,
        }}
        onPress={() => {
          handleNavigateToCampaign(item);
        }}
      />
    );
  }

  if (campaigns.isLoading && !artName) {
    return (
      <View flex center>
        <LoaderScreen color={Colors.primary} message='Carregando...' overlay />
      </View>
    );
  }

  if (isEmpty(campaigns.data) && !artName) {
    return (
      <>
        <View style={{ marginTop: Spacings.s4 }}>
          <TouchableOpacity onPress={() => Linking.openURL(LINK_YOUTUBE)}>
            <View center>
              <Image assetGroup='campaign' assetName='tutorial' />
            </View>
          </TouchableOpacity>
        </View>
        <View flex center padding-page>
          <Text text70M>
            Você ainda não criou nenhuma propaganda. Clique no botão "Criar" para começar ou{' '}
            <TouchableOpacity onPress={() => Linking.openURL(LINK_YOUTUBE)}>
              <Text blue10 underline text70M>
                assista o passo a passo.
              </Text>
            </TouchableOpacity>
          </Text>
          <Button style={styles.createListButton} onPress={handleNavigateToModalName}>
            <Text text60BO white>
              Criar
            </Text>
            <Feather name='plus' size={22} style={styles.leadingAccess} color={Colors.white} />
          </Button>
        </View>
      </>
    );
  }

  return (
    <View flex>
      <KeyboardAvoidingView behavior={Platform.OS === 'android' ? undefined : 'padding'} style={{ flex: 1 }}>
        <View paddingH-page paddingV-s2>
          <TextField
            ref={artNameInputRef}
            label='Procurar campanha'
            placeholder='Digite o nome da campanha...'
            autoCorrect={false}
            autoCapitalize='none'
            returnKeyType='done'
            value={artName}
            onChangeText={setArtName}
            right={
              artName.length > 0 ? (
                <TextInput.Icon
                  name='x'
                  size={Typography.text60?.fontSize}
                  style={styles.leadingAccessory}
                  onPress={handleClear}
                />
              ) : (
                <TextInput.Icon name='search' size={Typography.text60?.fontSize} style={styles.leadingAccessory} />
              )
            }
          />

          <TouchableOpacity marginT-s4 onPress={() => Linking.openURL(LINK_YOUTUBE)}>
            <View center>
              <Image assetGroup='campaign' assetName='tutorial' />
            </View>
          </TouchableOpacity>
        </View>
        {campaigns.isLoading && artName ? (
          <View row center>
            <ActivityIndicator color={Colors.primary} />
            <Text text70M style={{ textAlign: 'center', marginLeft: Spacings.s3 }}>
              Procurando...
            </Text>
          </View>
        ) : (
          <FlatList<Campaign>
            keyExtractor={item => String(item.id)}
            contentContainerStyle={styles.listContent}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            data={campaigns.data}
            refreshing={refreshing}
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onRefresh={handleRefresh}
            renderItem={({ item }) => renderItem(item)}
          />
        )}
      </KeyboardAvoidingView>
      <Button style={styles.createListButton} onPress={handleNavigateToModalName}>
        <Text text60BO white>
          Criar
        </Text>
        <Feather name='plus-circle' size={22} style={styles.leadingAccess} color={Colors.white} />
      </Button>
    </View>
  );
}
