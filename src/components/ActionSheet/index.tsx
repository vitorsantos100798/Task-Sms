/* eslint-disable react/display-name */
import { map } from 'lodash';
import React, { forwardRef } from 'react';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import { Colors, ListItem, Text, Typography, View } from 'react-native-ui-lib';
import Feather from 'react-native-vector-icons/Feather';

import styles from './styles';

type ActionSheetOption = {
  disabled?: boolean;
  icon?: string;
  title: string;
  onPress: () => void;
};

type ActionSheetProps = {
  title?: string;
  subtitle?: string;
  options: ActionSheetOption[];
  onRequestClose?: () => void;
};

export const ActionSheet = forwardRef<Modalize, ActionSheetProps>(
  ({ title, subtitle, options, onRequestClose }, ref) => {
    function renderContent() {
      return (
        <View flex style={styles.content}>
          {title && (
            <View row style={styles.header}>
              <Text text60M numberOfLines={1}>
                {title}
              </Text>
              {subtitle && (
                <Text marginT-s1 text80R color={Colors.grey20} numberOfLines={1}>
                  {subtitle}
                </Text>
              )}
            </View>
          )}
          <View padding-s3>
            {map(options, option => (
              <ListItem disabled={option.disabled} height={45} onPress={option.onPress}>
                {option.icon && (
                  <ListItem.Part left containerStyle={styles.listItemIcon}>
                    <Feather name={option.icon} color={Colors.grey10} size={Typography.text60?.fontSize} />
                  </ListItem.Part>
                )}
                <ListItem.Part middle column>
                  <ListItem.Part>
                    <Text grey10 text70R numberOfLines={1}>
                      {option.title}
                    </Text>
                  </ListItem.Part>
                </ListItem.Part>
              </ListItem>
            ))}
          </View>
        </View>
      );
    }

    return (
      <Portal>
        <Modalize ref={ref} withHandle={false} adjustToContentHeight onClose={onRequestClose}>
          {renderContent()}
        </Modalize>
      </Portal>
    );
  }
);
