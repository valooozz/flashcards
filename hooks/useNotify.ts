import { useNotification } from '../context/NotificationContext';

export const useNotify = () => {
  const { showSnackbar } = useNotification();

  return (success: boolean, textError: string, textSuccess?: string) => {
    if (success) {
      showSnackbar(textSuccess ?? '', { variant: 'success' });
    } else {
      showSnackbar(textError, { variant: 'error' });
    }
  };
};
