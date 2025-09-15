import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Shadows } from '../../style/Shadows';
import { Sizes } from '../../style/Sizes';

interface FlashButtonProps {
  text: string;
  backgroundColor: string;
  textColor: string;
  handleClick: () => void;
}

export function FlashButton({
  text,
  backgroundColor,
  textColor,
  handleClick,
}: FlashButtonProps) {
  return (
    <TouchableOpacity
      style={{ ...styles.container, backgroundColor: backgroundColor }}
      onPress={handleClick}
      testID="flash-button"
    >
      <Text numberOfLines={1} adjustsFontSizeToFit style={{ ...styles.text, color: textColor }}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
    boxShadow: Shadows.flashCard,
  },
  text: {
    textAlign: 'center',
    fontSize: Sizes.font.small,
    fontFamily: 'JosefinRegular',
    marginBottom: 8,
    marginHorizontal: 8,
  },
});
