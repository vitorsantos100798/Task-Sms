import React, { createContext, useCallback, useMemo, useState } from 'react';
import { StyleProp, TextStyle } from 'react-native';
import { Assets, ButtonProps, Colors, Incubator, Typography } from 'react-native-ui-lib';

import { BORDER_RADIUS } from '../utils/constants';
import { widthPercentageToDP, heightPercentageToDP } from '../utils/dimensions';

type ToastProviderProps = {
  children: React.ReactNode;
};

type Options = {
  variant?: 'success' | 'error' | 'info' | 'warning';
  visible?: boolean;
  position?: 'top' | 'bottom';
  message?: string;
  messageStyle?: StyleProp<TextStyle>;
  centerMessage?: boolean;
  zIndex?: number;
  elevation?: number;
  action?: ButtonProps;
  showLoader?: boolean;
  onDismiss?: () => void;
  swipeable?: boolean;
  autoDismiss?: number;
  onAnimationEnd?: (visible?: boolean) => void;
  renderAttachment?: () => JSX.Element | undefined;
  // preset?: ToastPresets;
  enableHapticFeedback?: boolean;
  testID?: string;
  // style?: StyleProp<ViewStyle>;
  // containerStyle?: StyleProp<ViewStyle>;
  // icon?: ImageSourcePropType;
  // iconColor?: string;
  backgroundColor?: string;
};

export type ToastContextData = {
  show: (message: string, options?: Options) => void;
  close: () => void;
};

export const ToastContext = createContext<ToastContextData>({} as ToastContextData);

export function ToastProvider({ children }: ToastProviderProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [options, setOptions] = useState<Options>({} as Options);

  const variantOptions = useMemo(() => {
    switch (options.variant) {
      case 'success':
        return {
          backgroundColor: Colors.green40,
          icon: Assets.icons.checkCircle,
          iconColor: Colors.white,
        };
      case 'error':
        return {
          backgroundColor: Colors.red40,
          icon: Assets.icons.alertCircle,
          iconColor: Colors.white,
        };
      case 'info':
        return {
          backgroundColor: Colors.blue40,
          icon: Assets.icons.info,
          iconColor: Colors.white,
        };
      case 'warning':
        return {
          backgroundColor: Colors.yellow40,
          icon: Assets.icons.alertCircle,
          iconColor: Colors.white,
        };
      default:
        return {
          backgroundColor: Colors.grey20,
        };
    }
  }, [options.variant]);

  const show = useCallback(async (toastMessage: string, toastOptions?: Options) => {
    setMessage(toastMessage);
    if (toastOptions) setOptions(toastOptions);
    setIsVisible(true);
  }, []);

  const close = useCallback(() => {
    setIsVisible(false);
  }, []);

  const toastContextData = useMemo(() => {
    return {
      show,
      close,
    };
  }, [close, show]);

  return (
    <ToastContext.Provider value={toastContextData}>
      {children}
      <Incubator.Toast
        position='top'
        visible={isVisible}
        message={message}
        autoDismiss={3500}
        onDismiss={close}
        style={{
          borderRadius: BORDER_RADIUS,
          height: heightPercentageToDP('10%'),
          width: widthPercentageToDP('96%'),
        }}
        messageStyle={[{ color: Colors.white }, Typography.text70M]}
        {...options}
        {...variantOptions}
      />
    </ToastContext.Provider>
  );
}
