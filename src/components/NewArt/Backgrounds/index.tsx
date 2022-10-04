import { Formats } from '@components/BackgroundFilter/Formats';
import { Occasions } from '@components/BackgroundFilter/Occasions';
import { Segments } from '@components/BackgroundFilter/Segments';
import { Occasion } from '@project-types/occasion';
import { listFormatService } from '@services/formats';
import { useFormikContext } from 'formik';
import _ from 'lodash';
import React, { useRef, useState } from 'react';
import { ActivityIndicator, FlatList } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { Colors, LoaderScreen, Text, View, Picker, TouchableOpacity, Button } from 'react-native-ui-lib';
import { useQuery } from 'react-query';

import { listBackgroundService } from '../../../services/backgrounds';
import { listOccasionService } from '../../../services/occasions';
import { listSegmentService } from '../../../services/segments';
import { CreateArtData } from '../../../types/art';
import { Background } from '../../../types/background';
import { ArtCard } from '../../ArtCard';
import style from '../style';

type BackgroundsProps = {
  onNext: () => void;
};
type FormatsFilter = {
  companyId?: any;
  createdAt: Date;
  height: number;
  id: number;
  name: string;
  updatedAt: Date;
  width: number;
};
type SegmentFilter = {
  id: number;
  companyId?: any;
  name: string;
};

type OccasionFilter = {
  id: number;
  name: string;
  formatId: number;
  segmentId: number;
};
export function Backgrounds({ onNext }: BackgroundsProps) {
  const formik = useFormikContext<CreateArtData>();
  const { formatId, segmentId, occasionId }: any = formik.values;

  const [page, setPage] = useState(1);
  const [formatsValuesId, setFormatsValuesId] = useState<number>(1);
  const [SegmentsValuesId, setSegmentsValuesId] = useState<number>(2);
  const [occasionValuesId, setOccasionValuesId] = useState<any>(occasionId);
  const modalizeRef = useRef(null);
  const formats = useQuery('formats', listFormatService, {
    select: employees =>
      employees.filter(
        employee =>
          employee.name === 'Post' ||
          employee.name === 'Encarte' ||
          employee.name === 'Story' ||
          employee.name === 'TV - Indoor' ||
          employee.name === 'Cartaz A3 - Paisagem' ||
          employee.name === 'Cartaz A4 - Paisagem' ||
          employee.name === 'Cartaz A3 - Retrato' ||
          employee.name === 'Cartaz A4 - Retrato'
      ),
  });
  const segments = useQuery('segments', listSegmentService, {
    select: employees =>
      employees.filter(
        employee =>
          employee.name === 'Supermercado' ||
          employee.name === 'Material de Construção' ||
          employee.name === 'Farmácia' ||
          employee.name === 'Pet Shop' ||
          employee.name === 'Hortifruti'
      ),
  });
  const occasions = useQuery(
    ['occasions', { formatId, segmentId }],
    async () => {
      const response = await listOccasionService({
        formatId,
        segmentId,
      });

      return response;
    },
    {
      enabled: !!formatId && !!segmentId,
      select: employees =>
        employees.filter(
          employee =>
            employee.name === '6-) Sexta-Feira' ||
            employee.name === 'Preço' ||
            employee.name === 'Final de Semana' ||
            employee.name === 'Super Ofertas' ||
            employee.name === 'Açougue e Churrasco' ||
            employee.name === 'Bebidas'
        ),
    }
  );

  const backgrounds = useQuery(
    ['backgrounds', { formatId, segmentId, occasionId }],
    () =>
      listBackgroundService({
        page,
        formats: formatId,
        segments: segmentId,
        occasions: occasionId,
      }),
    {
      enabled: true,
      keepPreviousData: false,
      cacheTime: 0,
      staleTime: 0,
    }
  );
  const handleBackgroundPress = (background: any) => {
    return (
      formik.setFieldValue('backgroundURL', background.imageURL),
      formik.setFieldValue('formatId', background.formatId),
      onNext()
    );
  };
  function renderRow(background: Background) {
    return (
      <ArtCard
        imageURL={background.thumbnail}
        height={200}
        margin
        onPress={() => {
          handleBackgroundPress(background);
        }}
      />
    );
  }
  const openModalSegments = () => {
    modalizeRef.current?.open();
  };
  const closeModalSegments = () => {
    modalizeRef.current?.close();
  };

  const handlerFormats = () => {
    return (
      formik.setFieldValue('formatId', formatsValuesId),
      formik.setFieldValue('segmentId', SegmentsValuesId),
      formik.setFieldValue('occasionId', occasionValuesId)
    );
  };

  const handlerFunctionsFormats = () => {
    return closeModalSegments(), handlerFormats();
  };

  return (
    <View>
      <View style={style.container}>
        <Text primary text65BL marginV-s2>
          2. Escolha a arte
        </Text>
        <Text text750BL color={Colors.grey20}>
          Os produtos da sua lista serão adicionados nessa arte.
        </Text>
      </View>
      <View
        style={{
          width: '100%',
          height: '10%',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
        }}>
        <TouchableOpacity
          onPress={openModalSegments}
          style={{
            backgroundColor: '#F5F5F5',
            borderRadius: 4,
            borderWidth: 1.5,
            borderColor: '#B0B0B0',
            marginLeft: 10,
            width: 100,
            height: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text color='#616161'>Filtrar</Text>
        </TouchableOpacity>
      </View>
      <FlatList<Background>
        keyExtractor={item => item.name}
        showsVerticalScrollIndicator={false}
        data={backgrounds.data}
        extraData={backgrounds.isLoading}
        numColumns={2}
        renderItem={({ item }) => renderRow(item)}
      />
      {backgrounds.isLoading ? (
        <View flex center>
          <LoaderScreen color={Colors.primary} message='Carregando...' overlay />
        </View>
      ) : (
        <Modalize ref={modalizeRef} modalHeight={750} snapPoint={750}>
          <View
            style={{
              width: '100%',
              height: '100%',
            }}>
            <View flex>
              <Formats
                formats={formats.data as FormatsFilter[]}
                selectedFormatId={formatsValuesId}
                onChange={value => setFormatsValuesId(value.id)}
              />
              <Segments
                segments={segments.data as SegmentFilter[]}
                selectedSegmentId={SegmentsValuesId}
                onChange={value => setSegmentsValuesId(value.id)}
              />
              <Occasions
                selectedOccasionId={occasionValuesId}
                occasions={occasions.data as OccasionFilter[]}
                onChange={value => setOccasionValuesId(value.id)}
              />
            </View>

            <TouchableOpacity
              style={{
                backgroundColor: Colors.primary,
                height: 46,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: 10,
                marginRight: 10,
                marginBottom: 30,
                borderRadius: 4,
              }}
              onPress={handlerFunctionsFormats}>
              <Text
                style={{
                  color: 'white',
                }}>
                Aplicar Filtro
              </Text>
            </TouchableOpacity>
          </View>
        </Modalize>
      )}
    </View>
  );
}
