import { Dispatch, SetStateAction, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { useTranslation } from '../../hooks/useTranslation';
import { Sizes } from '../../style/Sizes';
import { NumberPickerModal } from '../modal/NumberPickerModal';

interface SettingStepProps {
  stepNumber: number;
  selectedStep: number;
  setSelectedStep: Dispatch<SetStateAction<number>>;
}

export function SettingStep({
  stepNumber,
  selectedStep,
  setSelectedStep,
}: SettingStepProps) {

  const [modalVisible, setModalVisible] = useState(false);
  const numberToChoose = Array.from({ length: 100 }, (_, i) => i + 1);

  const { t } = useTranslation();

  const handleCardPress = () => {
    setModalVisible(true);
  };

  const handleNumberSelect = (value: number) => {
    setSelectedStep(value);
  };

  return (
    <>
      <Card style={styles.container} onPress={handleCardPress}>
        <Card.Content style={styles.content}>
          <Text variant="bodyMedium">{stepNumber} :</Text>
          <Text variant="bodyLarge">{selectedStep}</Text>
        </Card.Content>
      </Card>

      <NumberPickerModal
        visible={modalVisible}
        items={numberToChoose}
        selectedItem={selectedStep}
        onSelect={handleNumberSelect}
        onClose={() => setModalVisible(false)}
        title={`${t('settings.stepSpacing')} ${stepNumber}`}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: Sizes.component.large,
  },
  content: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    columnGap: 16,
  },
  textLabel: {
    width: Sizes.component.tiny,
    textAlign: 'left',
    fontSize: Sizes.font.small,
    fontFamily: 'JosefinRegular',
  },
});
