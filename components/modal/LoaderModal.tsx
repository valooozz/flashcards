import { StyleSheet, View } from "react-native";
import { ActivityIndicator, Text, useTheme } from "react-native-paper";

interface LoaderModalProps {
    visible: boolean;
    text: string;
}

export const LoaderModal = ({ visible, text }: LoaderModalProps) => {
    const { colors } = useTheme();

    return visible ? (
        <View style={styles.loadingOverlay} pointerEvents="auto" testID="loader-overlay">
            <ActivityIndicator animating={true} size={48} color={colors.onPrimary} />
            <Text variant="headlineMedium" style={[styles.text, { color: colors.onPrimary }]}>
                {text}
            </Text>
        </View>
    ) : null;
}

const styles = StyleSheet.create({
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    text: {
        marginTop: 16,
        paddingHorizontal: 16,
        textAlign: 'center',
    }
});
