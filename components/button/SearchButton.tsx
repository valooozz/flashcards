import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StyleSheet, TouchableOpacity } from 'react-native';

interface SearchButtonProps {
    searchMode: boolean;
    onToggle: () => void;
    color: string;
    testID?: string;
}

export function SearchButton({ searchMode, onToggle, color, testID }: SearchButtonProps) {
    return (
        <TouchableOpacity
            onPress={onToggle}
            style={styles.searchButton}
            testID={testID}
        >
            <MaterialIcons
                name={searchMode ? "close" : "search"}
                size={32}
                color={color}
            />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    searchButton: {
        padding: 8,
        marginLeft: 8,
    },
});
