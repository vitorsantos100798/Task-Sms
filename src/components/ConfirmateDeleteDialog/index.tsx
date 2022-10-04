import React from 'react';
import { Button, Colors, Dialog, PanningProvider, Text, View } from 'react-native-ui-lib';

import { widthPercentageToDP } from '../../utils/dimensions';
import styles from './styles';

type ConfirmateDeleteDialogProps = {
  visible: boolean;
  title: string;
  onClose: () => void;
  onRequestDelete: () => void;
};

export function ConfirmateDeleteDialog({ visible, title, onClose, onRequestDelete }: ConfirmateDeleteDialogProps) {
  return (
    <Dialog
      visible={visible}
      height={200}
      onDismiss={onClose}
      panDirection={PanningProvider.Directions.DOWN}
      width={widthPercentageToDP('90%')}
      containerStyle={{
        backgroundColor: Colors.white,
        borderRadius: 8,
      }}>
      <View flex>
        <View style={styles.header}>
          <Text text60M>{title}</Text>
        </View>

        <View style={styles.actions}>
          <Button link label='Cancelar' color={Colors.black} onPress={onClose} />
          <Button label='Apagar' onPress={onRequestDelete} />
        </View>
      </View>
    </Dialog>
  );
}
