import { Toast } from 'toastify-react-native';

export const notify = (
  success: boolean,
  textError: string,
  textSuccess?: string,
) => {
  if (success) {
    Toast.show({
      type: 'success',
      text1: textSuccess,
      visibilityTime: 3000,
    });
  } else {
    Toast.show({
      type: 'error',
      text1: textError,
      visibilityTime: 3000,
    });
  }
};
