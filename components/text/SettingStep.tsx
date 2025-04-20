import { Dispatch, SetStateAction } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Sizes } from '../../style/Sizes';
import { Input } from './Input';

interface SettingStepProps {
  textLabel: string;
  textInput: string;
  setTextInput: Dispatch<SetStateAction<string>>;
}

export function SettingStep({
  textLabel,
  textInput,
  setTextInput,
}: SettingStepProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.textLabel}>{textLabel}</Text>
      <View style={{ flex: 1 }}>
        <Input text={textInput} setText={setTextInput} numeric />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    columnGap: 8,
    width: Sizes.component.large,
  },
  textLabel: {
    width: Sizes.component.tiny,
    textAlign: 'left',
    fontSize: Sizes.font.small,
    fontFamily: 'JosefinRegular',
  },
});
