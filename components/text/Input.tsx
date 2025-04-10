import { Dispatch, MutableRefObject, SetStateAction } from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { Colors } from '../../style/Colors';
import { Sizes } from '../../style/Sizes';

interface InputProps {
  text: string;
  setText: Dispatch<SetStateAction<string>>;
  underline: boolean;
  autofocus?: boolean;
  innerRef?: MutableRefObject<TextInput>;
}

export function Input({
  text,
  setText,
  underline,
  autofocus = false,
  innerRef,
}: InputProps) {
  return (
    <TextInput
      style={{
        ...styles.input,
        textDecorationLine: underline ? 'underline' : 'none',
      }}
      value={text}
      onChangeText={setText}
      autoFocus={autofocus}
      ref={innerRef}
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
