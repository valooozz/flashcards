import { StyleSheet, TouchableOpacity } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';

interface FloatingButtonProps {
  icon: any;
  size: number;
  color: string;
  onPress: () => void;
}

export default function FloatingButton({
  icon,
  size,
  color,
  onPress,
}: FloatingButtonProps) {
  return (
    <TouchableOpacity onPress={onPress} style={style.button}>
      <AntDesign name={icon} size={size} color={color} />
    </TouchableOpacity>
  );
}

const style = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: '5%',
    right: '5%',
  },
});
