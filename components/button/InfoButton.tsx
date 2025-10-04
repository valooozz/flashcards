import { Alert } from 'react-native';
import { IconButton } from 'react-native-paper';

interface InfoButtonProps {
    textLabel: string;
    textExplanation: string;
}

export function InfoButton({ textLabel, textExplanation }: InfoButtonProps) {
    return (
        <IconButton
            icon="information-outline"
            size={20}
            onPress={() => Alert.alert(textLabel, textExplanation)}
            testID='checkbox-info-button'
        />
    );
}
