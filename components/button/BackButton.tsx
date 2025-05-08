import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import { TouchableOpacity } from 'react-native';

interface BackButtonProps {
  color: string;
  action?: () => void;
}

export function BackButton({ color, action }: BackButtonProps) {
  return (
    <TouchableOpacity
      onPress={action !== undefined ? action : () => router.back()}
    >
      <MaterialIcons name="arrow-back" size={40} color={color} />
    </TouchableOpacity>
  );
}
