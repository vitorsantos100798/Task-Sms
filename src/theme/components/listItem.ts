import { Colors, ListItemProps } from 'react-native-ui-lib';
import { colors } from '../designSystem';

const primaryColor = colors?.primary ? colors?.primary : '#2813AD';

export const listItemDefaultProps: ListItemProps = {
  activeBackgroundColor: Colors.rgba(primaryColor, 0.1),
  activeOpacity: 0.8,
};
