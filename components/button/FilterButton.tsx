import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../../style/Colors';
import { Radius } from '../../style/Radius';

interface FilterButtonProps {
    isActive: boolean;
    onToggle: () => void;
    activeColor: string;
    inactiveColor: string;
    testID?: string;
}

export function FilterButton({ isActive, onToggle, activeColor, inactiveColor, testID }: FilterButtonProps) {
    return (
        <TouchableOpacity
            onPress={onToggle}
            style={[styles.filterButton, isActive && styles.filterButtonActive]}
            testID={testID}
        >
            <MaterialIcons
                name="filter-list"
                size={32}
                color={isActive ? activeColor : inactiveColor}
            />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    filterButton: {
        padding: 8,
        marginLeft: 16,
    },
    filterButtonActive: {
        backgroundColor: Colors.library.intermediate.main,
        borderRadius: Radius.small,
    },
});
