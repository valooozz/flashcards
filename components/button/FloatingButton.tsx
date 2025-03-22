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
    borderRadius: '50%',
    boxShadow:
      'rgba(17, 17, 26, 0.1) 0px 8px 24px, rgba(17, 17, 26, 0.1) 0px 16px 56px, rgba(17, 17, 26, 0.1) 0px 24px 80px',
  },
});
