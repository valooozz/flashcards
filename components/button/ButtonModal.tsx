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
    borderWidth: 1,
    borderColor: Colors.library.main,
    borderRadius: 10,
    paddingHorizontal: 10,
    flex: 1,
  },
  text: {
    color: Colors.library.main,
    fontSize: 25,
    textAlign: 'center',
  },
});
