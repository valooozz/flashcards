import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { ColorValue, StyleSheet, TouchableOpacity } from 'react-native';
import { Shadows } from '../../style/Shadows';

interface CancelButtonProps {
  backgroundColor: ColorValue;
  color: ColorValue;
  handleClick?: () => void;
}

export function CancelButton({
  backgroundColor,
  color,
  handleClick,
}: CancelButtonProps) {
  return (
    <TouchableOpacity
      onPress={handleClick}
      style={[styles.button, { backgroundColor }]}
      testID="cancel-button"
    >
      <MaterialCommunityIcons name="arrow-u-left-top" size={40} color={color} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 1,
    borderRadius: '50%',
    width: 56,
    height: 56,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: Shadows.flashCard,
  },
});
