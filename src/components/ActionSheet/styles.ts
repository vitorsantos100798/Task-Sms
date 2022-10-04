import { StyleSheet } from 'react-native';
import { Spacings, Colors } from 'react-native-ui-lib';

export default StyleSheet.create({
  header: {
    padding: Spacings.s3,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    flexDirection: 'column',
    borderBottomColor: Colors.grey60,
    borderBottomWidth: 1,
  },
  content: {
    paddingBottom: '20%',
  },
  listItemIcon: {
    marginRight: Spacings.s3,
  },
});
