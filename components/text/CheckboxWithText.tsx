import Checkbox from 'expo-checkbox';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../style/Colors';
import { Sizes } from '../../style/Sizes';

interface CheckboxWithTextProps {
  isChecked: boolean;
  setIsChecked: (value: boolean) => void;
  textLabel: string;
  spaceTop?: boolean;
}

export function CheckboxWithText({
  isChecked,
  setIsChecked,
  textLabel,
  spaceTop = false,
}: CheckboxWithTextProps) {
  return (
    <View style={styles.checkboxContainer}>
      <Checkbox
        style={{ ...styles.checkbox, marginTop: spaceTop ? 16 : 0 }}
        value={isChecked}
        onValueChange={setIsChecked}
        color={Colors.library.dark.main}
      />
      <Text style={styles.text}>{textLabel}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  checkboxContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 8,
  },
  checkbox: {
    width: Sizes.component.tiny,
    height: Sizes.component.tiny,
  },
  text: {
    textAlign: 'left',
    fontSize: Sizes.font.small,
    fontFamily: 'JosefinRegular',
    flexShrink: 1,
  },
});
