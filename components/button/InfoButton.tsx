import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Alert, Pressable } from 'react-native';
import { Sizes } from '../../style/Sizes';

interface InfoButtonProps {
    color: string;
    textLabel: string;
    textExplanation: string;
}

export function InfoButton({ color, textLabel, textExplanation }: InfoButtonProps) {
    return (
        <Pressable
            onPress={() => Alert.alert(textLabel, textExplanation)}
            accessibilityRole='button'
            accessibilityLabel='information'
            testID='checkbox-info-button'
        >
            <MaterialIcons
                name='info-outline'
                size={Sizes.font.small}
                color={color}
            />
        </Pressable>
    );
}
