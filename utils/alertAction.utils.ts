import { Alert } from 'react-native';

export const alertAction = (
  confirmMessage: string,
  actionVerb: string,
  element: string,
  cancelText: string,
  actionToPerform: () => void,
) => {
  Alert.alert(
    `${actionVerb} ?`,
    `${confirmMessage} ${actionVerb.toLowerCase()} ${element} ?`,
    [
      { text: cancelText, style: 'cancel' },
      { text: actionVerb, style: 'destructive', onPress: actionToPerform },
    ],
    {
      cancelable: true,
    },
  );
};
