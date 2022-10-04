/* eslint-disable react/display-name */
import React, { forwardRef, useState, useCallback, useEffect } from 'react';
import { ActivityIndicator, Linking } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import { Button, Checkbox, Colors, Text, View, TouchableOpacity } from 'react-native-ui-lib';

import { SocialProfilePages } from '../../types/socialProfile';
import styles from './styles';

type SelectPagesModalProps = {
  title?: string;
  subtitle?: string;
  pagesAlreadyActive?: string[];
  pages?: SocialProfilePages[];
  loading?: boolean;
  onActivate: (pagesId: string[]) => void;
  onClose: () => void;
};

const LINK = 'https://www.instagram.com/accounts/convert_to_professional_account/';

export const SelectPagesModal = forwardRef<Modalize, SelectPagesModalProps>(
  ({ title, subtitle, pages, pagesAlreadyActive, loading, onActivate, onClose }, ref) => {
    const [selectedPagesId, setSelectedPagesId] = useState<string[]>([]);

    useEffect(() => {
      if (pagesAlreadyActive && pages) {
        const pagesActive = pagesAlreadyActive?.filter(pageActive => pages.find(page => pageActive === page.page_id));
        setSelectedPagesId(pagesActive);
      }
    }, [pagesAlreadyActive]);

    const handleSelectedPagesToActivate = useCallback((isSelected: boolean, pageId: string) => {
      if (isSelected) {
        setSelectedPagesId(prev => prev.filter(i => i !== pageId));
      } else {
        setSelectedPagesId(prev => [...prev, pageId]);
      }
    }, []);

    const handleActive = useCallback(() => {
      onActivate(selectedPagesId);
    }, [selectedPagesId]);

    const handleClose = useCallback(() => {
      setSelectedPagesId(selectedPagesId);
      onClose();
    }, [onClose, selectedPagesId]);

    function renderItem(item: SocialProfilePages) {
      const isSelected = selectedPagesId.some(i => i === item.page_id);
      return (
        <TouchableOpacity
          onPress={() => handleSelectedPagesToActivate(isSelected, item.page_id)}
          key={item.page_id}
          paddingV-s2
          row
          style={styles.optionItem}>
          <View flex>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
              }}>
              <Checkbox
                marginT-5
                borderRadius={2}
                size={18}
                disabled={item.instagram_business_account || !isSelected}
                value={isSelected}
              />
              <Text marginL-8 grey10 text70R numberOfLines={1}>
                {item.page_name}
              </Text>
            </View>
            {item.instagram_business_account === Boolean(false) ? (
              <Text color='red'>Esta não é uma conta comercial</Text>
            ) : item.instagram_business_account === Boolean(true) ? null : (
              false
            )}
          </View>
        </TouchableOpacity>
      );
    }

    function renderHeader() {
      return (
        <View row style={styles.header}>
          <Text text60M numberOfLines={1}>
            {title}
          </Text>
          <Text marginT-s1 text80R color={Colors.grey20}>
            {subtitle}
          </Text>
          <TouchableOpacity onPress={() => Linking.openURL(LINK)} marginB-s2>
            <Text text80BO color={Colors.blue40}>
              Saiba mais
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    function renderFooter() {
      return (
        <View row style={styles.footer}>
          <Button
            style={{ height: 50 }}
            link
            borderRadius={0}
            flex
            label='Cancelar'
            color={Colors.grey30}
            onPress={handleClose}
          />
          <Button
            style={{ height: 50 }}
            link
            borderRadius={0}
            flex
            label={loading ? undefined : 'Ativar'}
            onPress={handleActive}>
            {loading && <ActivityIndicator color={Colors.primary} />}
          </Button>
        </View>
      );
    }

    return (
      <Portal>
        <Modalize
          HeaderComponent={renderHeader}
          FooterComponent={renderFooter}
          flatListProps={{
            keyExtractor: item => String(item.page_id),
            contentContainerStyle: styles.listContent,
            numColumns: 1,
            showsVerticalScrollIndicator: false,
            data: pages,
            renderItem: ({ item }) => renderItem(item),
          }}
          ref={ref}
          withHandle={false}
          adjustToContentHeight
          panGestureComponentEnabled
          closeOnOverlayTap={false}
          panGestureEnabled={false}
        />
      </Portal>
    );
  }
);
