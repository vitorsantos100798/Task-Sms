import { useFormikContext } from 'formik';
import React, { useCallback, useRef } from 'react';
import { ActivityIndicator, FlatList } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { Chip, Colors, LoaderScreen, Text, View } from 'react-native-ui-lib';
import { useQuery } from 'react-query';

import { listTemplateService } from '../../../services/templates';
import { CreateArtData } from '../../../types/art';
import { Template } from '../../../types/template';
import { ArtCard } from '../../ArtCard';
import style from '../style';
import { ProductQuantityModal } from './ProductQuantityModal';

type TemplatesProps = {
  onNext: () => void;
};

export function Templates({ onNext }: TemplatesProps) {
  const productQuantityModalRef = useRef<Modalize>(null);

  const formik = useFormikContext<CreateArtData>();
  const { formatId }: any = formik.values;

  const templates = useQuery(
    [
      'imageTemplates',
      {
        productQuantity: formik.values.productQuantity,
        format: formatId,
      },
    ],
    () =>
      listTemplateService({
        formats: formatId,
        productQuantity: formik.values.productQuantity,
      }),
    {
      keepPreviousData: true,
    }
  );

  const handleTemplatePress = useCallback(
    template => {
      formik.setFieldValue('templateId', template.id);
      formik.setFieldValue('designURL', template.designURL);
      onNext();
    },
    [formik, onNext]
  );

  function handleFilterOpen() {
    productQuantityModalRef.current?.open();
  }

  function handleFilterClose() {
    productQuantityModalRef.current?.close();
  }

  function renderRow(template: Template) {
    return (
      <ArtCard
        imageURL={template.imageURL}
        height={200}
        margin
        onPress={() => {
          handleTemplatePress(template);
        }}
      />
    );
  }

  return (
    <>
      <View style={style.container}>
        <Text primary text65BL marginV-s2>
          3. Escolha a disposição dos elementos
        </Text>
        <Text text750BL color={Colors.grey20}>
          Selecione a quantidade de produtos da sua lista que irá em cada arte.
        </Text>
        <Text text750BL color={Colors.grey20}>
          Exemplo: se sua lista tiver 10 produtos e você selecionar 5 produtos por imagem, serão criadas 2 imagens com 5
          produtos cada.
        </Text>
      </View>
      {templates.isLoading ? (
        <View flex center>
          <LoaderScreen color={Colors.primary} message='Carregando...' overlay />
        </View>
      ) : (
        <>
          <View row paddingB-s2>
            <Chip
              label={`Quantidade de produtos: ${formik.values.productQuantity}`}
              size={30}
              labelStyle={{
                color: Colors.secondary,
              }}
              containerStyle={{
                borderColor: Colors.secondary,
              }}
              onPress={handleFilterOpen}
            />
          </View>
          <FlatList<Template>
            keyExtractor={item => item.name}
            showsVerticalScrollIndicator={false}
            data={templates.data}
            numColumns={2}
            renderItem={({ item }) => renderRow(item)}
            onEndReachedThreshold={0.1}
            ListFooterComponent={templates.isLoading ? <ActivityIndicator color={Colors.primary} /> : undefined}
          />
          <ProductQuantityModal ref={productQuantityModalRef} onRequestClose={handleFilterClose} />
        </>
      )}
    </>
  );
}
