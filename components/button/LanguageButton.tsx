import Ionicons from '@expo/vector-icons/Ionicons';
import { TouchableOpacity } from 'react-native';

interface LanguageButtonProps {
    color: string;
    switchLanguage: () => Promise<void>;
}

export function LanguageButton({ color, switchLanguage }: LanguageButtonProps) {
    return (
        <TouchableOpacity
            onPress={switchLanguage}
            testID="language-button"
        >
            <Ionicons name="language" size={38} color={color} />
        </TouchableOpacity>
    );
}
