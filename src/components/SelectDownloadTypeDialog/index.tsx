import React, { useCallback, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { Button, Colors, Dialog, PanningProvider, Text, View, TouchableOpacity } from 'react-native-ui-lib';
import Feather from 'react-native-vector-icons/Feather';
import { useMutation } from 'react-query';

import { useToast } from '../../hooks/useToast';
import { generatePdf } from '../../services/arts';
import { Art } from '../../types/art';
import { widthPercentageToDP } from '../../utils/dimensions';
import { saveMultiArts, saveArt } from '../../utils/saveArt';
import styles from './styles';

type Slug = 'pdf' | 'jpg';

type SelectDownloadTypeDialogProps = {
  visible: boolean;
  medias: Art[];
  onRequestClose: () => void;
};

type DownloadOptionsProps = {
  key: string;
  name: string;
  // eslint-disable-next-line react/no-unused-prop-types
  value: string;
  selected: boolean;
  onChangeValue: () => void;
};

const DOWNLOAD_TYPES: Array<{ name: string; slug: Slug }> = [
  { name: 'PDF', slug: 'pdf' },
  { name: 'JPG', slug: 'jpg' },
];

export function SelectDownloadTypeDialog({ medias, visible, onRequestClose }: SelectDownloadTypeDialogProps) {
  const toast = useToast();
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [selectedDownloadType, setSelectedDownloadType] = useState<Slug>('jpg');

  const newArt = useMutation(
    async (data: string[]) => {
      const response = await generatePdf(data);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return response;
    },
    {
      onError: () => {
        toast.show('Ops! Ocorreu um erro ao gerar o PDF.', {
          variant: 'error',
        });
      },
      retry: false,
    }
  );

  const handleDownloadJpg = useCallback(async (data: any[]) => {
    try {
      setIsDownloading(true);
      await saveMultiArts(data);
      toast.show('Arte salva com sucesso', {
        variant: 'success',
      });
    } catch (err: any) {
      if (err.message === 'Permission denied') {
        toast.show('Você precisa permitir o acesso ao armazenamento', {
          variant: 'error',
        });
      } else {
        toast.show('Erro ao salvar a arte', {
          variant: 'error',
        });
      }
    } finally {
      setIsDownloading(false);
      onRequestClose();
    }
  }, []);

  const handleDonwloadPdf = useCallback(async (data: any[]) => {
    try {
      setIsDownloading(true);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
      const urlsImages = data.map(media => media.imageURL);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const { content } = await newArt.mutateAsync(urlsImages);
      await saveArt(content.uri, data[0].name);
      toast.show('Arte salva com sucesso', {
        variant: 'success',
      });
    } catch (err) {
      toast.show('Erro ao salvar a arte', {
        variant: 'error',
      });
    } finally {
      setIsDownloading(false);
      onRequestClose();
    }
  }, []);

  const handleDownload = useCallback(async () => {
    const downloadMedias = medias.map(media => ({
      imageURL: media.image_url,
      name: media.name,
    }));
    if (selectedDownloadType === 'jpg') {
      handleDownloadJpg(downloadMedias);
    } else if (selectedDownloadType === 'pdf') {
      handleDonwloadPdf(downloadMedias);
    }
  }, [selectedDownloadType, medias]);

  function DownloadOptions({ key, name, selected, onChangeValue }: DownloadOptionsProps) {
    return (
      <TouchableOpacity key={key} marginB-s4 onPress={onChangeValue}>
        <View row padding-s3 style={selected ? styles.optionSelected : styles.option}>
          <Text grey30 text70L>
            {name}
          </Text>
          {selected && <Feather style={styles.icon} size={22} name='check' />}
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <Dialog
      visible={visible}
      height={300}
      onDismiss={onRequestClose}
      panDirection={PanningProvider.Directions.DOWN}
      width={widthPercentageToDP('90%')}
      containerStyle={{
        backgroundColor: Colors.white,
        borderRadius: 8,
      }}>
      <View flex>
        <View style={styles.header}>
          <Text text60M>Qual formato deseja baixar</Text>
        </View>
        <View flex padding-page>
          {DOWNLOAD_TYPES.map(type => (
            <DownloadOptions
              key={type.slug}
              name={type.name}
              value={type.slug}
              selected={type.slug === selectedDownloadType}
              onChangeValue={() => {
                setSelectedDownloadType(type.slug);
              }}
            />
          ))}
        </View>
        <View style={styles.actions}>
          <Button link label='Cancelar' color={Colors.black} onPress={onRequestClose} />
          <Button disabled={isDownloading} label={!isDownloading ? 'Baixar' : undefined} onPress={handleDownload}>
            {isDownloading && <ActivityIndicator color={Colors.white} />}
          </Button>
        </View>
      </View>
    </Dialog>
  );
}
