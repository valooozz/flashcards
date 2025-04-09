import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import { StyleSheet, TouchableOpacity } from 'react-native';

interface BackButtonProps {
  color: string;
  route: string;
}

export function SettingsButton({ color, route }: BackButtonProps) {
  return (
    <TouchableOpacity onPress={() => router.push(route)} style={style.button}>
      <MaterialIcons name="settings" size={40} color={color} />
    </TouchableOpacity>
  );
}

const style = StyleSheet.create({
  button: { position: 'absolute', top: 24, right: 16 },
});
