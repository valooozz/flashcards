import { StyleSheet, View } from 'react-native';
import { Checkbox, Text } from 'react-native-paper';
import { Colors } from '../../style/Colors';
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
      <Text variant='titleMedium'>
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
  },
});
