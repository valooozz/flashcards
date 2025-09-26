import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import { Alert, TouchableOpacity } from 'react-native';
import { useTranslation } from '../../hooks/useTranslation';

interface BackButtonProps {
  color: string;
  simpleAction?: () => void;
  saveAction?: () => void;
}

export function BackButton({ color, simpleAction, saveAction }: BackButtonProps) {
  
  const { t } = useTranslation();

  const confirmBack = () => {
    Alert.alert(
      t('notifications.leave'),
      t('notifications.notSaved'),
      [
        { text: t('notifications.noQuit'), style: 'cancel' },
        { text: t('notifications.quit'), style: 'destructive', onPress: () => router.back() },
        { text: t('notifications.saveAndQuite'), style: 'default', onPress: saveAction }
      ],
      {
        cancelable: true,
      },
    );
  }

  const onPressAction = saveAction !== undefined ? confirmBack : simpleAction !== undefined ? simpleAction : () => router.back();
  
  return (
    <TouchableOpacity
      onPress={onPressAction}
      testID="back-button"
    >
      <MaterialIcons name="arrow-back" size={40} color={color} />
    </TouchableOpacity>
  );
}
