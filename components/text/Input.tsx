import { Dispatch, SetStateAction } from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { Colors } from '../../style/Colors';
import { Sizes } from '../../style/Sizes';

interface InputProps {
  text: string;
  setText: Dispatch<SetStateAction<string>>;
}

export function Input({ text, setText }: InputProps) {
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
    height: Sizes.component.small,
    backgroundColor: Colors.library.dark.main,
    color: Colors.library.dark.contrast,
    padding: 10,
    fontFamily: 'JosefinRegular',
    fontSize: Sizes.font.small,
  },
});
