import React from 'react';
import { View, Text, Colors, ViewProps } from 'react-native-ui-lib';
import Feather from 'react-native-vector-icons/Feather';

import styles from './styles';

interface AlertProps extends ViewProps {
  description: string;
  severity: 'success' | 'warning' | 'error' | 'info';
  action?: (color: string) => React.ReactElement;
}

const icons = {
  success: 'check-circle',
  warning: 'alert-triangle',
  error: 'alert-circle',
  info: 'info',
};

const SEVERITY_COLORS = {
  success: {
    backgroundColor: Colors.green80,
    text: Colors.green10,
    icon: Colors.green40,
  },
  warning: {
    backgroundColor: Colors.yellow80,
    text: Colors.yellow10,
    icon: Colors.yellow40,
  },
  error: {
    backgroundColor: Colors.red80,
    text: Colors.red10,
    icon: Colors.red40,
  },
  info: {
    backgroundColor: Colors.blue80,
    text: Colors.blue10,
    icon: Colors.blue40,
  },
};

export function Alert({ description, severity, action, ...rest }: AlertProps) {
  const containerStyle = [styles.container, styles[severity]];

  return (
    <View centerV row paddingH-s3 style={containerStyle} {...rest}>
      <Feather name={icons[severity]} size={24} color={SEVERITY_COLORS[severity].icon} style={styles.icon} />

      <Text body numberOfLines={10} color={SEVERITY_COLORS[severity].text} style={styles.description}>
        {description}
      </Text>

      {action && action(SEVERITY_COLORS[severity].text)}
    </View>
  );
}
