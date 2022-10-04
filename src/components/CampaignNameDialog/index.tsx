import { useFormikContext } from 'formik';
import React from 'react';
import { Button, Colors, Dialog, PanningProvider, Text, View } from 'react-native-ui-lib';

import { CreateArtData } from '../../types/art';
import { widthPercentageToDP } from '../../utils/dimensions';
import { TextField } from '../TextField';
import styles from './styles';

type CampaignNameDialogProps = {
  visible: boolean;
  onRequestClose: () => void;
};

export function CampaignNameDialog({ visible, onRequestClose }: CampaignNameDialogProps) {
  const formik = useFormikContext<CreateArtData>();

  return (
    <Dialog
      ignoreBackgroundPress
      visible={visible}
      height={250}
      width={widthPercentageToDP('90%')}
      containerStyle={{
        backgroundColor: Colors.white,
        borderRadius: 8,
      }}>
      <View flex>
        <View style={styles.header}>
          <Text text60M>Nome para sua propaganda</Text>
        </View>
        <View flex paddingH-page>
          <TextField
            label='Nome'
            autoCorrect={false}
            autoCapitalize='none'
            returnKeyType='done'
            value={formik.values.campaign?.name}
            onChangeText={formik.handleChange('campaign.name')}
            errorText={formik.errors.campaign?.name}
            error={Boolean(formik.errors.campaign?.name)}
          />
        </View>
        <View style={styles.actions}>
          <Button label='Confirmar' onPress={onRequestClose} />
        </View>
      </View>
    </Dialog>
  );
}
