import { StyleSheet, TextInput } from 'react-native';
import { Colors } from '../../style/Colors';
import { Dispatch, SetStateAction } from 'react';

interface InputProps {
  text: string;
  setText: Dispatch<SetStateAction<string>>;
}

export default function Input({ text, setText }: InputProps) {
  return (
    <TextInput
      style={{ ...styles.input }}
      value={text}
      onChangeText={setText}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    height: 52,
    backgroundColor: Colors.library.dark.background,
    color: Colors.library.dark.text,
    padding: 10,
    fontFamily: 'JosefinRegular',
  },
});
