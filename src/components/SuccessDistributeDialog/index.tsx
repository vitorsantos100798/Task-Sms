import React from 'react';
import { ScrollView } from 'react-native';
import { Button, Colors, Dialog, PanningProvider, Text, View, Image } from 'react-native-ui-lib';

import { widthPercentageToDP, heightPercentageToDP } from '../../utils/dimensions';
import styles from './styles';

type SuccessDistributeDialogProps = {
  visible: boolean;
  title: string;
  errors?: string[];
  onClose: () => void;
};

export function SuccessDistributeDialog({ visible, title, errors, onClose }: SuccessDistributeDialogProps) {
  return (
    <Dialog
      visible={visible}
      height={heightPercentageToDP('70%')}
      onDismiss={onClose}
      panDirection={PanningProvider.Directions.DOWN}
      width={widthPercentageToDP('90%')}
      containerStyle={{
        backgroundColor: Colors.white,
        borderRadius: 8,
      }}>
      <View flex padding-page>
        <ScrollView style={{ flex: 1 }}>
          <View marginB-s2>
            <Text text60M>{title}</Text>
          </View>
          <View flex>
            <Text marginB-s3 text70M color={Colors.grey30}>
              Suas artes já estão sendo processadas e serão disparadas.
            </Text>
            <View center marginV-s5>
              <Image resizeMode='contain' assetGroup='distribute' assetName='completed' />
            </View>

            {errors &&
              errors.length &&
              errors.map((erro, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <Text key={index.toString()} text70M numberOfLines={10} color={Colors.red10}>
                  {erro}
                </Text>
              ))}
          </View>
        </ScrollView>
        <View center>
          <Button label='Ok, entendi' onPress={onClose} />
        </View>
      </View>
    </Dialog>
  );
}
