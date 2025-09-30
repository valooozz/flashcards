import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { TouchableOpacity } from 'react-native';

interface FlashDeckButtonProps {
  color: string;
  onPress: () => void;
}

export function FlashDeckButton({ color, onPress }: FlashDeckButtonProps) {
  return (
    <TouchableOpacity onPress={onPress} testID="flash-deck-button">
      <MaterialIcons name="flash-on" size={40} color={color} />
    </TouchableOpacity>
  );
}
