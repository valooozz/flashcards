import { StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

interface BackButtonProps {
  color: string;
}

export default function BackButton({ color }: BackButtonProps) {
  return (
    <TouchableOpacity onPress={() => router.back()} style={style.button}>
      <MaterialIcons name="arrow-back" size={40} color={color} />
    </TouchableOpacity>
  );
}

const style = StyleSheet.create({
  button: { position: 'absolute', top: 24, left: 16 },
});
