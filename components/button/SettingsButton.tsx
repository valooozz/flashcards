import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import { TouchableOpacity } from 'react-native';

interface SettingsButtonProps {
  color: string;
  route: string;
}

export function SettingsButton({ color, route }: SettingsButtonProps) {
  return (
    <TouchableOpacity onPress={() => router.push(route)} testID="settings-button">
      <MaterialIcons name="settings" size={40} color={color} />
    </TouchableOpacity>
  );
}
