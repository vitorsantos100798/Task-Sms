import { StyleSheet } from 'react-native';
import { Spacings, Colors } from 'react-native-ui-lib';

export default StyleSheet.create({
  footerContent: {
    justifyContent: 'space-between',
    borderTopColor: Colors.grey60,
    borderTopWidth: 1,
    padding: Spacings.s2,
  },
  FormatTabControllerTextContainer: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
  },
  NumberSelect: {
    marginRight: 10,
    backgroundColor: '#2B13AD',
    width: 20,
    borderRadius: 25,
    textAlign: 'center',
    color: 'white',
    fontFamily: ' montserrat',
    fontWeight: '700',
  },
  NumberDeselect: {
    marginRight: 10,
    backgroundColor: '#B0B0B0',
    width: 20,
    borderRadius: 25,
    textAlign: 'center',
    color: 'white',
    fontFamily: ' montserrat',
    fontWeight: '700',
    opacity: 0.4,
  },
  TextSelect: {
    color: '#2B13AD',
    fontFamily: ' montserrat',
    fontWeight: '600',
  },
  TextDeselect: {
    color: '#B0B0B0',
    fontFamily: ' montserrat',
    fontWeight: '600',
    opacity: 0.4,
  },
});
