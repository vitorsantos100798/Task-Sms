import { useNavigation } from '@react-navigation/native';
import { isEmpty } from 'lodash';
import React, { useCallback, useRef, useState } from 'react';
import { Platform, RefreshControl, ScrollView } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { Button, Carousel, Colors, LoaderScreen, Spacings, TouchableOpacity, Text, View } from 'react-native-ui-lib';
import { useQuery } from 'react-query';

import { listArtByCampaignService, listVideoByCampaignService } from '../../../services/arts';
import { Art, Video } from '../../../types/art';
import { AppScreenProp } from '../../../types/navigation';
import { widthPercentageToDP } from '../../../utils/dimensions';
import { shareFile } from '../../../utils/shareFile';
import { ActionSheet } from '../../ActionSheet';
import { ArtCard } from '../../ArtCard';
import { ModalViewAllImages } from '../../ModalViewAllImages';
import { ModalViewAllVideos } from '../../ModalViewAllVideos';
import { VideoCard } from '../../VideoCard';
import styles from './styles';

const PAGE_WIDTH = widthPercentageToDP('50%') - Spacings.s2;

const thirtySecondsInMilliseconds = 30000;

type ArtsProps = {
  campaignId: number;
  campaignName?: string;
};

export function Arts({ campaignId, campaignName }: ArtsProps) {
  const actionSheetRef = useRef<Modalize>(null);
  const actionSheetVideoRef = useRef<Modalize>(null);
  const modalViewAllImages = useRef<Modalize>(null);
  const modalViewAllVideos = useRef<Modalize>(null);

  const { navigate } = useNavigation<AppScreenProp>();

  const [selectedArt, setSelectedArt] = useState<Art>();
  const [selectedVideo, setSelectedVideo] = useState<Video>();
  const [artsByType, setArtsByType] = useState<Art[]>();
  const [selectedVideos, setSelectedVideos] = useState<Video[]>();

  const { isLoading, data, refetch, isRefetching } = useQuery(
    ['campaign', campaignId],
    () => listArtByCampaignService(campaignId),
    { refetchOnMount: true }
  );

  const videos = useQuery(['videos', campaignId], () => listVideoByCampaignService(campaignId), {
    refetchOnMount: true,
    refetchInterval: thirtySecondsInMilliseconds,
  });

  function handleActionSheetOpen(art: Art) {
    setSelectedArt(art);
    actionSheetRef.current?.open();
  }

  function handleNavigateToEditArt() {
    if (selectedArt) {
      actionSheetRef.current?.close();
      navigate('StudioWeb', {
        artId: selectedArt.id,
        artName: selectedArt.name,
        campaignId: selectedArt.offer_id,
      });
    }
  }

  const handleNavigateToDistribution = useCallback(
    arts => {
      if (!arts.length) return;
      modalViewAllImages.current?.close();
      modalViewAllVideos.current?.close();
      navigate('Distribute', {
        campaignId,
        arts,
      });
    },
    [campaignId, navigate, selectedArt]
  );

  const handleSelectMoreImages = useCallback(
    (arts: Art[]) => {
      setArtsByType(arts);
      modalViewAllImages.current?.open();
    },
    [modalViewAllImages]
  );

  const handleSelectMoreVideos = useCallback(
    (videos: Video[]) => {
      setSelectedVideos(videos);
      modalViewAllVideos.current?.open();
    },
    [modalViewAllVideos]
  );

  return (
    <>
      {(isLoading || videos.isLoading) && (
        <View flex center>
          <LoaderScreen color={Colors.primary} message='Carregando...' overlay />
        </View>
      )}
      {!isLoading && isEmpty(data) && !videos.isLoading && isEmpty(videos.data) ? (
        <View flex center>
          <Text text70M style={{ textAlign: 'center' }}>
            Agora é só clicar no botão gerar arte
          </Text>
        </View>
      ) : (
        <View flex>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl
                refreshing={isRefetching}
                onRefresh={() => {
                  refetch();
                  videos.refetch();
                }}
              />
            }>
            {videos.data && videos.data.length > 0 && (
              <View marginH-s2 marginB-s4>
                <View row marginH-s2 marginB-s4>
                  <Text text60M>Vídeos</Text>
                  <TouchableOpacity onPress={() => handleSelectMoreVideos(videos.data)} flex row right>
                    <Text text65M color={Colors.blue30}>
                      Selecionar
                    </Text>
                  </TouchableOpacity>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {videos.data.map(video => (
                    <VideoCard
                      key={video.id}
                      name={video.name || ''}
                      videoURL={video.videoURL}
                      marginR-s4
                      isProcessing={Boolean(!video.videoURL)}
                      onPress={() => {
                        if (Platform.OS === 'android') {
                          navigate('VideoPlayer', {
                            videoTitle: video.name,
                            videoUrl: video.videoURL,
                          });
                        }
                      }}
                    />
                  ))}
                </ScrollView>
              </View>
            )}
            {data &&
              Object.keys(data).map(key => (
                <View key={key} marginB-s8>
                  <View row marginH-s2 marginB-s4>
                    <Text text60M>{key}</Text>
                    <TouchableOpacity onPress={() => handleSelectMoreImages(data[key])} flex row right>
                      <Text text65M color={Colors.blue30}>
                        Selecionar
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <Carousel
                    itemSpacings={Spacings.s3}
                    pageWidth={PAGE_WIDTH}
                    containerStyle={{
                      height: 250,
                    }}
                    pageControlPosition={Carousel.pageControlPositions.UNDER}
                    pageControlProps={{
                      size: 8,
                      color: Colors.primary,
                    }}>
                    {data[key].map(art => {
                      return (
                        <ArtCard
                          key={`${art.id}-${art.name}.${art.image_url}`}
                          name={art.name}
                          imageURL={art.image_url}
                          withMoreButton
                          sharedElementId={`art.${art.id}.image_url`}
                          onPress={() => {
                            navigate('ArtDetails', {
                              artId: art.id,
                              artName: art.name,
                              artURL: art.image_url,
                            });
                          }}
                          onMorePress={() => {
                            handleActionSheetOpen(art);
                          }}
                        />
                      );
                    })}
                  </Carousel>
                </View>
              ))}
          </ScrollView>
        </View>
      )}

      <Button
        label='Gerar arte'
        borderRadius={4}
        text60BO
        style={styles.generateButton}
        onPress={() => {
          navigate('NewArt', {
            campaignId,
            campaignName,
          });
        }}
      />
      {selectedArt?.id ? (
        <ActionSheet
          ref={actionSheetRef}
          title={selectedArt?.name}
          subtitle={selectedArt?.type}
          options={[
            {
              title: 'Editar',
              icon: 'edit',
              onPress: handleNavigateToEditArt,
            },
          ]}
        />
      ) : (
        <ActionSheet ref={actionSheetVideoRef} title={selectedVideo?.name as string} subtitle='Vídeo' options={[]} />
      )}

      {/* <SelectDistributionTypeDialog
        visible={selectDistributionTypeDialogIsOpen}
        onSubmit={handleNavigateToDistribution}
        onRequestClose={handleSelectDistributionTypeDialogClose}
      /> */}

      <ModalViewAllImages
        ref={modalViewAllImages}
        title='Distribuir'
        subtitle='Selecione as imagens que deseja'
        campaignId={campaignId}
        images={artsByType}
        onDistribute={handleNavigateToDistribution}
        onRequestClose={() => modalViewAllImages.current?.close()}
      />

      <ModalViewAllVideos
        ref={modalViewAllVideos}
        title='Distribuir'
        subtitle='Selecione os vídeos que deseja'
        campaignId={campaignId}
        videos={selectedVideos}
        onDistribute={handleNavigateToDistribution}
      />
    </>
  );
}
