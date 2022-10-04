import { useIsFocused, useNavigation, useNavigationState } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Linking } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Text, TouchableOpacity, View } from 'react-native-ui-lib';
import Feather from 'react-native-vector-icons/Feather';
import { Camera, CameraPermissionStatus, useCameraDevices } from 'react-native-vision-camera';

import { useToast } from '../../hooks/useToast';
import { AppScreenProp } from '../../types/navigation';
import { heightPercentageToDP } from '../../utils/dimensions';
import { getPreviousRouteFromState } from '../../utils/getPreviousRouteFromState';
import styles from './styles';

export function CameraModal() {
  const cameraRef = useRef<Camera>(null);

  const { top, bottom } = useSafeAreaInsets();

  const { navigate, goBack } = useNavigation<AppScreenProp>();

  const isFocused = useIsFocused();

  const toast = useToast();

  const devices = useCameraDevices();

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-return
  const previousRoute = useNavigationState(s => getPreviousRouteFromState(s));

  const [cameraPermissionStatus, setCameraPermissionStatus] = useState<CameraPermissionStatus>('not-determined');

  const [isFlashActive, setFlashActive] = useState(false);

  const handleFlashToggle = useCallback(() => {
    setFlashActive(prevState => !prevState);
  }, []);

  const handleTakePhoto = useCallback(async () => {
    cameraRef.current
      ?.takePhoto({
        flash: isFlashActive ? 'on' : 'off',
        skipMetadata: true,
      })
      .then(file => {
        navigate(previousRoute.name, { photoPath: `file://${file.path}` });
      })
      .catch(err => {
        toast.show('Erro ao tirar foto', {
          variant: 'error',
        });
      });
  }, [isFlashActive, navigate, previousRoute.name, toast]);

  const requestCameraPermission = useCallback(async () => {
    const permission = await Camera.requestCameraPermission();

    if (permission === 'denied') await Linking.openSettings();

    setCameraPermissionStatus(permission);
  }, []);

  useEffect(() => {
    if (cameraPermissionStatus === 'not-determined') {
      requestCameraPermission();
    }
  }, [cameraPermissionStatus, requestCameraPermission]);

  if (cameraPermissionStatus !== 'authorized') {
    return (
      <View flex center padding-page>
        <Text text60 secondary style={{ textAlign: 'center' }} onPress={requestCameraPermission}>
          <Text text70R grey20 style={{ textAlign: 'center' }}>
            {cameraPermissionStatus === 'not-determined'
              ? 'Permissão para usar a câmera não foi definida'
              : 'Permissão para usar a câmera foi negada'}
          </Text>{' '}
          Permitir acesso
        </Text>
      </View>
    );
  }

  return (
    <View flex>
      <View row spread paddingH-s4 paddingB-s4 height={top + 50} style={styles.headerContainer}>
        <TouchableOpacity onPress={goBack}>
          <Feather name='x' size={24} color={Colors.grey20} />
        </TouchableOpacity>
        <Text text60R>foto</Text>
        <TouchableOpacity onPress={handleFlashToggle}>
          <Feather name={isFlashActive ? 'zap' : 'zap-off'} size={24} color={Colors.grey20} />
        </TouchableOpacity>
      </View>
      {devices.back && (
        <Camera ref={cameraRef} style={styles.cameraContainer} photo device={devices.back} isActive={isFocused} />
      )}
      <View height={bottom + heightPercentageToDP('15%')} center>
        <View
          height={heightPercentageToDP('10%')}
          width={heightPercentageToDP('10%')}
          padding-4
          backgroundColor={Colors.white}
          style={styles.captureButtonContainer}>
          <TouchableOpacity
            backgroundColor={Colors.rgba(Colors.secondary, 0.9)}
            activeBackgroundColor={Colors.rgba(Colors.secondary, 1)}
            style={styles.captureButton}
            onPress={handleTakePhoto}
          />
        </View>
      </View>
    </View>
  );
}
