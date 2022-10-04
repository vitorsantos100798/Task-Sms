/* eslint-disable @typescript-eslint/no-misused-promises */
import { ArtContext } from '@contexts/Art';
import { ArtContextPropsType } from '@project-types/art.context';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { Formik } from 'formik';
import { map } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native-ui-lib';
import { useMutation } from 'react-query';

import { CampaignHeader } from '../../../components/Campaign/Header';
import { Backgrounds } from '../../../components/NewArt/Backgrounds';
import { Content } from '../../../components/NewArt/Content';
import { Products } from '../../../components/NewArt/Products';
import { Tags } from '../../../components/NewArt/Tags';
import { Templates } from '../../../components/NewArt/Templates';
import { WizardStep } from '../../../components/WizardController/Step';
import { useToast } from '../../../hooks/useToast';
import { createArtService } from '../../../services/arts';
import { createCampaignService } from '../../../services/campaigns';
import { createProductService } from '../../../services/products';
import { queryClient } from '../../../services/queryClient';
import { CreateArtData } from '../../../types/art';
import { AppScreenProp, AppStackParamList } from '../../../types/navigation';

type ProductList = {
  image_url?: string;
  name: string;
  price: number;
};

export function NewArt() {
  const { NewArt, updateArtToEdit } = React.useContext(ArtContext) as ArtContextPropsType;
  const { goBack, setOptions } = useNavigation<AppScreenProp>();
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [products, setProducts] = useState<ProductList[]>([]);
  const { params } = useRoute<RouteProp<AppStackParamList, 'NewArt'>>();

  useEffect(() => {
    setOptions({
      headerTitle: () => <CampaignHeader label={params.campaignName as string} />,
    });
  }, [params.campaignName]);

  const toast = useToast();

  const newArt = useMutation(
    async (data: CreateArtData) => {
      const response = await createArtService(data);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return response;
    },
    {
      onSuccess: () => {
        toast.show('Arte gerada com sucesso!', { variant: 'success' });
        queryClient.invalidateQueries(['campaigns', params.campaignId]);
      },
      onError: () => {
        toast.show('Erro ao gerar as artes', { variant: 'error' });
      },
    }
  );

  const newCampaign = useMutation(
    async (data: CreateArtData) => {
      const responseCampaign = await createCampaignService({
        name: data.campaign.name,
      });
      data.campaign.id = responseCampaign.id;
      const requestProducts = map(data.products, product => {
        const requestProductData = {
          list_id: responseCampaign.id,
          name: product.name,
          productType: product.productType,
          price: product.price,
          price2: product.price2,
          image_url: product.image_url,
        };
        return createProductService(requestProductData);
      });

      await Promise.all(requestProducts);

      await createArtService(data);
      return responseCampaign;
    },
    {
      onSuccess: () => {
        toast.show('Artes geradas com sucesso!', { variant: 'success' });
        queryClient.invalidateQueries(['campaigns']);
      },
      onError: () => {
        toast.show('Erro ao gerar as artes', { variant: 'error' });
      },
    }
  );

  useEffect(() => {
    if (params?.name && params?.price) {
      const newProductData = {
        image_url: params?.image_url,
        name: params?.name,
        productType: params?.productType,
        price: params?.price,
        price2: params?.price2,
      };

      if (typeof NewArt.ProductToEdit === 'number') {
        setProducts(allProducts =>
          allProducts.map((product, index) => (index === NewArt.ProductToEdit ? newProductData : product))
        );
        updateArtToEdit(undefined);
      } else {
        setProducts(prev => [...prev, newProductData]);
      }
    }
  }, [params]);

  const removeProduct = useCallback(
    (name: string) => {
      const tempProducts = [...products];
      const index = products.findIndex(temp => temp.name === name);
      tempProducts.splice(index, 1);
      setProducts(tempProducts);
    },
    [products]
  );

  const onNextPage = useCallback(async () => {
    setActiveIndex(prev => prev + 1);
  }, [activeIndex, products]);

  const handleNewArt = useCallback(async (data: CreateArtData) => {
    if (!params.campaignId) {
      await newCampaign.mutateAsync(data);
    } else {
      await newArt.mutateAsync(data);
    }
    goBack();
  }, []);

  function RenderComponent() {
    switch (activeIndex) {
      case 0:
        return <Products data={products} onRemove={removeProduct} onNext={onNextPage} />;
      case 1:
        return <Backgrounds onNext={onNextPage} />;
      case 2:
        return <Templates onNext={onNextPage} />;
      case 3:
        return <Tags onNext={onNextPage} />;
      case 4:
        return <Content />;
      default:
        return <Products data={products} onRemove={removeProduct} onNext={onNextPage} />;
    }
  }

  function RenderComponentWithCampaignId() {
    switch (activeIndex) {
      case 0:
        return <Backgrounds onNext={onNextPage} />;
      case 1:
        return <Templates onNext={onNextPage} />;
      case 2:
        return <Tags onNext={onNextPage} />;
      case 3:
        return <Content />;
      default:
        return <Backgrounds onNext={onNextPage} />;
    }
  }

  return (
    <View flex padding-page>
      <View marginB-s4>
        <WizardStep steps={params.campaignId ? 4 : 5} activeIndex={activeIndex} />
      </View>
      <Formik
        initialValues={
          {
            campaign: { id: params.campaignId },
            formatId: 1,
            segmentId: 2,
            productQuantity: 1,
            colors: {
              text: '#FFF',
              price: '#000',
            },
          } as any
        }
        onSubmit={handleNewArt}>
        {params.campaignId ? RenderComponentWithCampaignId() : RenderComponent()}
      </Formik>
    </View>
  );
}
