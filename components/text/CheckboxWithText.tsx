import Checkbox from 'expo-checkbox';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../style/Colors';
import { Sizes } from '../../style/Sizes';
import { InfoButton } from '../button/InfoButton';

interface CheckboxWithTextProps {
  isChecked: boolean;
  setIsChecked: (value: boolean) => void;
  textLabel: string;
  textExplanation?: string;
  spaceTop?: boolean;
}

export function CheckboxWithText({
  isChecked,
  setIsChecked,
  textLabel,
  textExplanation,
  spaceTop = false,
}: CheckboxWithTextProps) {
  return (
    <View style={{ ...styles.checkboxContainer, marginTop: spaceTop ? 16 : 0 }}>
      <Checkbox
        style={styles.checkbox}
        value={isChecked}
        onValueChange={setIsChecked}
        color={Colors.library.dark.main}
      />
      <Text style={styles.text}>
        {textLabel}
      </Text>
      {textExplanation && (
        <InfoButton color={Colors.library.dark.main} textLabel={textLabel} textExplanation={textExplanation} />
      )}
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
