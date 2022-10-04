import { ArtContext } from '@contexts/Art';
import { ArtContextPropsType } from '@project-types/art.context';
import { useNavigation } from '@react-navigation/native';
import { Formik, useFormikContext } from 'formik';
import React, { useCallback, useMemo, useState } from 'react';
import { Alert, FlatList, ScrollView } from 'react-native';
import { Button, Colors, Image, ListItem, Text, TouchableOpacity, Typography, View } from 'react-native-ui-lib';
import Feather from 'react-native-vector-icons/Feather';

import { useDialog } from '../../../hooks/useDialog';
import { CreateArtData } from '../../../types/art';
import { AppScreenProp } from '../../../types/navigation';
import { NewProductType, ProductToEditType } from '../../../types/product';
import { formatPrice } from '../../../utils/format';
import { CampaignHeader } from '../../Campaign/Header';
import { CampaignNameDialog } from '../../CampaignNameDialog';
import style from '../style';

type ProductsType = {
  data: NewProductType[];
  onRemove: (name: string) => void;
  onNext: () => void;
};

export function Products({ data, onRemove, onNext }: ProductsType) {
  const dialog = useDialog();
  const formik = useFormikContext<CreateArtData>();
  const { updateArtToEdit } = React.useContext(ArtContext) as ArtContextPropsType;
  const { navigate, setOptions } = useNavigation<AppScreenProp>();

  const [campaignNameModalIsOpen, setCampaignNameModalIsOpen] = useState<boolean>(true);

  const disableGoNextStep = useMemo(() => {
    if (data.length === 0) {
      return true;
    }
    return false;
  }, [data.length]);

  function handleNavigateToNewProduct(editNewProduct?: ProductToEditType) {
    updateArtToEdit(editNewProduct?.id);

    navigate('NewProduct', {
      toEdit: editNewProduct,
    });
  }

  function handleNavigateToEditNewProduct(product: NewProductType, id: number) {
    handleNavigateToNewProduct({ product, id });
  }

  const handleNextPage = useCallback(() => {
    formik.setFieldValue('products', data);

    onNext();
  }, [formik, onNext]);

  const handleCampaignName = useCallback(() => {
    setOptions({
      headerTitle: () => <CampaignHeader label={formik.values.campaign?.name as string} />,
    });
    setCampaignNameModalIsOpen(false);
  }, [formik]);

  const handleRemoveProduct = useCallback(
    async (name: string) => {
      dialog.showAlert({
        title: 'Remover produto?',
        description: 'Tem certeza que deseja remover este produto?',
        confirmationText: 'Remover',
        onConfirmation: () => onRemove(name),
        confirmationButtonProps: {
          color: Colors.red40,
        },
      });
    },
    [dialog, onRemove]
  );

  function renderRow(product: NewProductType, index: number): JSX.Element {
    return (
      <ListItem height={77.5} onPress={() => handleNavigateToEditNewProduct(product, index)}>
        <ListItem.Part left marginH-14>
          <Image source={{ uri: product.image_url }} style={style.listItemImage} resizeMode='contain' />
        </ListItem.Part>
        <ListItem.Part middle column>
          <ListItem.Part containerStyle={{ marginBottom: 2 }}>
            <Text grey10 text70 flex>
              {product.name}
            </Text>
            <TouchableOpacity
              paddingH-s2
              onPress={() => {
                handleRemoveProduct(product.name);
              }}>
              <Feather name='trash-2' size={Typography.text50?.fontSize} color={Colors.red20} />
            </TouchableOpacity>
          </ListItem.Part>
          <ListItem.Part>
            {product.productType === 3 ? (
              <Text text90 grey30>
                De {formatPrice(product.price2)}
              </Text>
            ) : null}
            {product.productType === 2 ? (
              <Text text90 grey30>
                De {formatPrice(product.price2)}
              </Text>
            ) : null}
            <Text text90 marginR-150 marginH-15 grey30>
              Por {formatPrice(product.price)}
            </Text>
          </ListItem.Part>
        </ListItem.Part>
      </ListItem>
    );
  }

  return (
    <>
      <View style={style.container}>
        <Text primary text65BL marginV-s2>
          1. Adicione produtos
        </Text>
        <Text text750BL color={Colors.grey20}>
          Os produtos que você adicionar nessa lista serão adicionados na arte de propaganda.
        </Text>
      </View>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <FlatList<NewProductType>
          data={data}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => renderRow(item, index)}
          keyExtractor={(item, key) => key.toString()}
        />
      </ScrollView>

      <Button
        color={Colors.grey20}
        backgroundColor={Colors.grey70}
        animateLayout
        label='Adicionar produto'
        onPress={handleNavigateToNewProduct}
      />

      <Button
        disabled={disableGoNextStep}
        color={disableGoNextStep ? Colors.grey40 : Colors.white}
        marginT-s4
        disabledBackgroundColor={Colors.grey70}
        animateLayout
        label='Continuar'
        onPress={handleNextPage}
      />
      <CampaignNameDialog visible={campaignNameModalIsOpen} onRequestClose={handleCampaignName} />
    </>
  );
}
