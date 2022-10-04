import React, { useState } from 'react';
import {
  Button,
  Colors,
  Dialog,
  PanningProvider,
  RadioButton,
  Text,
  TouchableOpacity,
  View,
} from 'react-native-ui-lib';

import { widthPercentageToDP } from '../../utils/dimensions';
import styles from './styles';

export type DistributionType = 'myCustomers' | 'newCustomers';

type SelectDistributionTypeDialogProps = {
  visible: boolean;
  onSubmit: (type: DistributionType) => void;
  onRequestClose: () => void;
};

export function SelectDistributionTypeDialog({ visible, onSubmit, onRequestClose }: SelectDistributionTypeDialogProps) {
  const [distributionType, setDistributionType] = useState<DistributionType>();

  function handleDistributionTypeChange(value: DistributionType) {
    setDistributionType(value);
  }

  const selectedOptionStyle = {
    borderWidth: 1,
    borderColor: Colors.primary,
  };

  function handleSubmit() {
    if (distributionType) {
      onSubmit(distributionType);
    }
  }

  return (
    <Dialog
      visible={visible}
      height={450}
      onDismiss={onRequestClose}
      panDirection={PanningProvider.Directions.DOWN}
      width={widthPercentageToDP('90%')}
      containerStyle={{
        backgroundColor: Colors.white,
        borderRadius: 8,
      }}>
      <View flex>
        <View style={styles.header}>
          <Text text60M>Selecione um tipo de distribuição</Text>
        </View>
        <View flex padding-page>
          <View marginB-s8>
            <TouchableOpacity
              style={[styles.option, distributionType === 'myCustomers' && selectedOptionStyle]}
              onPress={() => {
                handleDistributionTypeChange('myCustomers');
              }}>
              <Text text70R>Meus clientes</Text>
              <RadioButton selected={distributionType === 'myCustomers'} color={Colors.primary} />
            </TouchableOpacity>
            <Text text80R>Publicação para clientes que seguem suas redes sociais.</Text>
          </View>
          <View>
            <TouchableOpacity
              style={[styles.option, distributionType === 'newCustomers' && selectedOptionStyle]}
              onPress={() => {
                handleDistributionTypeChange('newCustomers');
              }}>
              <Text text70R>Novos clientes</Text>
              <RadioButton selected={distributionType === 'newCustomers'} color={Colors.primary} />
            </TouchableOpacity>
            <Text text80R>Publicação para possíveis novos clientes em um ou mais bairros da cidade.</Text>
          </View>
        </View>
        <View style={styles.actions}>
          <Button link label='Cancelar' color={Colors.blue50} onPress={onRequestClose} />
          <Button label='Continuar' onPress={handleSubmit} />
        </View>
      </View>
    </Dialog>
  );
}
