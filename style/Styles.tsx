import { StyleSheet } from 'react-native';

export const globalStyles = StyleSheet.create({
  page: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  container: {
    flexGrow: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
  modalContainer: {
    marginTop: 16,
    paddingHorizontal: 8,
    rowGap: 8,
    paddingBottom: 32,
  },
  titleCenter: {
    textAlign: 'center'
  },
  buttonLineContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
});
