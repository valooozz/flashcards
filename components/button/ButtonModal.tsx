import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Colors } from '../../style/Colors';
import { Sizes } from '../../style/Sizes';

interface ButtonModalProps {
  text: string;
  onPress: () => void;
}

export function ButtonModal({ text, onPress }: ButtonModalProps) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 10,
    flex: 1,
    backgroundColor: Colors.library.simple.background,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: Sizes.component.small,
  },
  text: {
    color: Colors.library.simple.text,
    fontSize: Sizes.font.small,
    textAlign: 'center',
    fontFamily: 'JosefinRegular',
  },
});
