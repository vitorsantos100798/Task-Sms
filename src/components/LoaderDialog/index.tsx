import React from 'react';
import { Colors, Dialog, LoaderScreen, PanningProvider, View } from 'react-native-ui-lib';

import { heightPercentageToDP, widthPercentageToDP } from '../../utils/dimensions';

type LoaderDialogProps = {
  visible: boolean;
  message?: string;
  onRequestClose: () => void;
};

export function LoaderDialog({ visible, message = 'Aguarde...', onRequestClose }: LoaderDialogProps) {
  return (
    <Dialog
      visible={visible}
      height={heightPercentageToDP('25%')}
      onDismiss={onRequestClose}
      panDirection={PanningProvider.Directions.DOWN}
      ignoreBackgroundPress
      width={widthPercentageToDP('70%')}
      containerStyle={{
        backgroundColor: Colors.white,
        borderRadius: 8,
      }}>
      <View flex center>
        <LoaderScreen color={Colors.primary} message={message} overlay />
      </View>
    </Dialog>
  );
}
