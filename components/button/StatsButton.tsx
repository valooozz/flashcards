import Ionicons from '@expo/vector-icons/Ionicons';
import { TouchableOpacity } from 'react-native';

interface StatsButtonProps {
    color: string;
    onPress: () => void;
}

export function StatsButton({ color, onPress }: StatsButtonProps) {
    return (
        <TouchableOpacity onPress={onPress} testID="stats-button">
            <Ionicons name="stats-chart" size={38} color={color} />
        </TouchableOpacity>
    );
}
