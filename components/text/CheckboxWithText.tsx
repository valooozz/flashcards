import { StyleSheet, View } from 'react-native';
import { Checkbox, Text } from 'react-native-paper';
import { InfoButton } from '../button/InfoButton';

interface CheckboxWithTextProps {
  isChecked: boolean;
  setIsChecked: (value: boolean) => void;
  textLabel: string;
  textExplanation?: string;
}

export function CheckboxWithText({
  isChecked,
  setIsChecked,
  textLabel,
  textExplanation,
}: CheckboxWithTextProps) {
  return (
    <View style={styles.checkboxContainer}>
      <Checkbox
        status={isChecked ? 'checked' : 'unchecked'}
        onPress={() => setIsChecked(!isChecked)}
      />
      <View style={styles.textContainer}>
        <Text variant='titleMedium' style={styles.text}>
          {textLabel}
        </Text>
      </View>
      {textExplanation && (
        <InfoButton textLabel={textLabel} textExplanation={textExplanation} />
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
  },
  textContainer: {
    flexShrink: 1,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  text: {
    flex: 1,
    flexWrap: 'wrap',
  },
});
