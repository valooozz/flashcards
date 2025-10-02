import { Dispatch, MutableRefObject, SetStateAction } from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { Colors } from '../../style/Colors';
import { Sizes } from '../../style/Sizes';

interface InputProps {
  text: string;
  setText: Dispatch<SetStateAction<string>>;
  numeric?: boolean;
  underline?: boolean;
  autofocus?: boolean;
  innerRef?: MutableRefObject<TextInput>;
  backgroundColor?: string;
  color?: string;
}

export function Input({
  text,
  setText,
  numeric = false,
  underline = false,
  autofocus = false,
  innerRef,
  backgroundColor = Colors.library.dark.main,
  color = Colors.library.dark.contrast
}: InputProps) {
  return (
    <TextInput
      style={{
        ...styles.input,
        textDecorationLine: underline ? 'underline' : 'none',
        backgroundColor,
        color
      }}
      value={text}
      onChangeText={setText}
      keyboardType={numeric ? 'numeric' : 'default'}
      autoFocus={autofocus}
      ref={innerRef}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    height: Sizes.component.small,
    padding: 10,
    fontFamily: 'JosefinRegular',
    fontSize: Sizes.font.small,
  },
});
