import React from 'react';
import { ActivityIndicator } from 'react-native';
import { Button, Colors, Dialog, PanningProvider, Text, View } from 'react-native-ui-lib';
import { widthPercentageToDP, heightPercentageToDP } from '../../utils/dimensions';
import styles from './styles';

type ConfirmateDistributeDialogProps = {
  channels: string[];
  visible: boolean;
  title: string;
  loading: boolean;
  onClose: () => void;
  onConfirmate: () => void;
};

export function ConfirmateDistributeDialog({
  visible,
  title,
  channels,
  loading,
  onClose,
  onConfirmate,
}: ConfirmateDistributeDialogProps) {
  return (
    <Dialog
      visible={visible}
      height={heightPercentageToDP('40%')}
      onDismiss={onClose}
      panDirection={PanningProvider.Directions.DOWN}
      width={widthPercentageToDP('90%')}
      containerStyle={{
        backgroundColor: Colors.white,
        borderRadius: 8,
      }}>
      <View flex padding-page>
        <View marginB-s2 style={styles.header}>
          <Text text60M>{title}</Text>
        </View>
        <View flex>
          <Text marginB-s3 text70M color={Colors.grey30}>
            Você selecionou os seguintes tipos de distribuição
          </Text>
          {channels.map((channel, index) => (
            <Text key={index.toString()} marginT-s3 text70M color={Colors.grey30}>
              {channel}
            </Text>
          ))}
        </View>

        <View style={styles.actions}>
          <Button link label='Cancelar' color={Colors.black} onPress={onClose} />
          <Button disabled={loading} label={loading ? undefined : 'Confirmar'} onPress={onConfirmate}>
            {loading && <ActivityIndicator color={Colors.white} />}
          </Button>
        </View>
      </View>
    </Dialog>
  );
}
