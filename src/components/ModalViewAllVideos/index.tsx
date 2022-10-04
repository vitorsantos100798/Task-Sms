/* eslint-disable react/display-name */
import React, { forwardRef, useState, useCallback } from 'react';
import { ActivityIndicator } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import { Colors, Text, View, TouchableOpacity } from 'react-native-ui-lib';
import Feather from 'react-native-vector-icons/Feather';

import { useToast } from '../../hooks/useToast';
import { Video } from '../../types/art';
import { DistributeArts } from '../../types/distribution';
import { saveMultiArts } from '../../utils/saveArt';
import { VideoCard } from '../VideoCard';
import styles from './styles';

type ModalViewAllVideosProps = {
  title?: string;
  subtitle?: string;
  // eslint-disable-next-line react/no-unused-prop-types
  campaignId: number;
  videos?: Video[];
  onDistribute: (arts: DistributeArts[]) => void;
};

export const ModalViewAllVideos = forwardRef<Modalize, ModalViewAllVideosProps>(
  ({ title, subtitle, videos, onDistribute }, ref) => {
    const toast = useToast();
    const [isDownloading, setIsDownloading] = useState<boolean>(false);
    const [selectedVideosId, setSelectedVideosId] = useState<number[]>([]);
    const [selectedVideos, setSelectedVideos] = useState<Video[]>([]);

    const handleSelectedImageIds = useCallback((isSelected: boolean, item: Video) => {
      if (isSelected) {
        setSelectedVideosId(prev => prev.filter(i => i !== item.id));
      } else {
        setSelectedVideosId(prev => [...prev, item.id]);
      }
    }, []);

    const handleSelectedVideos = useCallback(() => {
      const selectedArts: Video[] = [];
      selectedVideosId.forEach((id: number) => {
        const art = videos?.find(image => image.id === id);
        if (art) {
          selectedArts.push(art);
        }
      });

      setSelectedVideos(selectedArts);
      return selectedArts;
    }, [videos, selectedVideosId]);

    const handleDownload = useCallback(async () => {
      setIsDownloading(true);
      const arts = handleSelectedVideos();
      const downloadVideos = arts.map(video => ({
        imageURL: video.videoURL,
        name: video.name,
      }));
      saveMultiArts(downloadVideos)
        .then(() => {
          toast.show('Vídeos salvo com sucesso', {
            variant: 'success',
          });
        })
        .catch((err: any) => {
          if (err.message === 'Permission denied') {
            toast.show('Você precisa permitir o acesso ao armazenamento', {
              variant: 'error',
            });
          } else {
            toast.show('Erro ao salvar os vídeos', {
              variant: 'error',
            });
          }
        })
        .finally(() => {
          setIsDownloading(false);
        });
    }, [handleSelectedVideos]);

    const handleDistribute = useCallback(() => {
      const videos = handleSelectedVideos();
      const videosToDistribute: DistributeArts[] = videos.map(art => ({
        artId: art.id,
        artType: 'Videos',
        artURL: art.videoURL,
      }));

      onDistribute(videosToDistribute);
    }, [handleSelectedVideos, selectedVideos]);

    function renderItem(item: Video) {
      const isSelected = Boolean(item.videoURL) && selectedVideosId.filter(i => i === item.id).length > 0;

      return (
        <VideoCard
          videoURL={item.videoURL}
          margin
          isProcessing={Boolean(!item.videoURL)}
          isSelectable
          selected={Boolean(isSelected)}
          onPress={() => {
            handleSelectedImageIds(Boolean(isSelected), item);
          }}
        />
      );
    }

    function renderHeader() {
      return (
        <View row style={styles.header}>
          <Text text60M numberOfLines={1}>
            {title}
          </Text>
          <Text marginT-s1 text80R color={Colors.grey20} numberOfLines={1}>
            {subtitle}
          </Text>
        </View>
      );
    }

    function renderFooter() {
      return (
        <View row style={styles.footer}>
          <TouchableOpacity disabled={isDownloading || !selectedVideosId.length} onPress={handleDownload}>
            {isDownloading ? (
              <ActivityIndicator color={Colors.blue30} size={24} />
            ) : (
              <Feather
                color={isDownloading || selectedVideosId.length ? Colors.blue30 : Colors.grey40}
                size={24}
                name='download'
              />
            )}
          </TouchableOpacity>
          <TouchableOpacity disabled={!selectedVideosId.length} onPress={handleDistribute}>
            <Feather color={selectedVideosId.length ? Colors.blue30 : Colors.grey40} size={24} name='share-2' />
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <Portal>
        <Modalize
          HeaderComponent={renderHeader}
          FooterComponent={renderFooter}
          flatListProps={{
            keyExtractor: item => String(item.id),
            contentContainerStyle: styles.listContent,
            numColumns: 2,
            showsVerticalScrollIndicator: false,
            data: videos,
            renderItem: ({ item }) => renderItem(item),
          }}
          ref={ref}
          withHandle={false}
          adjustToContentHeight
          panGestureComponentEnabled
          onClose={() => {
            setSelectedVideosId([]);
          }}
        />
      </Portal>
    );
  }
);
