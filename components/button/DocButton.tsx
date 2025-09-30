import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { TouchableOpacity } from 'react-native';

interface DocButtonProps {
    color: string;
    openDoc: () => void;
}

export function DocButton({ color, openDoc }: DocButtonProps) {
    return (
        <TouchableOpacity
            onPress={openDoc}
            testID="doc-button"
        >
            <MaterialIcons name="help-outline" size={40} color={color} />
        </TouchableOpacity>
    );
}
