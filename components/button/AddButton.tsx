import AntDesign from '@expo/vector-icons/AntDesign';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Shadows } from '../../style/Shadows';

interface AddButtonProps {
  icon: any;
  size: number;
  color: string;
  onPress: () => void;
}

export function AddButton({ icon, size, color, onPress }: AddButtonProps) {
  return (
    <TouchableOpacity onPress={onPress} style={style.button}>
      <AntDesign name={icon} size={size} color={color} />
    </TouchableOpacity>
  );
}

const style = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    borderRadius: '50%',
    boxShadow: Shadows.addButton,
  },
});
