import { useNotification } from '../context/NotificationContext';

export const useNotify = () => {
  const { showSnackbar } = useNotification();

  return (success: boolean, textError: string, textSuccess?: string, inModal: boolean = false) => {
    if (success) {
      showSnackbar(textSuccess ?? '', { variant: inModal ? 'successInModal' : 'success' });
    } else {
      showSnackbar(textError, { variant: 'error' });
    }
  };
};
