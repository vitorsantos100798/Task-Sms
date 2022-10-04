/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { createContext, useCallback, useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Button, ButtonProps, Colors, Dialog, DialogProps, PanningProvider, Text, View } from 'react-native-ui-lib';

import { widthPercentageToDP } from '../utils/dimensions';

type DialogProviderProps = {
  children: React.ReactNode;
};

type Options = DialogProps & {
  title: string;
  description?: string;
  confirmationText?: string;
  cancellationText?: string;
  onConfirmation?: () => void;
  onCancellation?: () => void;
  confirmationButtonProps?: ButtonProps;
  cancellationButtonProps?: ButtonProps;
};

export type DialogContextData = {
  showAlert: (options: Options) => void;
  closeAlert: () => void;
};

export const DialogContext = createContext<DialogContextData>({} as DialogContextData);

export function DialogProvider({ children }: DialogProviderProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState<string>();
  const [confirmationText, setConfirmationText] = useState('Ok');
  const [cancellationText, setCancellationText] = useState('Cancelar');

  const [confirmationButtonProps, setConfirmationButtonProps] = useState<ButtonProps>({});
  const [cancellationButtonProps, setCancellationButtonProps] = useState<ButtonProps>({});

  const [onConfirmation, setOnConfirmation] = useState<() => void>();
  const [onCancellation, setOnCancellation] = useState<() => void>();

  const handleConfirmation = useCallback(() => {
    if (onConfirmation) {
      onConfirmation();
    }
    setIsVisible(false);
  }, [onConfirmation]);

  const handleCancellation = useCallback(() => {
    if (onCancellation) {
      onCancellation();
    }
    setIsVisible(false);
  }, [onCancellation]);

  const showAlert = useCallback(async (options: Options) => {
    setTitle(options.title);
    setDescription(options.description);
    setOnConfirmation(() => () => options.onConfirmation?.());
    setOnCancellation(() => () => options.onCancellation?.());

    if (options.confirmationText) setConfirmationText(options.confirmationText);
    if (options.cancellationText) setCancellationText(options.cancellationText);

    if (options.cancellationButtonProps) setCancellationButtonProps(options.cancellationButtonProps);
    if (options.confirmationButtonProps) setConfirmationButtonProps(options.confirmationButtonProps);

    setIsVisible(true);
  }, []);

  const closeAlert = useCallback(() => {
    setIsVisible(false);
  }, []);

  const dialogContextData = useMemo(() => {
    return {
      showAlert,
      closeAlert,
    };
  }, [closeAlert, showAlert]);

  return (
    <DialogContext.Provider value={dialogContextData}>
      {children}
      <Dialog
        visible={isVisible}
        height={200}
        onDismiss={closeAlert}
        panDirection={PanningProvider.Directions.DOWN}
        width={widthPercentageToDP('90%')}
        containerStyle={{
          backgroundColor: Colors.white,
          borderRadius: 8,
        }}>
        <View flex>
          <View padding-s4 style={styles.header}>
            <Text text60M>{title}</Text>
          </View>
          <View flex padding-s4>
            <Text body color={Colors.grey20} numberOfLines={3}>
              {description}
            </Text>
          </View>
          <View padding-s4 row spread>
            <Button
              link
              label={cancellationText}
              color={Colors.grey20}
              onPress={handleCancellation}
              {...cancellationButtonProps}
            />
            <Button
              link
              label={confirmationText}
              color={Colors.secondary}
              onPress={handleConfirmation}
              {...confirmationButtonProps}
            />
          </View>
        </View>
      </Dialog>
    </DialogContext.Provider>
  );
}

const styles = StyleSheet.create({
  header: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.grey60,
  },
});
