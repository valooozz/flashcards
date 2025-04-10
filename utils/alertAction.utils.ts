import { Alert } from 'react-native';

export const alertAction = (
  actionVerb: string,
  element: string,
  actionToPerform: () => void,
) => {
  Alert.alert(
    `${actionVerb} ?`,
    `Êtes vous sûr·e de vouloir ${actionVerb.toLowerCase()} ${element} ?`,
    [
      { text: 'Annuler', style: 'cancel' },
      { text: actionVerb, style: 'destructive', onPress: actionToPerform },
    ],
    {
      cancelable: true,
    },
  );
};
