import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useMemo, useState, useEffect, useRef } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { Text, View, TouchableOpacity, LoaderScreen, Colors } from 'react-native-ui-lib';
import { useQuery } from 'react-query';

import { useAuth } from '../../hooks/useAuth';
import { listCategoryBySegment, listSubcategory } from '../../services/fastModels';
import { DistributeArts } from '../../types/distribution';
import { Category, Subcategory, SubcategoryBackgrounds } from '../../types/fastModels';
import { AppScreenProp } from '../../types/navigation';
import { Categories } from './Categories';
import styles from './styles';
import { Subcategories } from './Subcategories';

type FastModelsProps = {
  subcategoryDescription?: string;
  subcategoryId?: number;
};

export function FastModels({ subcategoryDescription, subcategoryId }: FastModelsProps) {
  const { user } = useAuth();
  const [selectedImagesId, setSelectedImagesId] = useState<number[]>([]);
  const [currentCategory, setCurrentCategory] = useState<Category>();
  const [description, setdescription] = useState<string | undefined>(subcategoryDescription);
  const [subcategoryID, setSubcategoryID] = useState<number | undefined>(subcategoryId);

  const descriptionRef = useRef<string | undefined>('');
  descriptionRef.current = description;

  const subcategoryIDRef = useRef<number | undefined>();
  subcategoryIDRef.current = subcategoryID;

  const { navigate } = useNavigation<AppScreenProp>();

  const categories = useQuery(
    ['categories', user.segmentId],
    () => listCategoryBySegment({ segmentId: user.segmentId as number }),
    {
      onSuccess: (response: Category[]) => {
        setCurrentCategory(response[0]);
      },
    }
  );

  useEffect(() => {
    setdescription(subcategoryDescription);
    setSubcategoryID(subcategoryId);
  }, [subcategoryDescription]);

  const subcategories = useQuery(['subcategories', currentCategory?.ID, subcategoryIDRef.current], () =>
    listSubcategory({
      categoryId: currentCategory?.ID as number,
      subcategoryId: subcategoryIDRef.current,
    })
  );

  const backgroundsSubcategories = useMemo(() => {
    const backgrounds: any[] = [];
    subcategories.data?.forEach(subcategory =>
      subcategory.backgrounds.forEach(background =>
        backgrounds.push({
          nameCategory: subcategory.DESCRIPTION,
          id: background.id,
          type: 'Post',
          imageURL: background.imageURL,
          formatId: background.formatId,
          designURL: background.designURL,
          name: background.name,
        })
      )
    );
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return backgrounds;
  }, [subcategories.data]);

  const handleSelectedImageIds = useCallback((selected: boolean, item: SubcategoryBackgrounds) => {
    if (selected) {
      setSelectedImagesId(prev => prev.filter(i => i !== item.id));
    } else {
      setSelectedImagesId(prev => [...prev, item.id as number]);
    }
  }, []);

  const handleDistribute = useCallback(() => {
    // eslint-disable-next-line array-callback-return
    const backgrounds = selectedImagesId.map((id: number) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const background = backgroundsSubcategories?.find(background => background.id === id);
      if (background) {
        return {
          artName: background.name,
          artId: background.id,
          artType: background.type,
          artURL: background.imageURL,
          artFormat: background.formatId,
          designURL: background.designURL,
        };
      }
    });

    navigate('Distribute', {
      arts: backgrounds as DistributeArts[],
      isFastModels: true,
    });
  }, [selectedImagesId, backgroundsSubcategories]);

  const handleCancelShare = useCallback(() => {
    setSelectedImagesId([]);
  }, []);

  if (categories.isLoading && subcategories.isLoading) {
    return (
      <View flex center>
        <LoaderScreen color={Colors.primary} message='Carregando...' overlay />
      </View>
    );
  }
  const handlerFunctionsShare = () => {
    // eslint-disable-next-line no-sequences
    return handleDistribute(), handleCancelShare();
  };
  return (
    <View flex>
      <KeyboardAvoidingView behavior={Platform.OS === 'android' ? undefined : 'padding'} style={{ flex: 1 }}>
        <Categories
          category={currentCategory}
          subcategoryDescription={descriptionRef.current}
          categories={categories.data as Category[]}
          onChange={setCurrentCategory}
          setdescription={setdescription}
          setSubcategoryID={setSubcategoryID}
        />
        <Subcategories
          loading={subcategories.isLoading}
          subcategories={subcategories.data as Subcategory[]}
          subcategoriesSelected={selectedImagesId}
          onChange={handleSelectedImageIds}
        />
        {selectedImagesId.length ? (
          <View style={styles.footer}>
            <TouchableOpacity
              activeBackgroundColor='transparent'
              onPress={handleCancelShare}
              paddingV-s3
              paddingH-s2
              flex>
              <Text text70 grey20 center>
                Cancelar
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handlerFunctionsShare}
              activeBackgroundColor='transparent'
              paddingV-s3
              paddingH-s2
              flex>
              <Text text70 color={Colors.primary} center>
                Compartilhar
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <></>
        )}
      </KeyboardAvoidingView>
    </View>
  );
}
