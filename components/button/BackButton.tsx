import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import { TouchableOpacity } from 'react-native';

interface BackButtonProps {
  color: string;
}

export function BackButton({ color }: BackButtonProps) {
  return (
    <TouchableOpacity onPress={() => router.back()}>
      <MaterialIcons name="arrow-back" size={40} color={color} />
    </TouchableOpacity>
  );
}
