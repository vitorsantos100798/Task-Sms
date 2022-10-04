/* eslint-disable react/display-name */
import React, { forwardRef, useState, useCallback } from 'react';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import { Colors, Text, View, TouchableOpacity } from 'react-native-ui-lib';
import Feather from 'react-native-vector-icons/Feather';
import { useMutation } from 'react-query';

import { useDialog } from '../../hooks/useDialog';
import { useToast } from '../../hooks/useToast';
import { removeArtByIdService } from '../../services/arts';
import { queryClient } from '../../services/queryClient';
import { Art } from '../../types/art';
import { DistributeArts } from '../../types/distribution';
import { ArtCard } from '../ArtCard';
import { SelectDownloadTypeDialog } from '../SelectDownloadTypeDialog';
import styles from './styles';

type ModalViewAllImagesProps = {
  title?: string;
  subtitle?: string;
  images?: Art[];
  campaignId: number;
  onDistribute: (arts: DistributeArts[]) => void;
  onRequestClose?: () => void;
};

export const ModalViewAllImages = forwardRef<Modalize, ModalViewAllImagesProps>(
  ({ title, subtitle, images, campaignId, onDistribute, onRequestClose }, ref) => {
    const toast = useToast();
    const dialog = useDialog();
    const [selectDownloadTypeDialogIsOpen, setSelectDownloadTypeDialogIsOpen] = useState<boolean>(false);
    const [selectedImagesId, setSelectedImagesId] = useState<number[]>([]);
    const [selectedImages, setSelectedImages] = useState<Art[]>([]);

    const removeArt = useMutation(async (id: number) => {
      const response = await removeArtByIdService(id);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return response;
    });

    const handleSelectedImageIds = useCallback((isSelected: boolean, item: Art) => {
      if (isSelected) {
        setSelectedImagesId(prev => prev.filter(i => i !== item.id));
      } else {
        setSelectedImagesId(prev => [...prev, item.id]);
      }
    }, []);

    const handleSelectedImages = useCallback(() => {
      const selectedArts: Art[] = [];
      selectedImagesId.forEach((id: number) => {
        const art = images?.find(image => image.id === id);
        if (art) {
          selectedArts.push(art);
        }
      });
      setSelectedImages(selectedArts);
      return selectedArts;
    }, [images, selectedImagesId]);

    const handleOnRequestDelete = useCallback(async () => {
      try {
        const requestsRemoveArts = selectedImagesId.map(id => removeArt.mutateAsync(id));
        await Promise.all(requestsRemoveArts);
        queryClient.invalidateQueries(['campaign', campaignId]);
        toast.show('Artes desativadas!', {
          variant: 'success',
        });
        if (onRequestClose) {
          onRequestClose();
        }
      } catch (err) {
        toast.show('Erro ao remover as artes', {
          variant: 'error',
        });
      }
    }, [selectedImagesId]);

    const handleDelete = useCallback(async () => {
      if (!selectedImagesId.length) return;

      dialog.showAlert({
        title: 'Apagar imagens',
        description: 'Deseja apagar as imagens selecionadas?',
        confirmationText: 'Apagar',
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onConfirmation: handleOnRequestDelete,
        confirmationButtonProps: {
          color: Colors.red40,
        },
      });
    }, [dialog, selectedImagesId]);

    const handleDownload = useCallback(async () => {
      handleSelectedImages();
      setSelectDownloadTypeDialogIsOpen(true);
    }, [handleSelectedImages]);

    const handleDistribute = useCallback(() => {
      const arts = handleSelectedImages();
      const artsToDistribute: DistributeArts[] = arts.map(art => ({
        artId: art.id,
        artType: art.type,
        artURL: art.image_url,
      }));
      onDistribute(artsToDistribute);
    }, [handleSelectedImages, selectedImages]);

    const handleSelectDownloadTypeDialogClose = useCallback(() => {
      setSelectDownloadTypeDialogIsOpen(false);
    }, []);

    function renderItem(item: Art) {
      const isSelected = selectedImagesId.filter(i => i === item.id).length > 0;
      return (
        <ArtCard
          imageURL={item.image_url}
          thumbnailURL={item.image_url}
          height={200}
          margin
          isSelectable
          selected={isSelected}
          onPress={() => {
            handleSelectedImageIds(isSelected, item);
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
        <View useSafeArea row style={styles.footer}>
          <TouchableOpacity disabled={!selectedImagesId.length} onPress={handleDownload}>
            <Feather color={selectedImagesId.length ? Colors.blue30 : Colors.grey40} size={24} name='download' />
          </TouchableOpacity>
          <TouchableOpacity disabled={!selectedImagesId.length} onPress={handleDistribute}>
            <Feather color={selectedImagesId.length ? Colors.blue30 : Colors.grey40} size={24} name='share-2' />
          </TouchableOpacity>
          <TouchableOpacity disabled={!selectedImagesId.length} onPress={handleDelete}>
            <Feather color={selectedImagesId.length ? Colors.blue30 : Colors.grey40} size={24} name='trash-2' />
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <>
        <Portal>
          <Modalize
            HeaderComponent={renderHeader}
            FooterComponent={renderFooter}
            flatListProps={{
              keyExtractor: item => String(item.id),
              contentContainerStyle: styles.listContent,
              numColumns: 2,
              showsVerticalScrollIndicator: false,
              data: images,
              renderItem: ({ item }) => renderItem(item),
            }}
            ref={ref}
            withHandle={false}
            adjustToContentHeight
            panGestureComponentEnabled
            onClose={() => {
              setSelectedImagesId([]);
            }}
          />
        </Portal>
        <SelectDownloadTypeDialog
          medias={selectedImages}
          visible={selectDownloadTypeDialogIsOpen}
          onRequestClose={handleSelectDownloadTypeDialogClose}
        />
      </>
    );
  }
);
