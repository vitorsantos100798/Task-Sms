import { useFormikContext } from 'formik';
import React, { forwardRef, useRef, useState } from 'react';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import { Button, Colors, Slider, Text, View } from 'react-native-ui-lib';

import { useCombinedRefs } from '../../../../hooks/useCombinedRefs';
import { CreateArtData } from '../../../../types/art';
import styles from './styles';

type ProductQuantityModalProps = {
  // value: number;
  // onChange: (color: string) => void;
  // onSubmit: (color: string) => void;
  onRequestClose: () => void;
};

// eslint-disable-next-line react/display-name
export const ProductQuantityModal = forwardRef<Modalize, ProductQuantityModalProps>(({ onRequestClose }, ref) => {
  const formik = useFormikContext<CreateArtData>();

  const [value, setValue] = useState(formik.values.productQuantity);

  function handleSubmit() {
    formik.setFieldValue('productQuantity', value);
    onRequestClose();
  }

  function renderContent() {
    return (
      <View flex style={styles.content}>
        <View row style={styles.header}>
          <Text text70M numberOfLines={1}>
            Quantidade de produtos
          </Text>
        </View>
        <View>
          <View row centerV marginB-s10>
            <Slider
              disableRTL
              minimumValue={1}
              maximumValue={20}
              step={1}
              containerStyle={styles.slider}
              trackStyle={styles.track}
              thumbStyle={styles.thumb}
              activeThumbStyle={styles.activeThumb}
              thumbTintColor={Colors.white}
              minimumTrackTintColor={Colors.secondary}
              maximumTrackTintColor={Colors.grey60}
              value={1}
              onValueChange={setValue}
            />
            <Text bodySmall grey30 style={{ width: 40 }}>
              {value}
            </Text>
          </View>
          <Button label='Ver Resultados' borderRadius={4} text70M onPress={handleSubmit} />
        </View>
      </View>
    );
  }

  return (
    <Portal>
      <Modalize ref={ref} disableScrollIfPossible adjustToContentHeight>
        {renderContent()}
      </Modalize>
    </Portal>
  );
});
