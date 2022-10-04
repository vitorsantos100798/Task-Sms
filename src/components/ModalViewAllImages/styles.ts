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
  footer: {
    justifyContent: 'space-around',
    padding: Spacings.s3,
    borderTopColor: Colors.grey60,
    borderTopWidth: 1,
  },
  content: {
    paddingBottom: '20%',
    flex: 1,
  },
  listItemIcon: {
    marginRight: Spacings.s3,
  },
  listContent: {
    paddingHorizontal: Spacings.s2,
  },
});
