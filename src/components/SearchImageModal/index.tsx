// 👇️ ts-nocheck disables type checking for entire file
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { Modalize, ModalizeProps } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import { Colors, Image, Incubator, TouchableOpacity, Typography, View } from 'react-native-ui-lib';
import Feather from 'react-native-vector-icons/Feather';
import { useQuery } from 'react-query';

import { useCombinedRefs } from '../../hooks/useCombinedRefs';
import api from '../../services/api';
import styles from './styles';

const { TextField } = Incubator;

interface FilterModalProps extends ModalizeProps {
  term?: string;
  onSelectionChange: (value: string) => void;
  onRequestClose: () => void;
}

export const SearchImageModal = forwardRef<Modalize, FilterModalProps>(
  ({ term, onSelectionChange, onRequestClose, ...rest }, ref) => {
    const modalizeRef = useRef(null);
    const combinedRef = useCombinedRefs(ref, modalizeRef);

    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
      if (term) setSearchTerm(term);
    }, [term]);

    function handleClear() {
      setSearchTerm('');
    }

    const { data } = useQuery(['image', searchTerm], async () => {
      const response = await api.get('/lista-ofertas-p1-prd/getSerpApi', {
        params: {
          query: searchTerm,
        },
      });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return response.data.images_results;
    });

    function renderHeader() {
      return (
        <View style={styles.header}>
          <TextField
            migrate
            autoFocus
            placeholder='Buscar endereço'
            autoComplete='off'
            autoCorrect={false}
            value={searchTerm}
            onChangeText={setSearchTerm}
            fieldStyle={styles.searchBar}
            leadingAccessory={
              <TouchableOpacity marginR-s4 activeBackgroundColor={Colors.grey70} onPress={onRequestClose}>
                <Feather name='x' size={Typography.text50?.fontSize} color={Colors.primary} />
              </TouchableOpacity>
            }
            trailingAccessory={
              searchTerm.length > 0 ? (
                <TouchableOpacity activeBackgroundColor={Colors.grey70} onPress={handleClear}>
                  <Feather name='x-circle' size={Typography.text60?.fontSize} color={Colors.grey20} />
                </TouchableOpacity>
              ) : undefined
            }
          />
        </View>
      );
    }

    function renderItem(item: any) {
      return (
        <TouchableOpacity
          flex
          centerV
          margin-s2
          backgroundColor={Colors.grey60}
          padding-s3
          style={styles.listItem}
          onPress={() => {
            onSelectionChange(item.thumbnail);
          }}>
          <Image
            style={styles.listItemImage}
            resizeMethod='resize'
            resizeMode='contain'
            source={{
              uri: item.original,
            }}
          />
        </TouchableOpacity>
      );
    }

    return (
      <Portal>
        <Modalize
          {...rest}
          ref={combinedRef}
          HeaderComponent={renderHeader}
          flatListProps={{
            keyExtractor: (_, index) => `${index}`,
            numColumns: 3,

            data,
            contentContainerStyle: styles.content,
            renderItem: ({ item }) => renderItem(item),
          }}
        />
      </Portal>
    );
  }
);
