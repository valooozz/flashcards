import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors } from '../../style/Colors';

interface ButtonModalProps {
  text: string;
  onPress: () => void;
}

export default function ButtonModal({ text, onPress }: ButtonModalProps) {
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
    height: 52,
  },
  text: {
    color: Colors.library.simple.text,
    fontSize: 20,
    textAlign: 'center',
    fontFamily: 'JosefinRegular',
  },
});
