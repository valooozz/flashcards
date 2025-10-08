import { StyleSheet } from 'react-native';
import { Shadows } from './Shadows';
import { Sizes } from './Sizes';

export const GlobalStyles = StyleSheet.create({
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
  centerText: {
    textAlign: 'center',
    marginVertical: 'auto',
    marginHorizontal: '20%',
    alignSelf: 'center',
  },
  buttonLineContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  flashButtonContainer: {
    display: 'flex',
    flexDirection: 'row',
    height: Sizes.component.large,
    margin: 24,
    marginTop: 0,
    borderBottomRightRadius: 8,
    borderBottomLeftRadius: 8,
    overflow: 'hidden',
    boxShadow: Shadows.flashCard,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
});
