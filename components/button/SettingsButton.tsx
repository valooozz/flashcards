import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import { TouchableOpacity } from 'react-native';

interface BackButtonProps {
  color: string;
  route: string;
}

export function SettingsButton({ color, route }: BackButtonProps) {
  return (
    <TouchableOpacity onPress={() => router.push(route)}>
      <MaterialIcons name="settings" size={40} color={color} />
    </TouchableOpacity>
  );
}
